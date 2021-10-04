import { number } from '@lingui/core/cjs/formats';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import {
  getTimeDays,
  getTimeHours,
  getTimeMinutes,
  getTimeSeconds,
} from '../../functions/time';

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

export type TimerProps = {
  remainingTime: number;
  settings?: any;
};

export function Timer({ remainingTime, settings }: TimerProps) {
  const getTime = (remaining) => {
    const days = getTimeDays(remaining);
    if (days > 0) return days + 1;
    const hours = getTimeHours(remaining);
    if (hours > 0) return hours + 1;
    const minutes = getTimeMinutes(remaining);
    if (minutes > 0) return minutes + 1;
    return getTimeSeconds(remaining);
  };

  const getDimension = (remaining) => {
    if (getTimeDays(remaining) > 0) return 'days';
    if (getTimeHours(remaining) > 0) return 'hours';
    if (getTimeMinutes(remaining) > 0) return 'minutes';
    return 'seconds';
  };

  const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6,
  };

  return (
    <CountdownCircleTimer
      {...timerProps}
      {...settings}
      colors={'#FF979E'}
      duration={remainingTime}
      initialRemainingTime={remainingTime}
    >
      {({ elapsedTime }) => {
        return (
          <div>
            {renderTime(
              getDimension(remainingTime - elapsedTime),
              getTime(remainingTime - elapsedTime),
            )}
          </div>
        );
      }}
    </CountdownCircleTimer>
  );
}
