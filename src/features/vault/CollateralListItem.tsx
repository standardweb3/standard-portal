import { getAddress } from 'ethers/lib/utils';
import { useRouter } from 'next/router';
import Image from '../../components-ui/Image';
import { formatNumber, formatPercent } from '../../functions';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';

export function CollateralListItem({ collateral }) {
  const { logo, name, sfr, mcr, color, address, priceAddress } = collateral;
  const router = useRouter();
  const collateralPrice = useVaultManagerAssetPrice(priceAddress);

  const handleClick = () => {
    router.push(`/collateralize/${address}`);
  };

  return (
    <div className="grid grid-cols-4 text-text w-full rounded-20 hover:bg-bright transition duration-500 p-2">
      <div className="col-span-1 flex flex-col items-center space-y-2">
        <Image
          className="rounded-full select-none"
          src={logo}
          width="36px"
          height="36px"
          layout="fixed"
        />
        <div className="font-bold text-grey">{name}</div>
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
          {formatNumber(collateralPrice, true)}
        </div>
      </div>
    </div>
  );
}
