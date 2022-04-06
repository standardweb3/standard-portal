import { useRouter } from 'next/router';
import { NavigationLink } from '../../../components-ui/NavigationLink';
import { classNames } from '../../../functions';

export function VaultHeader({
  payback = undefined,
  withdraw = undefined,
  deposit = undefined,
  mint = undefined,
  vaultAddress,
}) {
  const router = useRouter();
  const style = `
    flex items-center justify-center 
    py-1
    px-2
    font-medium text-center text-grey
    border-b-4 border-opaque-border-2`;
  const activeStyle = `!border-primary !text-text`;

  return (
    <div className="flex items-center justify-center p-3px">
      <NavigationLink href={`/vault/${vaultAddress}`}>
        <a className={classNames(style, payback && activeStyle)}>Payback</a>
      </NavigationLink>
      <NavigationLink href={`/vault/${vaultAddress}/mint`}>
        <a className={classNames(style, mint && activeStyle)}>Mint</a>
      </NavigationLink>
      <NavigationLink href={`/vault/${vaultAddress}/deposit`}>
        <a className={classNames(style, deposit && activeStyle)}>Deposit</a>
      </NavigationLink>
      <NavigationLink href={`/vault/${vaultAddress}/withdraw`}>
        <a className={classNames(style, withdraw && activeStyle)}>Withdraw</a>
      </NavigationLink>
    </div>
  );
}
