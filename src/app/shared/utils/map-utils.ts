export class MapUtils {
  public static objectToMap(obj: Object) {
    const map = new Map<string, string>();
    for (const key of Object.keys(obj)) {
      if (obj[key] !== '') {
        map.set(key, obj[key]);
      }
    }
    return map;
  }
}
