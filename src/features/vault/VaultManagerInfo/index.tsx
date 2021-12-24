import { useState } from 'react';
import { Button } from '../../../components-ui/Button';
import Image from '../../../components-ui/Image';
import { formatNumber, formatNumberScale } from '../../../functions';
import { useVaultManager } from '../../../services/graph/hooks/vault';
import Skeleton from 'react-loading-skeleton';

export function VaultManagerInfo() {
  const vaultManager = useVaultManager();
  const [expanded, setExpanded] = useState(false);

  console.log(vaultManager);
  const { runningStat, liquidation } = vaultManager ?? {
    runningStat: undefined,
    liquidation: undefined,
  };

  const NumberSkeleton = <Skeleton count={1} />;

  return (
    <div className="rounded-20 bg-vault-manager-info p-8">
      <div className="flex flex-col 2xl:flex-row items-start 2xl:items-end space-x-8 2xl:space-y-0">
        <div className="flex items-end space-x-8">
          <Image
            src="https://raw.githubusercontent.com/digitalnativeinc/icons/master/token/stnd.jpg"
            width="128px"
            height="128px"
            layout="fixed"
            className="rounded-full"
          />
          <div className="space-y-2 flex-col justify-end pb-2">
            <div className="flex items-center space-x-4 w-full justify-between">
              <div className="text-4xl font-bold">MTR</div>
              <Button
                disabled
                type="bordered"
                color={vaultManager?.rebaseActive ? 'success' : 'danger'}
              >
                Rebase
              </Button>
            </div>
            <div className="flex items-center space-x-12">
              <div className="space-y-1">
                <div>Total Supply</div>
                <div className="text-3xl font-bold">
                  {vaultManager
                    ? formatNumberScale(vaultManager.currentBorrowed)
                    : NumberSkeleton}
                </div>
              </div>
              <div className="space-y-1">
                <div>Desired Supply</div>
                <div className="text-3xl font-bold">
                  {vaultManager
                    ? formatNumberScale(vaultManager.desiredSupply)
                    : NumberSkeleton}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-start flex-wrap pb-2 mt-4">
          <div className="mr-8 mt-4">
            <div className="text-sm lg:text-base">AMM Reserve</div>
            <div className="md:text-lg lg:text-2xl font-bold">
              {runningStat ? (
                <>
                  {formatNumber(runningStat.currentCollateralizedUSD)}
                  <span className="font-normal text-base"> USD</span>
                </>
              ) : (
                NumberSkeleton
              )}
            </div>
          </div>
          <div className="mr-8 mt-4">
            <div className="text-sm lg:text-base">Collaterals</div>
            <div className="md:text-lg lg:text-2xl font-bold">
              {runningStat ? (
                <>
                  {formatNumber(runningStat.currentCollateralizedUSD)}
                  <span className="font-normal text-base"> USD</span>
                </>
              ) : (
                NumberSkeleton
              )}
            </div>
          </div>
          <div className="mr-8 mt-4">
            <div className="text-sm lg:text-base">Liq. Collaterals</div>
            <div className="md:text-lg lg:text-2xl font-bold">
              {liquidation ? (
                <>
                  {formatNumber(liquidation.liquidationAMMUSD)}
                  <span className="font-normal text-base"> USD</span>
                </>
              ) : (
                NumberSkeleton
              )}
            </div>
          </div>
          <div className="mr-8 mt-4">
            <div className="text-sm lg:text-base">Liq. Fees</div>
            <div className="md:text-lg lg:text-2xl font-bold">
              {liquidation ? (
                <>
                  {formatNumber(liquidation.liquidationFeeUSD)}
                  <span className="font-normal text-base"> USD</span>
                </>
              ) : (
                NumberSkeleton
              )}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm lg:text-base">Active Vaults</div>
            <div className="md:text-lg lg:text-2xl font-bold">
              {vaultManager
                ? formatNumberScale(vaultManager.activeVaultCount)
                : NumberSkeleton}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
