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
import { ItemType } from '../../features/usm/Graph';
import { ArrowsExpandIcon } from '@heroicons/react/outline';

// const formatCurrency = (c) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     maximumFractionDigits: 0,
//     minimumFractionDigits: 0,
//   }).format(c);
// };

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
  hideYAxis = undefined,
  hideXAxis = undefined,
  reversed = true,
) => (
  <AreaChart data={data}>
    <defs>
      <linearGradient id={`color-${dataKey[0]}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stopColor[0][0]} stopOpacity={1} />
        <stop offset="90%" stopColor={stopColor[0][1]} stopOpacity={0.5} />
      </linearGradient>
    </defs>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickLine={false}
      tickFormatter={(str) => format(new Date(str * 1000), 'MMM dd')}
      reversed={reversed}
      connectNulls={true}
      tick={{
        fill: '#fff',
      }}
      hide={hideXAxis}
      // padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === 'percent' ? 33 : 70}
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
      allowDataOverflow={true}
      hide={hideYAxis}
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
      stroke={stroke}
      strokeWidth={3}
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
  hideYAxis = undefined,
  hideXAxis = undefined,
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
      // padding={{ right: 20 }}
      hide={hideXAxis}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={dataFormat === 'percent' ? 33 : 70}
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
      hide={hideYAxis}
    />
    <Tooltip
      formatter={(value) => trim(parseFloat(value), 2)}
      content={
        <CustomTooltip
          bulletpointColors={bulletpointColors}
          itemNames={itemNames}
          itemType={itemType}
        />
      }
    />
    <Area
      dataKey={dataKey[0]}
      stroke={stroke ? stroke[0] : 'none'}
      fill={`url(#color-${dataKey[0]})`}
      strokeWidth={3}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[1]}
      stroke={stroke ? stroke[1] : 'none'}
      fill={`url(#color-${dataKey[1]})`}
      strokeWidth={3}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[2]}
      stroke={stroke ? stroke[2] : 'none'}
      fill={`url(#color-${dataKey[2]})`}
      strokeWidth={3}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[3]}
      stroke={stroke ? stroke[3] : 'none'}
      fill={`url(#color-${dataKey[3]})`}
      strokeWidth={3}
      fillOpacity={1}
      stackId="1"
    />
    <Area
      dataKey={dataKey[4]}
      stroke={stroke ? stroke[4] : 'none'}
      fill={`url(#color-${dataKey[4]})`}
      strokeWidth={3}
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
  simple = undefined,
  hideYAxis = undefined,
  hideXAxis = undefined,
  reversed = true,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (
    type,
    isExpanded,
    hideYAxis = undefined,
    hideXAxis = undefined,
  ) => {
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
        hideYAxis,
        hideXAxis,
        reversed,
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
        hideYAxis,
        hideXAxis,
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
    <div className="flex justify-center items-center w-full min-h-[300px]">
      <LogoSpinner width={48} height={48} />
    </div>
  ) : simple ? (
    <div className="w-full h-full text-text space-y-4">
      <div>
        <div className="flex justify-between items-center w-full overflow-hidden">
          <div className="flex justify-end w-full pr-4 pt-4">
            <ArrowsExpandIcon
              className="w-4 h-4 cursor-pointer"
              onClick={handleOpen}
            />
          </div>
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
      </div>
      <div className="w-full min-w-[232px] min-h-[195px] rounded-20">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false, hideYAxis, hideXAxis)}
          </ResponsiveContainer>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-full text-text space-y-4">
      <div className="p-4">
        <div className="flex justify-between items-center w-full overflow-hidden">
          <div className="flex items-center w-[90%] space-x-1">
            <div className="text-sm">{headerText}</div>
            <Question text={infoTooltipMessage} />
          </div>
          {/* could make this svgbutton */}

          <ArrowsExpandIcon
            className="w-4 h-4 cursor-pointer"
            onClick={handleOpen}
          />
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
          <Skeleton width="50px" count={1} />
        ) : (
          <div className="flex space-x-1 items-center">
            <div className="text-primary font-bold">{headerSubText}</div>
          </div>
        )}
      </div>
      <div className="w-full min-w-[310px] min-h-[260px] rounded-20">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false, hideYAxis, hideXAxis)}
          </ResponsiveContainer>
        ) : (
          <Skeleton count={1} />
        )}
      </div>
    </div>
  );
}

export default Rechart;
