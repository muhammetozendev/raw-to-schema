export function group<T>(array: T[], keys: string[]): T[][] {
  const groupMap: Record<string, T[]> = {};
  for (let element of array) {
    const key = keys.map((key) => element[key]).join('-');
    if (groupMap[key]) {
      groupMap[key].push(element);
    } else {
      groupMap[key] = [element];
    }
  }
  return Object.values(groupMap);
}
