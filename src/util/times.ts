import * as moment from 'moment'

export const unixMillisecondsToDate = (milliseconds: number): Date => {
  if (!milliseconds) {
    return null;
  }
  return moment(milliseconds).toDate();
};

export const dateToUnixMilliseconds = (date: Date): number => {
  if (!date) {
    return null;
  }
  return moment(date).unix() * 1000;
};

export const unixSecondsToDate = (seconds: number): Date => {
  if (!seconds) {
    return null;
  }
  return moment.unix(seconds).toDate();
};

export const dateToUnixSeconds = (date: Date): number => {
  if (!date) {
    return null;
  }
  return moment(date).unix();
};
