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
  collateralRatioPercentage,
  maxCollateralRatio = 300,
  minCollateralRatio = 150,
  safeCollateralRatio = 200,
  setCollateralRatio,
  collateralRatio,
  setCollateralRatioPercentage,
  setToMinCollataralRatio,
  setToSafeCollateralRatio,
}) {
  const ref = useRef(null);

  // const [percentage, setPercentage] = useState(
  //   (safe / maxCollateralRatio) * 100,
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
      const newLiqRatio = Math.round(perc * maxCollateralRatio * 10) / 1000;
      // console.log(perc);
      setCollateralRatioPercentage(perc);
      setCollateralRatio(String(newLiqRatio), false);
    }
  };

  // useEffect(() => {
  //   const newLiqRatio =
  //     Math.round(percentage * maxCollateralRatio * 10) / 1000;
  //   setCollateralRatio(newLiqRatio);
  // }, [percentage, maxCollateralRatio]);

  // useEffect(() => {
  //   const newPercentage = parseFloat(collateralRatio) / maxCollateralRatio;
  //   setPercentage(newPercentage);
  // }, [collateralRatio]);

  const minLeft = useMemo(
    () => String((minCollateralRatio / maxCollateralRatio) * 100) + '%',
    [minCollateralRatio, maxCollateralRatio],
  );
  const safeLeft = useMemo(
    () => String((safeCollateralRatio / maxCollateralRatio) * 100) + '%',
    [safeCollateralRatio, maxCollateralRatio],
  );
  // console.log(minLeft, safeLeft);

  const handleClickMinRatio = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setToMinCollataralRatio();
  };

  const handleClickSafeRatio = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setToSafeCollateralRatio();
  };

  const state = useMemo(() => {
    return collateralRatio && parseFloat(collateralRatio) < minCollateralRatio
      ? 'danger'
      : parseFloat(collateralRatio) < safeCollateralRatio
      ? 'warn'
      : 'safe';
  }, [collateralRatio]);

  const trackColor =
    state === 'danger'
      ? 'bg-danger'
      : state === 'warn'
      ? 'bg-warn'
      : 'bg-primary';

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
      <Track className={`bg-scrollbar-track`}>
        <Thumb
          percentage={collateralRatioPercentage}
          className={classNames(trackColor, !dragging && '!duration-500')}
        >
          <ThumbRoller
            className="bg-thumbroller border-[3px] border-primary"
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
        Min: {minCollateralRatio}%
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
        Safe: {safeCollateralRatio}%
      </TrackText>
      <TrackTick
        left={safeLeft}
        onClick={handleClickSafeRatio}
        className="bg-thumbroller cursor-pointer hover:bg-white"
      />
    </TrackCont>
  );
}
