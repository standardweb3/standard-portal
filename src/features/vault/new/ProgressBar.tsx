import styled from '@emotion/styled';
import { useMemo, useRef, useState } from 'react';
import useMouse from '@react-hook/mouse-position';
import { classNames } from '../../../functions';

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
  transition-duration: 50;
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
  z-index: 10;
`;

export const TrackTick = styled.div<{ left: string }>`
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
  setToMinLiquidationRatio,
  setToSafeLiquidationRatio,
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
      let perc = (mouse.x / ref.current.offsetWidth) * 100;
      perc = perc > 99.2 ? 100 : perc < 0.8 ? 0 : perc;
      const newLiqRatio = Math.round(perc * maxLiquidationRatio * 10) / 1000;
      // console.log(perc);
      setLiquidationRatioPercentage(perc);
      setLiquidationRatio(newLiqRatio, false);
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

  const minLeft = useMemo(
    () => String((minLiquidationRatio / maxLiquidationRatio) * 100) + '%',
    [minLiquidationRatio, maxLiquidationRatio],
  );
  const safeLeft = useMemo(
    () => String((safeLiquidationRatio / maxLiquidationRatio) * 100) + '%',
    [safeLiquidationRatio, maxLiquidationRatio],
  );
  // console.log(minLeft, safeLeft);

  const handleClickMinRatio = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setToMinLiquidationRatio();
  };

  const handleClickSafeRatio = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setToSafeLiquidationRatio();
  };
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
          className={classNames('bg-primary', !dragging && '!duration-500')}
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

      <TrackText
        left={minLeft}
        className="text-thumbroller cursor-pointer hover:text-primary"
        onClick={handleClickMinRatio}
      >
        Min: {minLiquidationRatio}%
      </TrackText>
      <TrackTick
        left={minLeft}
        onClick={handleClickMinRatio}
        className="bg-thumbroller cursor-pointer hover:bg-white"
      />
      <TrackText
        left={safeLeft}
        className="text-thumbroller cursor-pointer hover:text-primary"
        safe
        onClick={handleClickSafeRatio}
      >
        Safe: {safeLiquidationRatio}%
      </TrackText>
      <TrackTick
        left={safeLeft}
        onClick={handleClickSafeRatio}
        className="bg-thumbroller cursor-pointer hover:bg-white"
      />
    </TrackCont>
  );
}
