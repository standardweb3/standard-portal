import {
  useVaultUser,
  useVaultUserHistories,
} from '../../../services/graph/hooks/vault';
import Skeleton from 'react-loading-skeleton';
import { classNames, shortenAddress } from '../../../functions';
import { DefinedStyles } from '../../../utils/DefinedStyles';
import { useActiveWeb3React } from '../../../hooks';
import { UserBorrowedHistoryGraph } from '../Graph';

export function VaultUserInfo() {
  const { account } = useActiveWeb3React();
  const userHistories = useVaultUserHistories();
  const user = userHistories && userHistories[0];

  return (
    <div className="w-full rounded-20 flex bg-vault-manager-info box-border">
      <div className="rounded-20 p-8">
        <div className="text-2xl font-bold text-primary mb-4">
          {shortenAddress(account)}
        </div>
        <div className="flex md:flex-col items-start space-y-2">
          <div className="space-y-1">
            <div className="text-sm">Total Borrowed</div>
            <div className="font-bold text-xl">
              {user ? user.currentBorrowed : <Skeleton />}
            </div>
          </div>
          <div className={classNames(DefinedStyles.divider, '')} />

          <div className="space-y-1">
            <div className="text-sm">Active Vaults</div>
            <div className="font-bold text-xl">
              {user ? user.activeVaultCount : <Skeleton />}
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-20 box-border flex-1">
        <UserBorrowedHistoryGraph data={userHistories} />
      </div>
    </div>
  );
}
