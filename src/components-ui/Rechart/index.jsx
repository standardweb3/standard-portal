import Skeleton from 'react-loading-skeleton';
import CustomTooltip from './CustomTooltip';
import ExpandedChart from './Expanded';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { trim } from '../../functions';
import { LogoSpinner } from '../Spinner/LogoSpinner';
import { Question } from '../Question';
import { formatNumberScale, formatPercent } from '../../functions';
import { ItemType } from '../../features/vault/Graph';

const formatCurrency = (c) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(c);
};

const tickCount = 3;
const expandedTickCount = 5;

const renderExpandedChartStroke = (isExpanded, color) => {
  return isExpanded ? <CartesianGrid vertical={false} stroke={color} /> : '';
};

const renderAreaChart = (
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  isExpanded,
  expandedGraphStrokeColor,
  isPOL,
) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[0][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={(str) => format(new Date(str * 1000), 'MMM dd')}
      reversed={true}
      connectNulls={true}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === 'percent' ? 33 : 55}
      tickFormatter={(number) =>
        number !== 0
          ? dataFormat !== 'percent'
            ? `${formatNumberScale(
                parseFloat(number),
                itemType === ItemType.dollar,
              )}`
            : `${formatPercent(parseFloat(number))}`
          : ''
      }
      domain={[0, 'auto']}
      dx={3}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
          isStaked={isStaked}
          isPOL={isPOL}
        />
      }
    />
    <Area
      dataKey={dataKey[0]}
      stroke="none"
      fill={`url(#color-${dataKey[0]})`}
      fillOpacity={1}
    />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderStackedAreaChart = (
  data,
  dataKey,
  stopColor,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[0][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[1]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[1][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[1][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[2]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[2][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[2][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[3]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[3][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[3][1]} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`color-${dataKey[4]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[4][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[4][1]} stopOpacity={0.9} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={(str) => format(new Date(str * 1000), 'MMM dd')}
      reversed={true}
      connectNulls={true}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === 'percent' ? 33 : 55}
      tickFormatter={(number) => {
        if (number !== 0) {
          if (dataFormat === 'percent') {
            return `${formatPercent(parseFloat(number))}`;
          } else if (dataFormat === 'k')
            return `${formatNumberScale(
              parseFloat(number),
              itemType === ItemType.dollar,
            )}`;
          else
            return `${formatNumberScale(
              parseFloat(number),
              itemType === ItemType.dollar,
            )}`;
        }
        return '';
      }}
      domain={[0, 'auto']}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      formatter={(value) => trim(parseFloat(value), 2)}
      content={
        <div>Tooltip</div>

        // <CustomTooltip
        //   bulletpointColors={bulletpointColors}
        //   itemNames={itemNames}
        //   itemType={itemType}
        // />
      }
    />
    <Area
      dataKey={dataKey[0]}
      stroke={stroke ? stroke[0] : 'none'}
      fill={`url(#color-${dataKey[0]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[1]}
      stroke={stroke ? stroke[1] : 'none'}
      fill={`url(#color-${dataKey[1]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[2]}
      stroke={stroke ? stroke[2] : 'none'}
      fill={`url(#color-${dataKey[2]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[3]}
      stroke={stroke ? stroke[3] : 'none'}
      fill={`url(#color-${dataKey[3]})`}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[4]}
      stroke={stroke ? stroke[4] : 'none'}
      fill={`url(#color-${dataKey[4]})`}
      fillOpacity={1}
      stackId="1"
    />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </AreaChart>
);

const renderLineChart = (
  data,
  dataKey,
  stroke,
  color,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
  scale,
) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={100}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      connectNulls={true}
      tickFormatter={(str) => format(new Date(str * 1000), 'MMM dd')}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={
        scale == 'log' ? 1 : isExpanded ? expandedTickCount : tickCount
      }
      axisLine={false}
      tickLine={false}
      width={32}
      scale={scale}
      tickFormatter={(number) =>
        number !== 0
          ? dataFormat !== 'percent'
            ? `${formatPercent(number)}`
            : `${formatNumberScale(
                parseFloat(number),
                itemType === ItemType.dollar,
              )}`
          : ''
      }
      domain={[scale == 'log' ? 'dataMin' : 0, 'auto']}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
        />
      }
    />
    <Line
      type="monotone"
      dataKey={dataKey[0]}
      stroke={stroke ? stroke : 'none'}
      color={color}
      dot={false}
    />
    ;{renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

const renderMultiLineChart = (
  data,
  dataKey,
  color,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
) => (
  <LineChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      reversed={true}
      connectNulls={true}
      tickFormatter={(str) => format(new Date(str * 1000), 'MMM dd')}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={25}
      tickFormatter={(number) =>
        number !== 0 ? `${trim(parseFloat(number), 2)}` : ''
      }
      domain={[0, 'auto']}
      connectNulls={true}
      allowDataOverflow={false}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
        />
      }
    />
    <Line dataKey={dataKey[0]} stroke={stroke[0]} dot={false} />;
    <Line dataKey={dataKey[1]} stroke={stroke[1]} dot={false} />;
    <Line dataKey={dataKey[2]} stroke={stroke[2]} dot={false} />;
    <Line dataKey={dataKey[3]} stroke={stroke[3]} dot={false} />;
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

// JTBD: Bar chart for Holders
const renderBarChart = (
  data,
  dataKey,
  stroke,
  dataFormat,
  bulletpointColors,
  itemNames,
  itemType,
  isExpanded,
  expandedGraphStrokeColor,
) => (
  <BarChart data={data}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={tickCount}
      tickLine={false}
      reversed={true}
      tickFormatter={(str) => format(new Date(str * 1000), 'MMM dd')}
      padding={{ right: 20 }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tickCount={isExpanded ? expandedTickCount : tickCount}
      width={33}
      domain={[0, 'auto']}
      allowDataOverflow={false}
      tickFormatter={(number) => (number !== 0 ? number : '')}
    />
    <Tooltip
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
        />
      }
    />
    <Bar dataKey={dataKey[0]} fill={stroke[0]} />
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </BarChart>
);

function Rechart({
  type,
  data,
  scale,
  dataKey,
  color,
  stopColor,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  infoTooltipMessage,
  expandedGraphStrokeColor,
  isPOL,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type, isExpanded) => {
    if (type === 'line')
      return renderLineChart(
        data,
        dataKey,
        color,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        scale,
      );
    if (type === 'area')
      return renderAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isStaked,
        isExpanded,
        expandedGraphStrokeColor,
        isPOL,
      );
    if (type === 'stack')
      return renderStackedAreaChart(
        data,
        dataKey,
        stopColor,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      );
    if (type === 'multi')
      return renderMultiLineChart(
        data,
        dataKey,
        color,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      );

    if (type === 'bar')
      return renderBarChart(
        data,
        dataKey,
        stroke,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
      );
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return loading ? (
    <div className="flex justify-center items-center">
      <LogoSpinner width={24} height={24} />
    </div>
  ) : (
    <div className="w-full h-full text-text p-6 space-y-4">
      <div className="">
        <div className="flex justify-between items-center w-full overflow-hidden">
          <div className="flex items-center w-[90%] space-x-1">
            <div className="text-sm">{headerText}</div>
            <Question text={infoTooltipMessage} />
          </div>
          {/* could make this svgbutton */}

          <div>Icon</div>
          <ExpandedChart
            open={open}
            handleClose={handleClose}
            renderChart={renderChart(type, true)}
            uid={dataKey}
            data={data}
            infoTooltipMessage={infoTooltipMessage}
            headerText={headerText}
            headerSubText={headerSubText}
          />
        </div>
        {loading ? (
          <Skeleton count={1} />
        ) : (
          <div className="flex space-x-1 items-center">
            <div className="text-primary font-bold">{headerSubText}</div>
          </div>
        )}
      </div>
      <div className="w-full min-w-[310px] min-h-[260px] rounded-20 pr-6">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false)}
          </ResponsiveContainer>
        ) : (
          <Skeleton count={1} />
        )}
      </div>
    </div>
  );
}

export default Rechart;
