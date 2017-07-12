export const orderBy = (arr: any[], propName: string): any[] => {
  return arr.sort((a, b) => {
    const A = (a[propName] || '').toLowerCase();
    const B = (b[propName] || '').toLowerCase();
    if (A < B) {
      return -1;
    } else if (A > B) {
      return 1;
    } else {
      return 0;
    }
  });
};
