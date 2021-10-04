export type Time = {
  years: number;
  days: number;
  hours: number;
  min: number;
  sec: number;
  millisec: number;
};

export const minuteSeconds = 60;
export const hourSeconds = 3600;
export const daySeconds = 86400;

export const getTimeSeconds = (time) => time % minuteSeconds | 0;
export const getTimeMinutes = (time) =>
  ((time % hourSeconds) / minuteSeconds) | 0;
export const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
export const getTimeDays = (time) => (time / daySeconds) | 0;

export function formatTime(seconds: number): Time {
  const timeLeft = {
    years: 0,
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
    millisec: 0,
  };

  // calculate time difference between now and expected date
  if (seconds >= 365.25 * 86400) {
    // 365.25 * 24 * 60 * 60
    timeLeft.years = Math.floor(seconds / (365.25 * 86400));
    seconds -= timeLeft.years * 365.25 * 86400;
  }
  if (seconds >= 86400) {
    // 24 * 60 * 60
    timeLeft.days = Math.floor(seconds / 86400);
    seconds -= timeLeft.days * 86400;
  }
  if (seconds >= 3600) {
    // 60 * 60
    timeLeft.hours = Math.floor(seconds / 3600);
    seconds -= timeLeft.hours * 3600;
  }
  if (seconds >= 60) {
    timeLeft.min = Math.floor(seconds / 60);
    seconds -= timeLeft.min * 60;
  }
  timeLeft.sec = seconds;

  return timeLeft;
}
