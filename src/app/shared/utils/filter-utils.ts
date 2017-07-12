const notEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.length !== 0;
  }

  return value;
};

export class FilterUtils {
  public static createSearchParams(params: any) {
    const searchParams: any = {};
    for (const key of Object.keys(params)) {
      if (notEmpty(params[key])) {
        searchParams[key] = params[key];
      }
    }
    return searchParams;
  }
}
