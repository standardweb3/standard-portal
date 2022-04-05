import { useEffect, useMemo, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import {
  useVaultAmmReserves,
  useVaultCollateralReserves,
  vaultsGraphClient,
} from '../../services/graph';
import { collateralVaultHistoriesQuery } from '../../services/graph/queries';
import { usmPairDayDatasQuery } from '../../services/graph/queries/usmPairs';

export function useVaultDashboard() {
  const { chainId } = useActiveWeb3React();
  const [ammReserveLoaded, setAmmReserveLoaded] = useState(false);
  const [ammReserveHistories, setAmmReserveHistories] = useState(undefined);
  const [ammReserveDataKeys, setAmmReserveDataKeys] = useState([]);
  const [ammReserveTooltipItems, setAmmReserveTooltipItems] = useState([]);
  const [ammCollaterals, setAmmCollaterals] = useState([]);
  const [cVaultCollaterals, setCVaultCollaterals] = useState([])

  const [
    ammReserveHistoriesForGraph,
    setAmmReserveHistoriesForGraph,
  ] = useState(undefined);

  const [collateralReservesLoaded, setCollateralReservesLoaded] = useState(
    false,
  );
  const [collateralReserveHistories, setCollateralReserveHistories] = useState(
    undefined,
  );
  const [collateralReserveDataKeys, setCollateralReserveDataKeys] = useState(
    [],
  );
  const [
    collateralReserveTooltipItems,
    setCollateralReserveTooltipItems,
  ] = useState([]);

  const [
    collateralReserveHistoriesForGraph,
    setCollateralReserveHistoriesForGraph,
  ] = useState(undefined);

  const [
    collateralAmmLiquidationDataKeys,
    setCollateralAmmLiquidationDataKeys,
  ] = useState([]);
  const [
    collateralAmmLiquidationTooltipItems,
    setCollateralAmmLiquidationTooltipItems,
  ] = useState([]);

  const [
    collateralAmmLiquidationHistoriesForGraph,
    setCollateralAmmLiquidationHistoriesForGraph,
  ] = useState(undefined);

  const vaultClient = vaultsGraphClient(chainId);
  const ammReserves = useVaultAmmReserves();
  const collateralReserves = useVaultCollateralReserves();

  let ammReserveHistoriesResult = {};
  let ammCollateralsResult = {};

  useEffect(() => {
    if (!ammReserveLoaded && ammReserves !== undefined) {
      Promise.all(
        ammReserves.map(async (reserve) => {
          let results = await vaultClient.query({
            query: usmPairDayDatasQuery,
            variables: {
              where: {
                collateral: reserve.collateral,
              },
            },
          });
          ammReserveHistoriesResult[reserve.collateralSymbol] =
            results?.data?.pairDayDatas ?? [];
          ammCollateralsResult[reserve.collateralSymbol] = true;
        }),
      ).then(() => {
        setAmmReserveHistories(ammReserveHistoriesResult);
        setAmmCollaterals(Object.keys(ammCollateralsResult))
      });
      setAmmReserveLoaded(true);
    }
  }, [ammReserveLoaded, ammReserves]);

  let collateralReserveHistoriesResult = {};
  let cVaultCollateralsResult = {};

  useEffect(() => {
    if (!collateralReservesLoaded && collateralReserves !== undefined) {
      Promise.all(
        collateralReserves.map(async (reserve) => {
          let results = await vaultClient.query({
            query: collateralVaultHistoriesQuery,
            variables: {
              where: {
                collateralVault: reserve.collateral,
              },
            },
          });
          collateralReserveHistoriesResult[reserve.cdp.symbol] =
            results?.data?.collateralVaultHistories ?? [];
            cVaultCollateralsResult[reserve.cdp.symbol] = true;

        }),
      ).then(() => {
        setCollateralReserveHistories(collateralReserveHistoriesResult);
        setCVaultCollaterals(Object.keys(cVaultCollateralsResult))
      });
      setCollateralReservesLoaded(true);
    }
  }, [collateralReservesLoaded, collateralReserves]);

  useEffect(() => {
    if (ammReserveHistories !== undefined) {
      let resultMap = {};
      let dataKeys = {};
      let toolTipItems = {};

      Object.entries(ammReserveHistories).map(([symbol, histories]: any) => {
        histories.forEach((history) => {
          if (resultMap[history.timestamp]) {
            resultMap[history.timestamp][symbol + 'Reserve'] =
              history.collateralReserve;
          } else {
            resultMap[history.timestamp] = {
              [symbol + 'Reserve']: history.collateralReserve,
              timestamp: history.timestamp,
            };
            if (!dataKeys[symbol + 'Reserve'])
              dataKeys[symbol + 'Reserve'] = true;
            if (!toolTipItems[symbol + ' Reserve'])
              toolTipItems[symbol + ' Reserve'] = true;
          }
        });
      });
      setAmmReserveHistoriesForGraph(Object.values(resultMap));
      setAmmReserveDataKeys(Object.keys(dataKeys));
      setAmmReserveTooltipItems(Object.keys(toolTipItems));
    }
  }, [ammReserveHistories]);

  useEffect(() => {
    if (collateralReserveHistories !== undefined) {
      let resultMap = {};
      let dataKeys = {};
      let toolTipItems = {};

      let liquidationsResultMap = {};
      let liquidationDataKeys = {};
      let liquidationToolTipItems = {};

      Object.entries(collateralReserveHistories).map(
        ([symbol, histories]: any) => {
          histories.forEach((history) => {
            if (resultMap[history.timestamp]) {
              resultMap[history.timestamp][symbol + 'Reserve'] =
                history.currentCollateralized;
              liquidationsResultMap[history.timestamp][symbol + 'Liquidation'] =
                history.currentCollateralized;
            } else {
              resultMap[history.timestamp] = {
                [symbol + 'Reserve']: history.currentCollateralized,
                timestamp: history.timestamp,
              };

              liquidationsResultMap[history.timestamp] = {
                [symbol + 'Liquidation']: history.liquidationAMM,
                timestamp: history.timestamp,
              };
              if (!dataKeys[symbol + 'Reserve']) {
                dataKeys[symbol + 'Reserve'] = true;
                liquidationDataKeys[symbol + 'Liquidation'] = true;
              }
              if (!toolTipItems[symbol + ' Reserve']) {
                toolTipItems[symbol + ' Reserve'] = true;
                liquidationToolTipItems[symbol + ' AMM Liquidations'] = true;
              }
            }
          });
        },
      );
      setCollateralReserveHistoriesForGraph(Object.values(resultMap));
      setCollateralReserveDataKeys(Object.keys(dataKeys));
      setCollateralReserveTooltipItems(Object.keys(toolTipItems));

      setCollateralAmmLiquidationHistoriesForGraph(
        Object.values(liquidationsResultMap),
      );
      setCollateralAmmLiquidationDataKeys(Object.keys(liquidationDataKeys));
      setCollateralAmmLiquidationTooltipItems(
        Object.keys(liquidationToolTipItems),
      );
    }
  }, [collateralReserveHistories]);

  return {
    ammReserveDataKeys,
    collateralReserveDataKeys,
    collateralAmmLiquidationDataKeys,
    ammReserveHistoriesForGraph,
    collateralReserveHistoriesForGraph,
    collateralAmmLiquidationHistoriesForGraph,
    ammReserveTooltipItems,
    collateralReserveTooltipItems,
    collateralAmmLiquidationTooltipItems,
    ammCollaterals,
    cVaultCollaterals
  };
  //   console.log('wwb', ammReserveHistories, collateralReserveHistories);
  //   console.log('wwwwwww', Object.values(collateralReserveHistories))
  //   for (let key in ammReserveHistories) {
  //     console.log('wwwwww', key);
  //   }
  //   console.log('wwb', ammReserveHistories, collateralReserveHistories);
}
