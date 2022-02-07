import { useVaultUserHistories } from '../../../services/graph/hooks/vault';
import Skeleton from 'react-loading-skeleton';
import { formatNumber, shortenAddress } from '../../../functions';
import { useActiveWeb3React } from '../../../hooks';
import { UserBorrowedHistoryGraph } from '../Graph';
import { Button } from '../../../components-ui/Button';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { useRouter } from 'next/router';

export function VaultUserInfo({ totalCollateralized, dangerVaultCount }) {
  const { account } = useActiveWeb3React();
  const userHistories = useVaultUserHistories();
  const user = userHistories?.[0];
  const none = userHistories?.length === 0;
  const router = useRouter();

  const handleClick = () => router.push('collaterals');
  const historiesForChart = userHistories?.map((uh) => {
    return {
      ...uh,
      currentBorrowed: parseFloat(uh.currentBorrowed),
    };
  });

  return (
    <div className="w-full rounded-20 flex flex-col lg:flex-row bg-vault-manager-info box-border">
      <div className="p-8">
        <div>
          <div className="text-4xl font-bold text-primary mb-4">
            {account ? shortenAddress(account) : ''}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="text-sm whitespace-nowrap">Total Borrowed</div>
              <div className="font-bold text-2xl text-primary">
                {user ? (
                  formatNumber(user.currentBorrowed)
                ) : none ? (
                  0
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="text-sm whitespace-nowrap">
                Total Collateralized
              </div>
              <div className="font-bold text-2xl">
                {user ? (
                  formatNumber(totalCollateralized, true)
                ) : none ? (
                  0
                ) : (
                  <Skeleton />
                )}
              </div>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <div className="text-sm whitespace-nowrap">Active Vaults</div>
              <div className="font-bold text-2xl">
                {user ? user.activeVaultCount : none ? 0 : <Skeleton />}
              </div>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1 text-danger">
              <div className="text-sm whitespace-nowrap">Danger Vaults</div>
              <div className="font-bold text-2xl">
                {user ? dangerVaultCount : none ? 0 : <Skeleton />}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button className={DefinedStyles.fullButton} onClick={handleClick}>
            Open New Vault
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <UserBorrowedHistoryGraph data={historiesForChart} />
      </div>
    </div>
  );
}
