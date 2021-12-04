import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position';
import { classNames } from '../../../functions';

export const TrackCont = styled.div`
  cursor: crosshair;
`;
export const Track = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 20px;
  box-shadow: inset 0 0 1px #000;
`;

export const Thumb = styled.div<{ percentage: number }>`
  position: relative;
  width: ${(props) => props.percentage}%;
  height: 100%;
  border-radius: 20px;
  transition-property: width;
`;

export const ThumbRoller = styled.div`
  cursor: pointer;
  transform: translateY(-25%) translateX(9.5px);
  border: 3px solid #f365bd;
  position: absolute;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  right: 0;
`;

export const TrackTick = styled.div<{ left: string }>`
  z-index: 100;
  left: ${(props) => props.left};
  position: absolute;
  width: 3px;
  border-radius: 20px;
  height: 12px;
`;

export const TrackText = styled.div<{ left: string; safe?: boolean }>`
  top: 4px;
  font-size: 9px;
  transform: ${(props) => (props.safe ? 'translateX(0)' : 'translateX(-100%)')};
  left: ${(props) => props.left};
  position: absolute;
`;

export function ProgressBar({ max = 300, min = 150, safe = 200 }) {
  const ref = useRef(null);

  const [percentage, setPercentage] = useState((safe / max) * 100);
  const [dragging, setDragging] = useState(false);

  const mouse = useMouse(ref, {
    enterDelay: 0,
    leaveDelay: 0,
  });

  const calculatePercentageOnClick = () => {
    if (ref.current && mouse.x !== null) {
      const perc = mouse.x / ref.current.offsetWidth;
      setPercentage((perc > 0.992 ? 1 : perc < 0.008 ? 0 : perc) * 100);
    }
  };

  const minLeft = String((min / max) * 100) + '%';
  const safeLeft = String((safe / max) * 100) + '%';
  return (
    <>
      <TrackCont
        ref={ref}
        className="h-[60px] flex items-center relative"
        onClick={calculatePercentageOnClick}
        onMouseUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
        }}
        onMouseMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (dragging) calculatePercentageOnClick();
        }}
      >
        <Track className="bg-scrollbar-track">
          <Thumb
            percentage={percentage}
            className={classNames(
              'bg-primary',
              dragging ? 'duration-75' : 'duration-500',
            )}
          >
            <ThumbRoller
              className="bg-thumbroller"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragging(true);
              }}
            />
          </Thumb>
        </Track>

        <TrackText left={minLeft} className="text-thumbroller">
          Min: {min}%
        </TrackText>
        <TrackTick left={minLeft} className="bg-thumbroller" />
        <TrackText left={safeLeft} className="text-thumbroller" safe>
          Safe: {safe}%
        </TrackText>
        <TrackTick left={safeLeft} className="bg-thumbroller" />
      </TrackCont>
    </>
  );
}
