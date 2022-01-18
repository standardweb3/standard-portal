import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { CurrencyLogo } from '../../components-ui/CurrencyLogo';
import { SimpleCurrencyLogo } from '../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import Image from '../../components-ui/Image';
import { formatNumber } from '../../functions';
import { useVaultManagerAssetPrice } from '../../hooks/vault/useVaultManager';

const Radiation = styled.div`
  filter: drop-shadow(0px 4px 10px rgba(195, 159, 159, 0.25));
  border-radius: 50%;
`;

const Background = styled.div<{ background?: string }>`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background: ${({ background }) =>
    background
      ? `linear-gradient(${background} 20%, rgba(227, 200, 239, 0)) `
      : 'rgba(0,0,0,0)'};
`;

export function CollateralCard({ collateral }) {
  const { symbol, sfr, mcr, address, priceAddress } = collateral;
  const router = useRouter();

  const collateralPrice = useVaultManagerAssetPrice(priceAddress);

  const handleClick = () => {
    router.push(`/collateralize/${address}`);
  };

  return (
    <div
      className="w-full space-y-4 py-[24px] rounded-20 
      bg-opaque md:bg-background hover:scale-[1.03] hover:bg-bright
      transition duration-500"
      onClick={handleClick}
    >
      <div className="text-center flex flex-col items-center space-y-3">
        <Radiation>
          <SimpleCurrencyLogo
            size="96px"
            className="rounded-full select-none"
            symbol={symbol}
          />
        </Radiation>
        <div className="text-3xl font-bold mb-2">{symbol}</div>
      </div>

      <div className="flex items-center justify-center space-x-2 text-xs">
        <div className="whitespace-nowrap font-bold text-xl text-primary">
          {collateralPrice ? (
            formatNumber(collateralPrice, true)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>
      <div className="">
        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className="whitespace-nowrap text-grey">
            Stability Fee: <span className="font-bold text-text">{sfr}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs">
          <div className="whitespace-nowrap text-grey">
            Min Collateral Ratio:{' '}
            <span className="font-bold text-text">{mcr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
