import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { useCurrency } from '../../../hooks/Tokens';
import { useVaultManagerAssetPrice } from '../../../hooks/vault/useVaultManager';
import Skeleton from 'react-loading-skeleton';
import { classNames, formatNumber, formatPercent } from '../../../functions';
import styled from '@emotion/styled';
import router from 'next/router';

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

export function VaultCard({
  address,
  collateralAddress,
  mcr,
  currentBorrowed,
  currentCollateralized,
  id,
}) {
  const collateralPriceUSD = useVaultManagerAssetPrice(collateralAddress);
  const collateral = useCurrency(collateralAddress);
  const collateralValueUSD = collateralPriceUSD
    ? collateralPriceUSD * parseFloat(currentCollateralized)
    : undefined;

  const ratio = collateralValueUSD
    ? (collateralValueUSD / parseFloat(currentBorrowed)) * 100
    : undefined;

  const safety = mcr ? ratio > parseFloat(mcr) : undefined;

  const handleClick = () => {
    router.push(`/vault/${address}`);
  };
  return (
    <Background
      className="w-full py-[24px] text-text relative flex flex-col rounded-20 items-center cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={classNames(
          'w-6 h-6 rounded-full absolute right-4 top-4 z-10',
        )}
      ></div>
      <Radiation>
        {collateral ? (
          <CurrencyLogo
            currency={collateral}
            className="rounded-full"
            size="72px"
          />
        ) : (
          <Skeleton circle width="72px" height="72px" />
        )}
      </Radiation>
      <div className="font-bold text-2xl mt-3 mb-2">
        {collateral ? collateral.symbol : <Skeleton count={1} />}
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm text-grey">Borrowed</div>
        <div className="font-bold">
          {currentBorrowed ? (
            formatNumber(currentBorrowed, true)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-sm text-grey">Collateralized</div>
        <div className="font-bold">
          {currentCollateralized ? (
            formatNumber(currentCollateralized, true)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>

      <div className="flex space-x-1 items-center mt-4">
        <div className="text-xs text-grey">Liq. Ratio:</div>
        <div className="font-bold text-xs">
          {mcr ? formatPercent(mcr) : <Skeleton count={1} />}
        </div>
      </div>
    </Background>
  );
}
