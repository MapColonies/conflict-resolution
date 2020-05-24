export const unixToDate = (unix: number): Date => {
  if (!unix) {
    return null;
  }
  return new Date(unix * 1000);
};

export const dateToUnix = (date: Date): number => {
  if (!date) {
    return null;
  }
  return date.getTime() / 1000;
};
