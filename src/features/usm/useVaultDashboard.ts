import { useEffect, useMemo, useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import {
  useVaultAmmReserves,
  useVaultCollateralReserves,
  vaultsGraphClient,
} from '../../services/graph';
import { collateralVaultHistoriesQuery } from '../../services/graph/queries';
import { usmPairDayDatasQuery } from '../../services/graph/queries/usmPairs';

const timestampToDateTimestamp = (timestamp) => {
  return Math.floor(timestamp / 86400) * 86400;
};
export function useVaultDashboard() {
  const { chainId } = useActiveWeb3React();
  const [ammReserveLoaded, setAmmReserveLoaded] = useState(false);
  const [ammReserveHistories, setAmmReserveHistories] = useState(undefined);
  const [ammReserveDataKeys, setAmmReserveDataKeys] = useState([]);
  const [ammReserveTooltipItems, setAmmReserveTooltipItems] = useState([]);
  const [ammCollaterals, setAmmCollaterals] = useState([]);
  const [cVaultCollaterals, setCVaultCollaterals] = useState([]);

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
  const ammReserves = useVaultAmmReserves({
    where: {
      isOpen: true,
    },
  });
  const collateralReserves = useVaultCollateralReserves();

  let ammReserveHistoriesResult = {};
  let ammCollateralsResult = {};

  useEffect(() => {
    if (!ammReserveLoaded && ammReserves !== undefined) {
      Promise.all(
        ammReserves.map(async (reserve) => {
          const symbol = reserve.collateralSymbol?.split('.').join('');
          let results = await vaultClient.query({
            query: usmPairDayDatasQuery,
            variables: {
              where: {
                collateral: reserve.collateral,
              },
            },
          });
          if (symbol) {
            ammReserveHistoriesResult[symbol] =
              results?.data?.pairDayDatas?.map((d) => {
                return {
                  ...d,
                  timestamp: timestampToDateTimestamp(d.timestamp),
                };
              }) ?? [];
            ammCollateralsResult[symbol] = true;
          }
        }),
      ).then(() => {
        setAmmReserveHistories(ammReserveHistoriesResult);
        setAmmCollaterals(Object.keys(ammCollateralsResult));
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
          const symbol = reserve.cdp?.symbol?.split('.').join('');
          let results = await vaultClient.query({
            query: collateralVaultHistoriesQuery,
            variables: {
              where: {
                collateralVault: reserve.collateral,
              },
            },
          });
          if (symbol) {
            collateralReserveHistoriesResult[symbol] =
              results?.data?.collateralVaultHistories?.map((history) => {
                return {
                  ...history,
                  timestamp: timestampToDateTimestamp(history.timestamp),
                };
              }) ?? [];
            cVaultCollateralsResult[symbol] = true;
          }
        }),
      ).then(() => {
        setCollateralReserveHistories(collateralReserveHistoriesResult);
        setCVaultCollaterals(Object.keys(cVaultCollateralsResult));
      });
      setCollateralReservesLoaded(true);
    }
  }, [collateralReservesLoaded, collateralReserves]);

  useEffect(() => {
    if (ammReserveHistories !== undefined && ammCollaterals.length > 0) {
      let resultMap = {};
      let dataKeys = {};
      let toolTipItems = {};

      Object.entries(ammReserveHistories).map(([_symbol, histories]: any) => {
        const symbol = _symbol.split('.').join('');
        histories.forEach((history) => {
          if (resultMap[history.timestamp]) {
            resultMap[history.timestamp][symbol + 'Reserve'] = parseFloat(
              history.collateralReserve,
            );
          } else {
            resultMap[history.timestamp] = {
              [symbol + 'Reserve']: parseFloat(history.collateralReserve),
              timestamp: history.timestamp,
            };
          }
        });
        if (!dataKeys[symbol + 'Reserve']) dataKeys[symbol + 'Reserve'] = true;
        if (!toolTipItems[symbol + ' Reserve'])
          toolTipItems[symbol + ' Reserve'] = true;
      });

      const keys = Object.keys(resultMap);
      keys.forEach((key, index) => {
        ammCollaterals.forEach((collateral) => {
          if (index === 0) {
            if (resultMap[key][collateral + 'Reserve'] === undefined) {
              resultMap[key][collateral + 'Reserve'] = 0;
            }
          } else {
            if (resultMap[key][collateral + 'Reserve'] === undefined) {
              resultMap[key][collateral + 'Reserve'] =
                resultMap[keys[index - 1]][collateral + 'Reserve'];
            }
          }
        });
      });

      setAmmReserveHistoriesForGraph(Object.values(resultMap));
      setAmmReserveDataKeys(Object.keys(dataKeys));
      setAmmReserveTooltipItems(Object.keys(toolTipItems));
    }
  }, [ammReserveHistories, ammCollaterals]);

  useEffect(() => {
    if (
      collateralReserveHistories !== undefined &&
      cVaultCollaterals.length > 0
    ) {
      let resultMap = {};
      let dataKeys = {};
      let toolTipItems = {};

      let liquidationsResultMap = {};
      let liquidationDataKeys = {};
      let liquidationToolTipItems = {};

      Object.entries(collateralReserveHistories).map(
        ([_symbol, histories]: any) => {
          const symbol = _symbol.split('.').join('');
          histories.forEach((history) => {
            if (resultMap[history.timestamp]) {
              resultMap[history.timestamp][symbol + 'Reserve'] = parseFloat(
                history.currentCollateralized,
              );
              liquidationsResultMap[history.timestamp][
                symbol + 'Liquidation'
              ] = parseFloat(history.liquidationAMM);
            } else {
              resultMap[history.timestamp] = {
                [symbol + 'Reserve']: parseFloat(history.currentCollateralized),
                timestamp: history.timestamp,
              };

              liquidationsResultMap[history.timestamp] = {
                [symbol + 'Liquidation']: parseFloat(history.liquidationAMM),
                timestamp: history.timestamp,
              };
            }
          });

          if (!dataKeys[symbol + 'Reserve']) {
            dataKeys[symbol + 'Reserve'] = true;
            liquidationDataKeys[symbol + 'Liquidation'] = true;
          }

          if (!toolTipItems[symbol + ' Reserve']) {
            toolTipItems[symbol + ' Reserve'] = true;
            liquidationToolTipItems[symbol + ' AMM Liquidations'] = true;
          }
        },
      );

      const keys = Object.keys(resultMap);
      keys.forEach((key, index) => {
        cVaultCollaterals.forEach((collateral) => {
          if (index === 0) {
            if (resultMap[key][collateral + 'Reserve'] === undefined) {
              resultMap[key][collateral + 'Reserve'] = 0;
            }
            if (
              liquidationsResultMap[key][collateral + 'Liquidation'] ===
              undefined
            ) {
              liquidationsResultMap[key][collateral + 'Liquidation'] = 0;
            }
          } else {
            if (resultMap[key][collateral + 'Reserve'] === undefined) {
              resultMap[key][collateral + 'Reserve'] = resultMap[keys[index-1]][collateral + 'Reserve']
            }
            if (
              liquidationsResultMap[key][collateral + 'Liquidation'] ===
              undefined
            ) {
              liquidationsResultMap[key][collateral + 'Liquidation'] =
                liquidationsResultMap[keys[index - 1]][
                  collateral + 'Liquidation'
                ];
            }
          }
        });
      });

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
  }, [collateralReserveHistories, cVaultCollaterals]);

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
    cVaultCollaterals,
  };
}
