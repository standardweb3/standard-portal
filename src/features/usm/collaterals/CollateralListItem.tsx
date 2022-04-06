import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { formatNumber, formatPercent } from '../../../functions';
import { useVaultManagerAssetPrice } from '../../../hooks/vault/useVaultManager';

export function CollateralListItem({ collateral }) {
  const { symbol, sfr, mcr, address, priceAddress } = collateral;
  const router = useRouter();
  const collateralPrice = useVaultManagerAssetPrice(priceAddress);

  const handleClick = () => {
    router.push(`/borrow//collateralize/${address}`);
  };

  return (
    <div
      className="
        grid grid-cols-4 shadow-simple text-text w-full 
        rounded-20 hover:bg-bright transition duration-500 p-2
        bg-background md:p-4"
      onClick={handleClick}
    >
      <div
        className="col-span-1 flex flex-col items-center space-y-1
        md:flex-row md:justify-center md:space-y-0 md:space-x-2
      "
      >
        <SimpleCurrencyLogo
          className="rounded-full select-none"
          symbol={symbol}
          size="36px"
        />
        <div className="font-bold text-grey">{symbol}</div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="rounded-20 bg-dark font-bold bg-background-farm-list p-3">
          {formatPercent(sfr)}
        </div>
      </div>

      <div className="col-span-1 flex justify-center items-center">
        <div className="font-bold">{formatPercent(mcr)}</div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="font-bold text-primary">
          {collateralPrice ? (
            formatNumber(collateralPrice, true)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>
    </div>
  );
}
