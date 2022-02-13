import { useMemo, useRef } from 'react';
import { classNames } from '../functions';
import {
  Thumb,
  Track,
  TrackCont,
} from './ProgressBar/CollateralRatioProgressBar';

export function HorizontalCountdown({ duration, remaining }) {
  const ref = useRef(null);

  // const percentage = useMemo(() => (remaining / duration) * 100, [
  //   remaining,
  //   duration,
  // ]);
  // console.log('123percentage', percentage);
  return (
    <TrackCont ref={ref} className="flex items-center relative">
      <Track className={`bg-scrollbar-track !rounded-lg !h-[6px]`}>
        <Thumb
          percentage={(remaining / duration) * 100}
          className={'!duration-500 bg-primary'}
        ></Thumb>
      </Track>
    </TrackCont>
  );
}
