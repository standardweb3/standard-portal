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
import { Button } from '../../components-ui/Button';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';
import Countdown from 'react-countdown';
import { HorizontalCountdown } from '../../components-ui/HorizontalCountdown';

const RebaseTimer = ({ duration = 0, remaining = 0, rebaseActive = false }) => {
  const currentBlock = useCurrentBlockTimestamp();
  const Completionist = () => <span>Rebase available</span>;
  // Renderer callback with condition
  const renderer = ({ total, days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return rebaseActive ? (
        <div className="space-y-2 flex flex-col justify-center">
          <div className="text-center px-4">
            <div className="text-xs -mb-1 text-grey">Next Rebase in</div>
            <div className="font-bold text-xl">
              {days}:{hours}:{minutes}:{seconds}
            </div>
          </div>
          <HorizontalCountdown duration={duration * 1000} remaining={total} />
        </div>
      ) : (
        <div className="text-sm">Rebase unavailable</div>
      );
    }
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

export function Rebase3() {
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
    <div className="rounded-20 bg-background p-4 md:p-8 flex flex-col items-center space-y-4">
      <div>
        <div className="font-bold text-xl md:text-xl">USM</div>
        <div>
          {usmPrice !== undefined ? (
            <div className="text-grey text-sm md:text-base">
              <span className="text-lg md:text-xl">
                {formatNumber(usmPrice)}
              </span>{' '}
              USD
            </div>
          ) : (
            <Skeleton width="33%" />
          )}
        </div>
      </div>
      <div className={classNames(!vaultManager?.rebaseActive && 'is-disabled')}>
        <RebaseTimer
          duration={3600}
          rebaseActive={vaultManager?.rebaseActive}
          remaining={vaultManager?.rebaseActive ? rebaseCountdown ?? 0 : 3600}
        />
      </div>
      <Button
        disabled={!vaultManager?.rebaseActive || !rebasable}
        className="font-bold !rounded-lg text-sm md:text-base !py-2 !px-8"
        onClick={handleRebase}
      >
        Rebase
      </Button>
      <div className="text-center">
        <div className="text-primary text-xs">Next Desired Supply</div>
        <div className="text-sm text-text">
          {formatNumber(nextDesiredSupply)}
        </div>
      </div>
    </div>
  );
}
