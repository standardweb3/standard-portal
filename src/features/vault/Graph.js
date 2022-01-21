import Rechart from '../../components-ui/Rechart';
import { formatNumber } from '../../functions';

export const TooltipItems = {
  supplies: ['Total Borrowed:', 'Desired Supply:'],
  historicSupply: ['Historic Borrowed:'],
  paidBack: ['Total Paid Back:'],
  collectedStabilityFee: ['Collected Stability Fee:'],
  currentCollateralizedUSD: ['Current Collateralized Assets (USD):'],
  currentAMMReserveUSD: ['Current Collateral AMM Reserve (USD):'],
  userBorrowedUSM: ['Borrowed USM:'],
};

export const TooltipInfoMessages = {
  supplies:
    'Total Borrowed is the circulating supply of MTR and Desired Supply is an algorithm determined optimal supply',
  historicSupply:
    'Historic Supply is the accumulated borrowed amount of MTR since inception',
  paidBack: 'Total Paid Back is the amount of MTR that has been return  ed',
  collectedStabilityFee:
    'Collected Stability Fee is the amount of stability fee collected on the borrowed MTR',
  currentCollateralizedUSD:
    'Current Collateralized Assets represents USD value of collaterals',
  currentAMMReserveUSD:
    'Current Collateral AMM Reserve represents USD value of collaterals in Collateral-MTR AMMs',
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
};

export const SuppliesGraph = ({ data }) => {
  return (
    <Rechart
      type="stack"
      data={data}
      itemType={ItemType.number}
      itemNames={TooltipItems.supplies}
      dataKey={DataKeys.supplies}
      headerText="Total Borrowed & Desired Supply"
      stopColor={[
        ['#F5AC37', '#EA9276'],
        ['#768299', '#98B3E9'],
        ['#ff758f', '#c9184a'],
        ['#000', '#fff'],
        ['#000', '#fff'],
      ]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: 'linear-gradient(180deg, #768299 -10%, #98B3E9 100%)',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.supplies}
      expandedGraphStrokeColor={'#fff'}
      headerSubText={`${data && formatNumber(data[0].currentBorrowed, true)}`}
    />
  );
};

export const HistoricSuppliesGraph = ({ data }) => {
  return (
    <Rechart
      type="area"
      data={data}
      itemType={ItemType.number}
      itemNames={TooltipItems.historicSupply}
      dataKey={DataKeys.historicSupply}
      headerText="Historic Borrowed"
      stopColor={[['#F5AC37', '#EA9276']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: 'linear-gradient(180deg, #768299 -10%, #98B3E9 100%)',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.supplies}
      expandedGraphStrokeColor={'#fff'}
      headerSubText={`${data && formatNumber(data[0].historicBorrowed, true)}`}
    />
  );
};

export const PaidBackGraph = ({ data }) => {
  return (
    <Rechart
      type="area"
      data={data}
      itemType={ItemType.dollar}
      itemNames={TooltipItems.paidBack}
      dataKey={DataKeys.paidBack}
      headerText="Paid Back MTR"
      stopColor={[['#F5AC37', '#EA9276']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: 'linear-gradient(180deg, #768299 -10%, #98B3E9 100%)',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.supplies}
      expandedGraphStrokeColor={'#fff'}
      headerSubText={`${data && formatNumber(data[0].historicPaidBack, true)}`}
    />
  );
};

export const CurrentCollateralizedGraph = ({ data }) => {
  return (
    <Rechart
      type="area"
      data={data}
      itemType={ItemType.dollar}
      itemNames={TooltipItems.currentCollateralizedUSD}
      dataKey={DataKeys.currentCollateralizedUSD}
      headerText="Current Collateralized Assets (USD)"
      stopColor={[['#F5AC37', '#EA9276']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: 'linear-gradient(180deg, #768299 -10%, #98B3E9 100%)',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.supplies}
      expandedGraphStrokeColor={'#fff'}
      headerSubText={`${data &&
        formatNumber(data[0].currentCollateralizedUSD, true)}`}
    />
  );
};

export const CollectedStabilityFeeGraph = ({ data }) => {
  return (
    <Rechart
      type="area"
      data={data}
      itemType={ItemType.dollar}
      itemNames={TooltipItems.collectedStabilityFee}
      dataKey={DataKeys.collectedStabilityFee}
      headerText="Collected Stability Fee (USD)"
      stopColor={[['#F5AC37', '#EA9276']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: 'linear-gradient(180deg, #768299 -10%, #98B3E9 100%)',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.supplies}
      expandedGraphStrokeColor={'#fff'}
      headerSubText={`${data &&
        formatNumber(data[0].collectedStabilityFee, true)}`}
    />
  );
};

export const UserBorrowedHistoryGraph = ({ data }) => {
  return (
    <Rechart
      type="area"
      data={data}
      itemType={ItemType.number}
      itemNames={TooltipItems.userBorrowedUSM}
      dataKey={DataKeys.userBorrowedUSM}
      headerText="Borrowed USM"
      stopColor={[['#F5AC37', '#EA9276']]}
      bulletpointColors={[
        {
          right: 20,
          top: -12,
          background: '#CDC1FF',
        },
      ]}
      infoTooltipMessage={TooltipInfoMessages.userBorrowedUSM}
      expandedGraphStrokeColor={'#fff'}
      headerSubText={`${data &&
        parseFloat(data[0].currentBorrowed).toFixed(4)}`}
    />
  );
};
