import { formatNumber } from '../../functions';

const renderDate = (index, payload, item) => {
  return index === payload.length - 1 ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000)
        .toLocaleString('default', { month: 'long' })
        .charAt(0)
        .toUpperCase()}
      {new Date(item.payload.timestamp * 1000)
        .toLocaleString('default', { month: 'long' })
        .slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()},{' '}
      {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ''
  );
};

const renderItem = (type, item) => {
  return type === '$' ? (
    <div>{`${formatNumber(item, true)}`}</div>
  ) : (
    <div>{`${formatNumber(item)}${type}`}</div>
  );
};

const renderTooltipItems = (
  payload,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked = false,
  isPOL = false,
) => {
  console.log('why', bulletpointColors);
  return isStaked ? (
    <div>
      <div className="flex justify-between">
        <div>
          <span
            className="tooltip-bulletpoint"
            style={bulletpointColors[0]}
          ></span>
          Staked
        </div>
        <div>{`${Math.round(payload[0].value)}%`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          <span
            className="tooltip-bulletpoint"
            style={bulletpointColors[1]}
          ></span>
          Not staked
        </div>
        <div>{`${Math.round(100 - payload[0].value)}%`}</div>
      </div>
      <div>{renderDate(0, payload, payload[0])}</div>
    </div>
  ) : isPOL ? (
    <div>
      <div className="flex justify-between">
        <div>
          <span
            className="tooltip-bulletpoint"
            style={bulletpointColors[0]}
          ></span>
          {itemNames[0]}
        </div>
        <div>{`${Math.round(payload[0].value)}%`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          <span
            className="tooltip-bulletpoint"
            style={bulletpointColors[1]}
          ></span>
          {itemNames[1]}
        </div>
        <div>{`${Math.round(100 - payload[0].value)}%`}</div>
      </div>
      <div>{renderDate(0, payload, payload[0])}</div>
    </div>
  ) : (
    payload.map((item, index) => (
      <div key={index} className="space-y-2 text-xs">
        <div className="flex space-x-1">
          <div className="flex justify-between">
            <div className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={bulletpointColors[index]}
              ></div>
              <div>{itemNames[index]}</div>
            </div>
          </div>
          {renderItem(itemType, item.value)}
        </div>
        <div>{renderDate(index, payload, item)}</div>
      </div>
    ))
  );
};

function CustomTooltip({
  active,
  payload,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  isPOL,
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg text-text bg-bright bg-opacity-50 p-4">
        {renderTooltipItems(
          payload,
          bulletpointColors,
          itemNames,
          itemType,
          isStaked,
          isPOL,
        )}
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
