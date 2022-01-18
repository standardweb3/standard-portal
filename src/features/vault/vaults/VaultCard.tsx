import { CurrencyLogo } from '../../../components-ui/CurrencyLogo';
import { useCurrency } from '../../../hooks/Tokens';
import { useVaultManagerAssetPrice } from '../../../hooks/vault/useVaultManager';
import Skeleton from 'react-loading-skeleton';
import {
  classNames,
  formatBalance,
  formatNumber,
  formatPercent,
} from '../../../functions';
import styled from '@emotion/styled';
import router from 'next/router';
import { CDP_DECIMALS } from '../constants';
import { current } from '@reduxjs/toolkit';
import { Question } from '../../../components-ui/Question';

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

  const liquidationPriceUSD =
    (currentBorrowed * mcr) / 100 / currentCollateralized;
  const text =
    collateralPriceUSD > liquidationPriceUSD * 1.2
      ? 'safe'
      : collateralPriceUSD >= liquidationPriceUSD
      ? 'warning'
      : 'danger';

  const bgColor = 'bg-' + text;
  const textColor = 'text-' + text;
  const borderColor = 'border-' + text;
  // const ratio = collateralValueUSD
  //   ? (collateralValueUSD / parseFloat(currentBorrowed)) * 100
  //   : undefined;

  const handleClick = () => {
    router.push(`/vault/${address}`);
  };
  return (
    <div
      className="
        w-full py-[24px] text-text relative 
        flex flex-col rounded-20 items-center cursor-pointer
        bg-opaque md:bg-background hover:scale-[1.03] hover:bg-bright
        transition duration-500"
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
      <div
        className={classNames(
          'absolute top-4 right-4 px-3 py-1 rounded-20 text-xs flex items-center space-x-1',
          textColor,
          'border',
          borderColor,
        )}
      >
        <div>{text}</div>
        <Question
          text={
            <div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-grey">Current Price</div>
                <div className={classNames('font-bold', textColor)}>
                  $
                  {collateralPriceUSD !== undefined ? (
                    collateralPriceUSD.toFixed(4)
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center mt-1">
                <div className="text-sm text-grey">Liquidation Price</div>
                <div className="font-bold text-primary">
                  $
                  {liquidationPriceUSD !== undefined ? (
                    liquidationPriceUSD.toFixed(4)
                  ) : (
                    <Skeleton count={1} />
                  )}
                </div>
              </div>
            </div>
          }
        />
      </div>

      <div className="font-bold text-2xl mt-3 mb-2">
        {collateral ? collateral.symbol : <Skeleton count={1} />}
      </div>
      {/* <div className="flex flex-col items-center">
        <div className="text-sm text-grey">Current Price</div>
        <div className={classNames('font-bold', textColor)}>
          $
          {collateralPriceUSD !== undefined ? (
            collateralPriceUSD.toFixed(4)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mt-1">
        <div className="text-sm text-grey">Liquidation Price</div>
        <div className="font-bold text-primary">
          $
          {liquidationPriceUSD !== undefined ? (
            liquidationPriceUSD.toFixed(4)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div> */}

      <div className="flex flex-col items-center">
        <div className="text-sm text-grey">Borrowed</div>
        <div className="font-bold text-xl">
          {currentBorrowed ? (
            formatNumber(currentBorrowed, true)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <div className="text-sm text-grey">Collateralized</div>
        <div className="font-bold text-xl">
          {currentCollateralized ? (
            formatNumber(currentCollateralized, true)
          ) : (
            <Skeleton count={1} />
          )}
        </div>
      </div>
    </div>
  );
}
