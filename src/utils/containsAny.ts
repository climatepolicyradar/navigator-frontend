export const containsAny = (source: string[] = [], target: string[] = []) => {
  return target.some((item) => source.includes(item));
};
