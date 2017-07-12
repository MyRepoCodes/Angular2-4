export class CsvUtils {
  public static downloadCsv(CSV, fileName) {
    // source from: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side#answer-24213473
    const link = document.createElement('a');

    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const blob = new Blob([CSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
    }

    if (navigator.msSaveBlob) { // IE 10+
      link.addEventListener('click', function (event) {
        const blob = new Blob([CSV], {
          'type': 'text/csv;charset=utf-8;'
        });
        navigator.msSaveBlob(blob, fileName);
      }, false);
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
