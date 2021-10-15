import React from 'react';
import FarmListItemV2 from './FarmListItemV2';

const FarmListV2 = ({ farms }) => {
  return farms ? (
    <>
      <div className="grid grid-cols-12 lg:grid-cols-12 text-base text-grey px-4">
        <div
          className="
          flex items-center col-span-3
          lg:col-span-3 px-4 space-x-2
          cursor-pointer 
          text-xs
          sm:text-base"
        >
          <div>Pair</div>
        </div>

        <div
          className="
          flex items-center justify-start 
          text-xs
          sm:text-base
          col-span-3 lg:col-span-3 "
        >
          Rewards (per block)
        </div>
        <div
          className="
          flex items-center justify-start 
          text-xs
          sm:text-base
          col-span-3 lg:col-span-3 cursor-pointer"
        >
          Staked
        </div>
        <div
          className="
          flex items-center justify-start 
          text-xs
          sm:text-base
          col-span-3 lg:col-span-3 cursor-pointer"
        >
          TVL
        </div>
      </div>
      <div className="flex-col space-y-4">
        {farms.map((farm) => (
          <FarmListItemV2 key={farm.address} farm={farm} />
        ))}
      </div>
    </>
  ) : (
    <div className="w-full py-6 text-center">
      <span>No Results.</span>
    </div>
  );
};

export default FarmListV2;
