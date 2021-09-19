import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

import FarmListItem from './FarmListItem';
import React from 'react';
import useSortableData from '../../hooks/useSortableData';

const FarmList = ({ farms, term }) => {
  const { items, requestSort, sortConfig } = useSortableData(farms);
  return items ? (
    <>
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-11 text-base text-grey">
        <div
          className="flex items-center col-span-3 cursor-pointer lg:col-span-3 px-4 space-x-2"
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

        <div className="items-center justify-start col-span-3 hidden lg:flex">
          Rewards
        </div>
        <div
          className="flex items-center justify-start col-span-3 cursor-pointer"
          onClick={() => requestSort('roiPerYear')}
        >
          APR
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
          col-span-2 hidden md:flex
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
        {items.map((farm, index) => (
          <FarmListItem key={index} farm={farm} />
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
