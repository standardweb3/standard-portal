import { useVaultManager } from '../../services/graph/hooks/vault';
import { useTransactionAdder } from '../../state/transactions/hooks';
import useVaultManagerCallbacks from '../../hooks/vault/useVaultManagerCallbacks';
import { useMtr } from '../../hooks/vault/useMtr';
import {
  useRebaseCountdown,
  useVaultManagerAssetPrice,
} from '../../hooks/vault/useVaultManager';
import Skeleton from 'react-loading-skeleton';
import { classNames, formatNumber } from '../../functions';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';
import Countdown from 'react-countdown';
import { useRef } from 'react';
import {
  Thumb,
  Track,
  TrackCont,
} from '../../components-ui/ProgressBar/CollateralRatioProgressBar';
import { SimpleCurrencyLogo } from '../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { Question } from '../../components-ui/Question';

export function CountdownButton({
  duration,
  remaining,
  rebaseActive = false,
  children = undefined,
}) {
  const ref = useRef(null);

  return (
    <TrackCont ref={ref} className="flex items-center relative !cursor-pointer">
      <Track
        className={`bg-scrollbar-track !rounded-lg !h-auto overflow-hidden`}
      >
        <Thumb
          percentage={remaining !== 0 ? (remaining / duration) * 100 : 100}
          className={'!duration-500 bg-primary !rounded-none'}
        >
          {children}
        </Thumb>
      </Track>
    </TrackCont>
  );
}

const RebaseTimer = ({
  duration = 0,
  remaining = 0,
  rebaseActive = false,
  handleRebase = undefined,
}) => {
  const currentBlock = useCurrentBlockTimestamp();
  //   const Completionist = () => <span>Rebase available</span>;
  // Renderer callback with condition
  const renderer = ({ total, days, hours, minutes, seconds, completed }) => {
    // Render a countdown
    return (
      <div className="text-center space-y-1">
        <CountdownButton duration={duration * 1000} remaining={total}>
          <div
            className="font-bold !rounded-lg text-sm md:text-base !py-1 !px-4"
            onClick={handleRebase}
          >
            {completed ? (
              'Rebase'
            ) : rebaseActive ? (
              <div className="font-bold text-lg">
                {days}:{hours}:{minutes}:{seconds}
              </div>
            ) : (
              <div className="font-bold text-lg">00:00:00</div>
            )}
          </div>
        </CountdownButton>
        {!rebaseActive && <div className="text-xs">Rebase unavailable</div>}
      </div>
    );
  };

  return currentBlock ? (
    <Countdown
      date={currentBlock.toNumber() * 1000 + remaining * 1000}
      renderer={renderer}
    />
  ) : (
    <></>
  );
};

export function Rebase4() {
  const addTransaction = useTransactionAdder();
  const vaultManager = useVaultManager();
  const { triggerRebase } = useVaultManagerCallbacks();
  const rebaseCountdown = useRebaseCountdown();
  const rebasable = rebaseCountdown !== undefined && rebaseCountdown == 0;
  const usm = useMtr();
  const usmPrice = useVaultManagerAssetPrice(usm.address);

  const handleRebase = async () => {
    let tx = await triggerRebase();
    tx &&
      addTransaction(tx, {
        summary: `Rebase USM's desired supply`,
      });
  };
  const nextDesiredSupply =
    usmPrice !== undefined && vaultManager?.currentBorrowed !== undefined
      ? usmPrice * parseFloat(vaultManager.currentBorrowed)
      : undefined;

  return (
    <div className="rounded-20 bg-background p-6 md:p-8 flex flex-col items-center space-y-4 h-full justify-center">
      <div className="flex items-center space-x-4 justify-between w-full">
        <div className="flex items-center space-x-2">
          <SimpleCurrencyLogo
            symbol="usm"
            size="56px"
            className="rounded-full"
          />
          <div>
            <div className="flex items-center space-x-3">
              <div className="font-bold text-xl md:text-2xl">USM</div>
              <div>
                {usmPrice !== undefined ? (
                  <div className="flex items-center space-x-1 text-xl md:text-2xl">
                    <div>$</div>
                    <div className="font-bold">{formatNumber(usmPrice)}</div>
                  </div>
                ) : (
                  <Skeleton width="33%" />
                )}
              </div>
              <Question text={'This is the oracle price of USM'} />
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-primary text-xs whitespace-nowrap">
                Next Desired Supply
              </div>
              <div className="text-sm text-text font-bold">
                {vaultManager?.rebaseActive
                  ? formatNumber(nextDesiredSupply)
                  : '-'}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classNames(!vaultManager?.rebaseActive && 'is-disabled')}
        >
          <RebaseTimer
            duration={3600}
            rebaseActive={vaultManager?.rebaseActive}
            remaining={vaultManager?.rebaseActive ? rebaseCountdown ?? 0 : 3600}
            handleRebase={handleRebase}
          />
        </div>
      </div>
    </div>
  );
}
