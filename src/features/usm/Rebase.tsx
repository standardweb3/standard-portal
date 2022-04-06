import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { classNames, formatNumber } from '../../functions';
import { zeroPad } from '../../functions/fill';
import { useMtr } from '../../hooks/vault/useMtr';
import {
  useRebaseCountdown,
  useVaultManagerAssetPrice,
} from '../../hooks/vault/useVaultManager';
import { useVaultManager } from '../../services/graph/hooks/vault';
import Skeleton from 'react-loading-skeleton';
import { Button } from '../../components-ui/Button';
import useVaultManagerCallbacks from '../../hooks/vault/useVaultManagerCallbacks';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { LogoSpinner } from '../../components-ui/Spinner/LogoSpinner';

export const formatCountdownTime = (remainingTime) => {
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
};

const RebaseTimer = ({ duration = 0, rebaseActive = undefined }) => {
  return (
    <CountdownCircleTimer
      isPlaying={rebaseActive}
      duration={duration}
      strokeWidth={8}
      colors={'#B984FC'}
      trailColor="#401A59"
      strokeLinecap="square"
      size={140}
    >
      {({ remainingTime }) => {
        return rebaseActive === undefined ? (
          <LogoSpinner width={48} height={48} />
        ) : !rebaseActive ? (
          <div className="text-sm text-primary">Rebase unavailable</div>
        ) : (
          <div className="text-center">
            <div className="text-xs text-primary opacity-75">Next Rebase</div>
            <div className="text-xs text-primary opacity-75">Available In</div>
            <div className="font-bold text-xl">
              {formatCountdownTime(remainingTime)}
            </div>
          </div>
        );
      }}
    </CountdownCircleTimer>
  );
};

export function Rebase() {
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
        <div className="space-y-3">
          <div>
            <div className="font-bold text-xl md:text-2xl">USM</div>
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
          <div
            className="flex flex-col space-y-4
          md:flex-row md:space-x-4 md:space-y-0 md:items-center"
          >
            <div>
              <div className="text-primary text-xs md:text-sm">
                Total Supply
              </div>
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
          </div>
        </div>
        <div
          className={classNames(!vaultManager?.rebaseActive && 'is-disabled')}
        >
          <RebaseTimer
            rebaseActive={vaultManager?.rebaseActive}
            duration={vaultManager?.rebaseActive ? rebaseCountdown ?? 0 : 0}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          disabled={!vaultManager?.rebaseActive || !rebasable}
          className="font-bold !rounded-lg text-sm md:text-base !py-2 !px-8"
          onClick={handleRebase}
        >
          Rebase
        </Button>
      </div>
    </div>
  );
}
