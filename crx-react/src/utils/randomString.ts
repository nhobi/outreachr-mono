export const randomString = (len = 7) =>
  (Math.random() + 1).toString(36).substring(len);
