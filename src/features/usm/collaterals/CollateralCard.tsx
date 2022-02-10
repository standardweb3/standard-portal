import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';
import { SimpleCurrencyLogo } from '../../../components-ui/CurrencyLogo/SimpleCurrencyLogo';
import { formatNumber } from '../../../functions';
import { useVaultManagerAssetPrice } from '../../../hooks/vault/useVaultManager';
import { useSizeXs } from '../../../components-ui/Responsive';

export const Radiation = styled.div`
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
  const isViewportXs = useSizeXs();

  const collateralPrice = useVaultManagerAssetPrice(priceAddress);

  const handleClick = () => {
    router.push(`/borrow/collateralize/${address}`);
  };

  return (
    <div
      className="w-full px-4 py-[24px] rounded-20 
      bg-background hover:scale-[1.03] hover:bg-bright
      transition duration-500
      flex flex-row space-x-8 justify-between
      xs:flex-col xs:space-y-4 xs:space-x-0 xs:justify-start
      "
      onClick={handleClick}
    >
      <div
        className="
      text-center 
      flex flex-row space-x-4 items-center
      xs:flex-col xs:items-center xs:space-y-3 xs:space-x-0
      "
      >
        <Radiation>
          <SimpleCurrencyLogo
            size={isViewportXs ? '64px' : '96px'}
            className="rounded-full select-none"
            symbol={symbol}
          />
        </Radiation>
        <div className="text-2xl sm:text-3xl font-bold mb-2">{symbol}</div>
      </div>

      <div
        className="flex flex-col space-y-1 items-start 
      xs:space-y-4 xs:items-center"
      >
        <div className="flex items-center justify-center text-xs">
          <div className="whitespace-nowrap font-bold text-xl text-primary">
            {collateralPrice ? (
              formatNumber(collateralPrice, true)
            ) : (
              <Skeleton count={1} />
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center xs:justify-center text-xs">
            <div className="text-grey">
              <span className="whitespace-nowrap inline-block mr-1">
                Stability Fee:
              </span>
              <span className="font-bold text-text inline-block">{sfr}</span>
            </div>
          </div>

          <div className="flex items-center xs:justify-center text-xs">
            <div className="text-grey">
              <span className="whitespace-normal inline-block mr-1">
                Min Collateral Ratio:
              </span>
              <span className="font-bold text-text inline-block">{mcr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
