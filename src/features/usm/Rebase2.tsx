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

const RebaseTimer = ({ duration = 0, remaining = 0 }) => {
  const currentBlock = useCurrentBlockTimestamp();
  const Completionist = () => <span>Rebase is available</span>;

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {days}:{hours}:{minutes}:{seconds}
        </span>
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

export function Rebase2() {
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
  const newDesiredSupply =
    usmPrice !== undefined && vaultManager?.currentBorrowed !== undefined
      ? usmPrice * parseFloat(vaultManager.currentBorrowed)
      : undefined;

  return (
    <div className="rounded-20 bg-background p-6 md:p-8 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-8 justify-between w-full">
        <div>
          <div className="font-bold text-xl md:text-xl text-primary">
            USM Price
          </div>
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
        {/* <div
          className="flex flex-col space-y-4
      md:flex-row md:space-x-4 md:space-y-0 md:items-center"
        >
          <div>
            <div className="text-primary text-xs md:text-sm">Total Supply</div>
            <div className="text-sm font-bold md:text-base">
              {vaultManager?.currentBorrowed !== undefined ? (
                formatNumber(vaultManager.currentBorrowed)
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
          <div className="opacity-75">
            <div className="text-primary text-xs md:text-sm">
              Next Desired Supply
            </div>
            <div className="text-sm font-bold md:text-base">
              {newDesiredSupply !== undefined ? (
                formatNumber(newDesiredSupply)
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </div> */}
        <div
          className={classNames(!vaultManager?.rebaseActive && 'is-disabled')}
        >
          <RebaseTimer
            duration={vaultManager?.rebaseActive ? rebaseCountdown ?? 0 : 0}
          />
        </div>
        <Button
          //   disabled={!vaultManager?.rebaseActive || !rebasable}
          className="font-bold !rounded-lg text-sm md:text-base !py-2 !px-8"
          onClick={handleRebase}
        >
          Rebase
        </Button>
      </div>
      {/* <div className="flex justify-center">
        <Button
          disabled={!vaultManager?.rebaseActive || !rebasable}
          className="font-bold !rounded-lg text-sm md:text-base !py-2 !px-8"
          onClick={handleRebase}
        >
          Rebase
        </Button>
      </div> */}
    </div>
  );
}
