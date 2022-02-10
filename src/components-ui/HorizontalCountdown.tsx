import { useRef } from 'react';
import { classNames } from '../functions';
import {
  Thumb,
  Track,
  TrackCont,
} from './ProgressBar/CollateralRatioProgressBar';

export function HorizontalCountdown({ duration, remaining }) {
  const ref = useRef(null);

  const percentage = remaining / duration;
  return (
    <TrackCont ref={ref} className="h-[60px] flex items-center relative">
      <Track className={`bg-scrollbar-track`}>
        <Thumb percentage={percentage} className={'!duration-500'}></Thumb>
      </Track>
    </TrackCont>
  );
}
