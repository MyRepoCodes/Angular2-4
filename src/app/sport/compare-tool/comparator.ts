function diff(a, b) {
  const x = a - b;
  if (x < 0) {
    return x * -1;
  }
  return x;
}

function sortByCorrectIndex(obj, other) {
  if (obj.correctIndex > other.correctIndex) {
    return 1;
  } else if (obj.correctIndex < other.correctIndex) {
    return -1;
  } else {
    return 0;
  }
}

function sortByDThenByLcs(obj, other) {
  if (obj.d > other.d) {
    return 1;
  } else if (obj.d < other.d) {
    return -1;
  }

  // Else go to the 2nd item
  if (obj.lcs < other.lcs) {
    return 1;
  } else if (obj.lcs > other.lcs) {
    return -1;
  } else { // nothing to split them
    return 0;
  }
}

export class Comparator {

  /**
   * Longest common subsequence
   * https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
   */
  public static LCS(a: any[] = [], b: any[] = []) {
    const m = a.length, n = b.length, C = [];
    let i, j;
    for (i = 0; i <= m; i++) {
      C.push([0]);
    }
    for (j = 0; j < n; j++) {
      C[0].push(0);
    }
    for (i = 0; i < m; i++) {
      for (j = 0; j < n; j++) {
        C[i + 1][j + 1] = a[i] === b[j] ? C[i][j] + 1 : Math.max(C[i + 1][j], C[i][j + 1]);
      }
    }
    let count = 0;
    // tslint:disable-next-line
    return (function bt(i, j) {
      count++;
      if (i * j === 0) {
        return [];
      }
      if (a[i - 1] === b[j - 1]) {
        return bt(i - 1, j - 1).concat({ e: a[i - 1], a: i - 1, b: j - 1 });
      }
      return (C[i][j - 1] > C[i - 1][j]) ? bt(i, j - 1) : bt(i - 1, j);
    }(m, n));
  }

  /**
   * It search for closest 'spValue', then search first item where first 'summary' tag is the same.
   *
   * Nearest neighbor search
   * https://en.wikipedia.org/wiki/Nearest_neighbor_search
   */
  public static nn(elem, arr, exclude) {
    const excludeIsSet = !!exclude;
    if (!excludeIsSet) {
      throw new Error('exclude should be set.');
    }

    if (arr.length === 0) {
      return { a: elem, b: arr[-1], i: -1 };
    }

    let d = diff(elem.spValue, arr[0].spValue);
    let index = -1;
    const ds = [];

    for (let i = 0; i < arr.length; i++) {
      if (exclude.indexOf(i) === -1) {
        const dx = diff(elem.spValue, arr[i].spValue);
        ds.push({ i: i, d: dx, lcs: Comparator.LCS(elem.summary, arr[i].summary).length });

        if (d >= dx) {
          d = dx;
          index = i;
        }
      }
    }

    const notSorted = Array.from(ds);
    const sorted = notSorted.sort(sortByDThenByLcs);

    // todo: do not remove, it's for debug
    // console.log(sorted);
    // let sameDiff = ds.filter(e => e.d === d);

    // search for first same element
    let resultIndex = -1;
    for (const e of sorted) {
      // e.lcs > 1 means we have more then one tag in common,
      // because 'summary' always starts with 'Enter Level N Events'
      // where N is Phase number
      if (e.lcs > 1) {
        resultIndex = e.i;
        break;
      }

      // todo: do not remove, it's for testing
      // if (arr[e.i].summary[0] === elem.summary[0]) {
      //   resultIndex = e.i;
      //   break;
      // }
    }

    exclude.push(resultIndex);

    // todo: do not remove, it's for debug
    // console.log(exclude);

    return {
      a: elem, b: arr[resultIndex], i: resultIndex
    };
  }

}

type TimeStatus = 'ok' | 'early' | 'late' | 'none';
type ComparationResult = {
  trainee: any,
  correct: any,
  traineeIndex: number,
  correctIndex: number,
  missed: string[]
};

type CompareData = { streamPosition: any, spValue: number, summary: any };

export class CompareTool {
  public compare(traineeData: CompareData[], correctData: CompareData[]): ComparationResult[] {
    // if 'Comparator.nn' will find equals records it will add index of 'correctData'
    // to 'itemsToExclude' array, so on the next cycle we can filter
    // 'correctData' and exclude items we already find equals
    // we need this because of sometimes we have events happens same time
    const itemsToExclude = [];
    const comparedData: ComparationResult[] = [];

    for (let i = 0; i < traineeData.length; i++) {
      // search for nearest correct data
      const nearest = Comparator.nn(traineeData[i], correctData, itemsToExclude);
      const result = {
        trainee: Object.assign({}, nearest.a),
        correct: Object.assign({}, nearest.b),
        correctIndex: nearest.i,
        traineeIndex: i,
        missed: []
      };

      // compare with longest common sequence
      const x = Comparator.LCS(result.trainee.summary, result.correct.summary);

      result.trainee.checked = this.checkComparationResult(x, e => e.a, result.trainee.summary, 'red');
      result.correct.checked = this.checkComparationResult(x, e => e.b, result.correct.summary, 'green');

      const cx = x.map(e => e.b);
      const summary = result.correct.summary || [];
      result.missed = summary.filter((v, ix) => cx.indexOf(ix) === -1);

      result.trainee.timeStatus = this.calculateTimeStatus(result.trainee.spValue, result.correct.spValue);

      comparedData.push(Object.assign({}, result));
    }

    comparedData.sort(sortByCorrectIndex);
    // todo: DO NOT remove commented code. it's for debugging
    // console.log('compared', comparedData.map(e => e.correctIndex));

    const res: ComparationResult[] = [];
    let lastCorrectIndex = -1;
    for (const d of comparedData) {
      if (d.correctIndex === -1) {
        // todo: DO NOT remove commented code. it's for debugging
        // console.log('f_ci: ', lastCorrectIndex);
        // console.log('fd_ci:', d.correctIndex);
        let cdx = correctData.map((v, i) => ({
          v: v,
          i: i
        })).filter(e => e.v.spValue < d.trainee.spValue && e.i > lastCorrectIndex);
        cdx = cdx.filter(e => itemsToExclude.indexOf(e.i) === -1);
        if (cdx.length) {
          lastCorrectIndex = cdx[cdx.length - 1].i;

          for (const cd of cdx) {
            const checked = this.checkComparationResult(cd.v.summary, e => e, cd.v.summary, '');
            const correct = Object.assign({}, cd.v, { checked: checked });
            res.push(Object.assign({}, { trainee: {}, traineeIndex: -1, correct: correct, correctIndex: cd.i, missed: [] }));
          }
          res.push(Object.assign({}, Object.assign({}, d)));
        } else {
          res.push(Object.assign({}, Object.assign({}, d)));
        }
      } else {
        // todo: DO NOT remove commented code. it's for debugging
        // console.log('s_ci: ', lastCorrectIndex);
        // console.log('sd_ci:', d.correctIndex);
        let cdx = correctData.map((v, i) => ({
          v: v,
          i: i
        })).filter(e => e.i > lastCorrectIndex && e.i < d.correctIndex);
        cdx = cdx.filter(e => itemsToExclude.indexOf(e.i) === -1);

        // todo: DO NOT remove commented code. it's for debugging
        // console.log('cdx_l: ', cdx.length);
        // console.log('cdx: ', cdx.map(e => e.v.summary));

        for (const cd of cdx) {
          res.push({
            trainee: {},
            traineeIndex: -1,
            correct: Object.assign({}, cd.v, { checked: cd.v.summary.map(e => ({ color: '', element: e })) }),
            correctIndex: cd.i,
            missed: []
          });
        }
        lastCorrectIndex = d.correctIndex;
        res.push(d);
      }
    }

    // todo: DO NOT remove commented code. it's for debugging
    // console.log('rl: ', res.length);
    // console.log('lci: ', lastCorrectIndex);
    // console.log('cdl: ', correctData.length);
    // console.log('cr: ', res.map((v, i) => v.correctIndex));

    lastCorrectIndex += 1;

    while (lastCorrectIndex < correctData.length) {
      // todo: DO NOT remove commented code. it's for debugging
      // console.log('lci: ', lastCorrectIndex);
      const x = correctData[lastCorrectIndex];

        res.push({
          trainee: {},
          traineeIndex: -1,
          correct: Object.assign({}, x, { checked: x.summary.map(e => ({ color: '', element: e })) }),
          correctIndex: lastCorrectIndex,
          missed: []
        });

      lastCorrectIndex++;
    }

    return res;
  }

  private calculateTimeStatus(timeToCheck = -1, correctTime = -1, maxDiff = 1000): TimeStatus {
    if (timeToCheck === -1 || correctTime === -1) {
      return 'none';
    }

    const timeDiff = timeToCheck - correctTime;
    const negativeMaxDiff = maxDiff * (-1);
    if (timeDiff < maxDiff && timeDiff > negativeMaxDiff) {
      return 'ok';
    } else if (timeDiff < negativeMaxDiff) {
      return 'early';
    } else {
      return 'late';
    }
  }

  private checkComparationResult(x, mapFn, summary: any[] = [], color) {
    const tx = x.map(mapFn);
    const checked = summary.map((e, i) => {
      if (tx.indexOf(i) !== -1) {
        return { element: e, color: '' };
      } else {
        return { element: e, color: color };
      }
    });

    return checked;
  }
}
