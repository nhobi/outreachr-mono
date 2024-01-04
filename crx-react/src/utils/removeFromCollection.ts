export const removeFromCollection = <T>(
  item: T,
  arr: T[],
  match = (a: T, b: T) => a === b,
): T[] => {
  return arr.filter((b) => !match(b, item));
};

export const remove = removeFromCollection;
