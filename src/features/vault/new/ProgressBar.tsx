import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position';
import { classNames } from '../../../functions';
import usePrevious from '../../../hooks/usePrevious';

export const TrackCont = styled.div`
  width: 100%;
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
  transform: translateY(-25%) translateX(8px);
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

export function ProgressBar({
  liquidationRatioPercentage,
  maxLiquidationRatio = 300,
  minLiquidationRatio = 150,
  safeLiquidationRatio = 200,
  setLiquidationRatio,
  liquidationRatio,
  setLiquidationRatioPercentage,
}) {
  const ref = useRef(null);

  // const [percentage, setPercentage] = useState(
  //   (safe / maxLiquidationRatio) * 100,
  // );

  const [dragging, setDragging] = useState(false);

  const mouse = useMouse(ref, {
    enterDelay: 0,
    leaveDelay: 0,
  });

  const calculatePercentageOnClick = () => {
    if (ref.current && mouse.x !== null) {
      const perc =
        Math.round((mouse.x / ref.current.offsetWidth) * 100000) / 1000;
      const newLiqRatio = Math.round(perc * maxLiquidationRatio * 10) / 1000;
      // console.log(perc);
      setLiquidationRatioPercentage(perc > 99.2 ? 100 : perc < 0.8 ? 0 : perc);
      setLiquidationRatio(newLiqRatio);
    }
  };

  // useEffect(() => {
  //   const newLiqRatio =
  //     Math.round(percentage * maxLiquidationRatio * 10) / 1000;
  //   setLiquidationRatio(newLiqRatio);
  // }, [percentage, maxLiquidationRatio]);

  // useEffect(() => {
  //   const newPercentage = parseFloat(liquidationRatio) / maxLiquidationRatio;
  //   setPercentage(newPercentage);
  // }, [liquidationRatio]);

  const minLeft =
    String((minLiquidationRatio / maxLiquidationRatio) * 100) + '%';
  const safeLeft =
    String((safeLiquidationRatio / maxLiquidationRatio) * 100) + '%';

  return (
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
          percentage={liquidationRatioPercentage}
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
        Min: {minLiquidationRatio}%
      </TrackText>
      <TrackTick left={minLeft} className="bg-thumbroller" />
      <TrackText left={safeLeft} className="text-thumbroller" safe>
        Safe: {safeLiquidationRatio}%
      </TrackText>
      <TrackTick left={safeLeft} className="bg-thumbroller" />
    </TrackCont>
  );
}
