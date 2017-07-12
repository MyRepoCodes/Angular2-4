import { Comparator, CompareTool } from './comparator';

describe('Comparator', () => {

  const traineeSample = {
    trainee: {
      streamPosition: 1,
      spValue: 1,
      summary: ['a', 'b', 'c'],
      checked: [
        { element: 'a', color: 'red' },
        { element: 'b', color: 'red' },
        { element: 'c', color: 'red' }
      ],
      timeStatus: 'none'
    },
    correct: { checked: [] },
    correctIndex: -1,
    traineeIndex: 0,
    missed: []
  };

  const sampleOne = {
    trainee: {
      streamPosition: 1,
      spValue: 1,
      summary: ['a', 'b', 'c'],
      checked: [
        { element: 'a', color: '' },
        { element: 'b', color: '' },
        { element: 'c', color: '' }
      ],
      timeStatus: 'ok'
    },
    correct: {
      streamPosition: 1,
      spValue: 1,
      summary: ['a', 'b', 'c'],
      checked: [
        { element: 'a', color: '' },
        { element: 'b', color: '' },
        { element: 'c', color: '' }
      ]
    },
    correctIndex: 0,
    traineeIndex: 0,
    missed: []
  };

  it('Trainee data only', () => {
    const trainee = [{ streamPosition: 1, spValue: 1, summary: ['a', 'b', 'c'] }];
    const correct = [];
    const ct = new CompareTool();
    const result = ct.compare(trainee, correct);
    const r = [Object.assign({}, traineeSample)];
    expect(result).toEqual(r);
  });

  it('Compare one', () => {
    const trainee = [
      { streamPosition: 1, spValue: 1, summary: ['a', 'b', 'c'] }
    ];
    const correct = [
      { streamPosition: 1, spValue: 1, summary: ['a', 'b', 'c'] }
    ];
    const ct = new CompareTool();
    const result = ct.compare(trainee, correct);
    const r = [Object.assign({}, sampleOne)];
    expect(result).toEqual(r);
  });

  it('Compare multi', () => {
    const trainee = [
      { streamPosition: 2000, spValue: 2000, summary: ['a', 'b', 'c'] }
    ];
    const correct = [
      { streamPosition: 0, spValue: 0, summary: ['x', 'y', 'z'] },
      { streamPosition: 2000, spValue: 2000, summary: ['a', 'b', 'c'] },
      { streamPosition: 2001, spValue: 2001, summary: ['a', 'x', 'c'] },
      { streamPosition: 2002, spValue: 2002, summary: ['a', 'x', 'c'] },
      { streamPosition: 2003, spValue: 2003, summary: ['a', 'x', 'c'] },
    ];
    const ct = new CompareTool();
    const result = ct.compare(trainee, correct);

    expect(result.length).toEqual(5);
    expect(result[0].correctIndex).toEqual(0, 'c0');
    expect(result[0].traineeIndex).toEqual(-1);
    expect(result[0].trainee).toEqual({});
    expect(result[0].correct.spValue).toEqual(0);

    expect(result[1].correctIndex).toEqual(1, 'c1');
    expect(result[1].traineeIndex).toEqual(0);

    expect(result[2].correctIndex).toEqual(2, 'c2');
    expect(result[2].traineeIndex).toEqual(-1);

    expect(result[3].correctIndex).toEqual(3, 'c3');
    expect(result[3].traineeIndex).toEqual(-1);

    expect(result[4].correctIndex).toEqual(4, 'c4');
    expect(result[4].traineeIndex).toEqual(-1);
  });

  it('Correct data is in proper order', () => {
    const trainee = [
      { streamPosition: 2000, spValue: 2000, summary: ['a', 'x', 'y'] },
      { streamPosition: 2000, spValue: 2000, summary: ['a', 'b', 'c'] },
    ];
    const correct = [
      { streamPosition: 0, spValue: 0, summary: ['x', 'y', 'z'] },
      { streamPosition: 2000, spValue: 2000, summary: ['a', 'b', 'c'] },
      { streamPosition: 2000, spValue: 2000, summary: ['a', 'b', 'c'] },
      { streamPosition: 2001, spValue: 2001, summary: ['a', 'x', 'c'] },
      { streamPosition: 2002, spValue: 2002, summary: ['a', 'x', 'c'] },
      { streamPosition: 2003, spValue: 2003, summary: ['a', 'x', 'c'] },
    ];
    const ct = new CompareTool();
    const result = ct.compare(trainee, correct);

    expect(result.length).toEqual(6);
    expect(result[0].correctIndex).toEqual(0, 'c0');
    expect(result[0].traineeIndex).toEqual(-1, 't0');
    expect(result[0].trainee).toEqual({});
    expect(result[0].correct.spValue).toEqual(0);

    expect(result[1].correctIndex).toEqual(1, 'c1');
    expect(result[1].traineeIndex).toEqual(1, 't1');

    expect(result[2].correctIndex).toEqual(2, 'c2');
    expect(result[2].traineeIndex).toEqual(-1, 't2');

    expect(result[3].correctIndex).toEqual(3, 'c3');
    expect(result[3].traineeIndex).toEqual(0, 't3');

    expect(result[4].correctIndex).toEqual(4, 'c4');
    expect(result[4].traineeIndex).toEqual(-1, 't4');

    expect(result[5].correctIndex).toEqual(5, 'c5');
    expect(result[5].traineeIndex).toEqual(-1, 't5');
  });

  it('Close time comparation and lcs', () => {
    const trainee = [
      { streamPosition: 1, spValue: 1, summary: ['a', 'b', 'c'] },
      { streamPosition: 2, spValue: 2, summary: ['a', 'x1', 'y1'] },
      { streamPosition: 2, spValue: 2, summary: ['a', 'x2', 'y2'] },
    ];
    const correct = [
      { streamPosition: 1, spValue: 1, summary: ['a', 'b', 'c'] },
      { streamPosition: 2, spValue: 2, summary: ['a', 'x2', 'y2'] },
      { streamPosition: 2, spValue: 2, summary: ['a', 'x1', 'y1'] },
      { streamPosition: 3, spValue: 3, summary: ['a', 'x', 'c'] },
      { streamPosition: 4, spValue: 4, summary: ['a', 'x', 'c'] },
      { streamPosition: 5, spValue: 5, summary: ['a', 'x', 'c'] },
    ];
    const ct = new CompareTool();
    const result = ct.compare(trainee, correct);

    // todo: do not remove, it's for debug
    // console.log(JSON.stringify(result));

    expect(result.length).toBe(6);
    expect(result[0].correctIndex).toBe(0, 'c0');
    expect(result[0].traineeIndex).toBe(0, 't0');

    expect(result[1].correctIndex).toBe(1, 'c1');
    expect(result[1].traineeIndex).toBe(2, 't1');

    expect(result[2].correctIndex).toBe(2, 'c2');
    expect(result[2].traineeIndex).toBe(1, 't2');

    expect(result[3].correctIndex).toBe(3, 'c3');
    expect(result[3].traineeIndex).toBe(-1, 't3');

    expect(result[4].correctIndex).toBe(4, 'c4');
    expect(result[4].traineeIndex).toBe(-1, 't4');

    expect(result[5].correctIndex).toBe(5, 'c5');
    expect(result[5].traineeIndex).toBe(-1, 't5');
  });

  it('NN missed', () => {
    const a = { spValue: 0, summary: ['X', 'Y', 'Z'] };
    const b = [
      { spValue: 10, summary: ['A', 'B1', 'C'] },
      { spValue: 10, summary: ['A', 'B2', 'C'] },
      { spValue: 10, summary: ['A', 'B3', 'C'] },
      { spValue: 20, summary: ['A', 'B', 'C'] },
      { spValue: 29, summary: ['A', 'B', 'C'] },
      { spValue: 37, summary: ['A', 'B', 'C'] },
      { spValue: 53, summary: ['A', 'B', 'C'] }
    ];
    const exclude = [];
    const c = Comparator.nn(a, b, exclude);
    expect(c).toEqual({
      a: { spValue: 0, summary: ['X', 'Y', 'Z'] }, b: undefined, i: -1
    });
    expect(exclude).toEqual([-1], 'exclude');
  });

  it('NN exists', () => {
    const a = { spValue: 10, summary: ['A2', 'B', 'C'] };
    const b = [
      { spValue: 10, summary: ['A1', 'B', 'C'] },
      { spValue: 10, summary: ['A2', 'B', 'C'] },
      { spValue: 10, summary: ['A2', 'Y', 'Z'] },
      { spValue: 10, summary: ['A3', 'B', 'C'] },
      { spValue: 20, summary: ['A', 'B', 'C'] },
      { spValue: 29, summary: ['A', 'B', 'C'] },
      { spValue: 37, summary: ['A', 'B', 'C'] },
      { spValue: 53, summary: ['A', 'B', 'C'] }
    ];
    const exclude = [];
    const c = Comparator.nn(a, b, exclude);
    expect(c).toEqual({
      a: { spValue: 10, summary: ['A2', 'B', 'C'] }, b: { spValue: 10, summary: ['A2', 'B', 'C'] }, i: 1
    });
    expect(exclude).toEqual([1]);

    Comparator.nn(a, b, exclude);
    expect(exclude).toEqual([1, 0]);
  });

  it('1 Compare arrays', () => {
    const a = ['A', 'B', 'C'];
    const b = ['A', 'B', 'C'];
    const c = Comparator.LCS(a, b);
    expect(c).toEqual([
      { e: 'A', a: 0, b: 0 },
      { e: 'B', a: 1, b: 1 },
      { e: 'C', a: 2, b: 2 }
    ]);
  });

  it('2 Compare arrays', () => {
    const a = ['A'];
    const b = ['B'];
    const c = Comparator.LCS(a, b);
    expect(c).toEqual([]);
  });

  it('3 Compare arrays', () => {
    const a = ['A', 'B', 'C'];
    const b = ['A', 'X', 'Y', 'C'];
    const c = Comparator.LCS(a, b);
    expect(c).toEqual([
      { e: 'A', a: 0, b: 0 },
      { e: 'C', a: 2, b: 3 }
    ]);
  });

  it('4 Compare arrays', () => {
    const a = ['A', 'B'];
    const b = ['A', 'X', 'Y', 'B'];
    const c = Comparator.LCS(a, b);
    expect(c).toEqual([
      { e: 'A', a: 0, b: 0 },
      { e: 'B', a: 1, b: 3 }
    ]);
  });

  it('5 Compare arrays', () => {
    const a = ['A', 'B'];
    const b = ['A', 'B', 'Y', 'B'];
    const c = Comparator.LCS(a, b);
    expect(c).toEqual([
      { e: 'A', a: 0, b: 0 },
      { e: 'B', a: 1, b: 3 }
    ]);
  });

  it('6 Compare arrays', () => {
    const a = ['Y', 'B'];
    const b = ['A', 'B', 'Y', 'B'];
    const c = Comparator.LCS(a, b);
    expect(c).toEqual([
      { e: 'Y', a: 0, b: 2 },
      { e: 'B', a: 1, b: 3 }
    ]);
  });
});
