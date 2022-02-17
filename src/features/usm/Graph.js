import Rechart from '../../components-ui/Rechart';
import { formatNumber } from '../../functions';

export const TooltipItems = {
  supplies: ['Total Borrowed:', 'Desired Supply:'],
  historicSupply: ['Historic Borrowed:'],
  paidBack: ['Total Paid Back:'],
  collectedStabilityFee: ['Collected Stability Fee:'],
  currentCollateralizedUSD: ['Current Collateralized Assets (USD):'],
  // currentAMMReserveUSD: ['Current Collateral AMM Reserve (USD):'],
  userBorrowedUSM: ['Borrowed USM:'],
  currentAMMReserveUSD: ['Current Collateral Assets AMM Reserve (USD):'],
};

export const TooltipInfoMessages = {
  supplies:
    'Total Borrowed is the circulating supply of USM and Desired Supply is an algorithm determined optimal supply',
  historicSupply:
    'Historic Supply is the accumulated borrowed amount of USM since inception',
  paidBack: 'Total Paid Back is the amount of USM that has been return  ed',
  collectedStabilityFee:
    'Collected Stability Fee is the amount of stability fee collected on the borrowed MTR',
  currentCollateralizedUSD:
    'Current Collateralized Assets represents USD value of collaterals',
  currentAMMReserveUSD:
    'Current Collateral Assets AMM Reserve represents USD value of collaterals assets in USM-Collateral AMMs',
  userBorrowedUSM: "Historical data of User's Borrowed USM amount",
};

export const ItemType = {
  dollar: '$',
  percentage: '%',
  number: '',
};

export const DataKeys = {
  supplies: ['currentBorrowed', 'desiredSupply'],
  historicSupply: ['historicBorrowed'],
  paidBack: ['historicPaidBack'],
  currentCollateralizedUSD: ['currentCollateralizedUSD'],
  collectedStabilityFee: ['collectedStabilityFee'],
  userBorrowedUSM: ['currentBorrowed'],
  currentAMMReserveUSD: ['ammReserveCollateralUSD'],
};

export const SuppliesGraph = ({ data }) => {
  return (
    <Rechart
      hideYAxis
      hideXAxis
      type="stack"
      data={data}
      itemType={ItemType.number}
      itemNames={TooltipItems.supplies}
      dataKey={DataKeys.supplies}
      headerText="Total Supply & Desired Supply"
      infoTooltipMessage={TooltipInfoMessages.supplies}
      stopColor={[
        ['#8236E2', 'rgba(88, 38, 158, 0)'],
        ['#8236E2', '#8236E2'],
        ['#8236E2', '#8236E2'],
        ['#000', '#fff'],
        ['#000', '#fff'],
      ]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={['#A978E7', '#A978E7']}
      headerSubText={`${data &&
        data[0] &&
        formatNumber(data[0].currentBorrowed)} USM`}
    />
  );
};

export const HistoricSuppliesGraph = ({ data }) => {
  return (
    <Rechart
      hideXAxis
      hideYAxis
      type="area"
      data={data}
      itemType={ItemType.number}
      itemNames={TooltipItems.historicSupply}
      dataKey={DataKeys.historicSupply}
      headerText="Historic Borrowed"
      infoTooltipMessage={TooltipInfoMessages.historicSupply}
      stopColor={[['#8236E2', 'rgba(88, 38, 158, 0)']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={'#A978E7'}
      headerSubText={`${data &&
        data[0] &&
        formatNumber(data[0].historicBorrowed)} USM`}
    />
  );
};

export const PaidBackGraph = ({ data }) => {
  return (
    <Rechart
      hideXAxis
      hideYAxis
      type="area"
      data={data}
      itemType={ItemType.number}
      itemNames={TooltipItems.paidBack}
      dataKey={DataKeys.paidBack}
      headerText="Paid Back USM"
      infoTooltipMessage={TooltipInfoMessages.paidBack}
      stopColor={[['#8236E2', 'rgba(88, 38, 158, 0)']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={'#A978E7'}
      headerSubText={`${data &&
        data[0] &&
        formatNumber(data[0].historicPaidBack)} USM`}
    />
  );
};

export const CurrentCollateralizedGraph = ({ data }) => {
  return (
    <Rechart
      hideXAxis
      hideYAxis
      type="area"
      data={data}
      itemType={ItemType.dollar}
      itemNames={TooltipItems.currentCollateralizedUSD}
      dataKey={DataKeys.currentCollateralizedUSD}
      headerText="Current Collateralized Assets (USD)"
      infoTooltipMessage={TooltipInfoMessages.currentCollateralizedUSD}
      stopColor={[['#8236E2', '#rgba(88, 38, 158, 0)']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={'#A978E7'}
      headerSubText={`${data &&
        data[0] &&
        formatNumber(data[0].currentCollateralizedUSD, true)}`}
    />
  );
};

export const CurrentCollateralAssetsAMMReserveGraph = ({ data }) => {
  return (
    <Rechart
      hideXAxis
      hideYAxis
      type="area"
      data={data}
      itemType={ItemType.dollar}
      itemNames={TooltipItems.currentAMMReserveUSD}
      dataKey={DataKeys.currentAMMReserveUSD}
      headerText="Current Collateral Assets AMM Reserve (USD)"
      infoTooltipMessage={TooltipInfoMessages.currentAMMReserveUSD}
      stopColor={[['#8236E2', '#rgba(88, 38, 158, 0)']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={'#A978E7'}
      headerSubText={`${data &&
        data[0] &&
        formatNumber(data[0].ammReserveCollateralUSD, true)}`}
    />
  );
};

export const CollectedStabilityFeeGraph = ({ data }) => {
  return (
    <Rechart
      simple
      hideXAxis
      hideYAxis
      type="area"
      data={data}
      itemType={ItemType.dollar}
      itemNames={TooltipItems.collectedStabilityFee}
      dataKey={DataKeys.collectedStabilityFee}
      headerText="Collected Stability Fee (USD)"
      infoTooltipMessage={TooltipInfoMessages.collectedStabilityFee}
      stopColor={[['#8236E2', '#rgba(88, 38, 158, 0)']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={'#A978E7'}
      headerSubText={`${data &&
        data[0] &&
        formatNumber(data[0].collectedStabilityFee, true)}`}
    />
  );
};

export const UserBorrowedHistoryGraph = ({ data }) => {
  return (
    <Rechart
      simple
      // hideXAxis
      hideYAxis
      type="area"
      data={data?.reverse()}
      itemType={ItemType.number}
      itemNames={TooltipItems.userBorrowedUSM}
      dataKey={DataKeys.userBorrowedUSM}
      headerText="Borrowed USM"
      stopColor={[['#8236E2', '#8236E2']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#A978E7',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.userBorrowedUSM}
      expandedGraphStrokeColor={'rgba(255,255,255,0.15'}
      stroke={'#A978E7'}
      headerSubText={`${
        data && data[0] ? parseFloat(data[0].currentBorrowed).toFixed(4) : 0
      }`}
    />
  );
};
