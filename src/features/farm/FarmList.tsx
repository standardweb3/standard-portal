import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

import FarmListItem from './FarmListItem';
import React from 'react';
import useSortableData from '../../hooks/useSortableData';
import { useSizeXs } from '../../components-ui/Responsive';

const FarmList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms);
  const isViewportXs = useSizeXs();

  return items ? (
    <>
      <div className="grid grid-cols-11 lg:grid-cols-11 text-base text-grey px-4">
        <div
          className="
          flex items-center col-span-3
          lg:col-span-3 px-4 space-x-2
          cursor-pointer 
          text-xs
          sm:text-base"
          onClick={() => requestSort('symbol')}
        >
          <div>Pair</div>
          {sortConfig &&
            sortConfig.key === 'symbol' &&
            ((sortConfig.direction === 'ascending' && (
              <ChevronUpIcon width={12} height={12} />
            )) ||
              (sortConfig.direction === 'descending' && (
                <ChevronDownIcon width={12} height={12} />
              )))}
        </div>

        <div
          className="
          flex items-center justify-start 
          text-xs
          sm:text-base
          col-span-3 lg:col-span-3 "
        >
          Rewards (daily)
        </div>
        <div
          className="
          flex items-center justify-start 
          text-xs
          sm:text-base
          col-span-3 lg:col-span-2 cursor-pointer"
          onClick={() => requestSort('roiPerYear')}
        >
          APR{isViewportXs && ' (yearly)'}
          {sortConfig &&
            sortConfig.key === 'roiPerYear' &&
            ((sortConfig.direction === 'ascending' && (
              <ChevronUpIcon width={12} height={12} />
            )) ||
              (sortConfig.direction === 'descending' && (
                <ChevronDownIcon width={12} height={12} />
              )))}
        </div>
        <div
          className="
          flex items-center justify-start 
          text-xs
          sm:text-base
          col-span-2
          lg:col-span-3 
          cursor-pointer"
          onClick={() => requestSort('tvl')}
        >
          TVL
          {sortConfig &&
            sortConfig.key === 'tvl' &&
            ((sortConfig.direction === 'ascending' && (
              <ChevronUpIcon width={12} height={12} />
            )) ||
              (sortConfig.direction === 'descending' && (
                <ChevronDownIcon width={12} height={12} />
              )))}
        </div>
      </div>
      <div className="flex-col space-y-4">
        {items.map((farm) => (
          <FarmListItem key={farm.pair.id} farm={farm} />
        ))}
      </div>
    </>
  ) : (
    <div className="w-full py-6 text-center">
      {term ? <span>No Results.</span> : 'Loading'}
    </div>
  );
};

export default FarmList;
