import styled from '@emotion/styled';
import { classNames } from '../../../functions';
import { VaultCondition } from '../../../pages/vaults';
import {
  Thumb,
  Track,
  TrackCont,
  TrackTick,
} from '../../../components-ui/ProgressBar/CollateralRatioProgressBar';

const TrackText = styled.div<{ left: string }>`
  top: 4px;
  font-size: 9px;
  transform: translateX(-50%);
  left: ${(props) => props.left};
  position: absolute;
`;

export function VaultProgressBar({
  minRatio,
  condition,
  currentRatio,
  maxRatio,
}) {
  const currentRatioPercentage = Math.min((currentRatio / maxRatio) * 100, 100);
  const minLeft = String((minRatio / maxRatio) * 100) + '%';

  const trackColor =
    condition === VaultCondition.DANGER
      ? 'bg-danger'
      : condition === VaultCondition.WARNING
      ? 'bg-warn'
      : 'bg-safe';

  return (
    <TrackCont className="h-[60px] flex items-center !cursor-pointer relative">
      <Track className={`bg-scrollbar-track`}>
        <Thumb
          percentage={currentRatioPercentage}
          className={classNames(trackColor, '!duration-500')}
        ></Thumb>
      </Track>

      <TrackText left={minLeft} className="text-white cursor-pointer whitespace-nowrap">
        Min: {minRatio}%
      </TrackText>

      <TrackTick left={minLeft} className="bg-white cursor-pointer" />
    </TrackCont>
  );
}
