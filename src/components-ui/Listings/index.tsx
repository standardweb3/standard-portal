import React from 'react';
import { classNames } from '../../functions';
// import Image from '../Image';
import kucoin from '../../../public/img/listings/kucoin.svg';
import gate from '../../../public/img/listings/gate.svg';
import coinone from '../../../public/img/listings/coinone.svg';

import { ExternalLink } from '../ExternalLink';

export function Listings() {
  const LISTINGS = [
    { alt: 'kucoin', src: kucoin, url: 'https://trade.kucoin.com/STND-USDT' },

    { alt: 'gate', src: gate, url: 'https://www.gate.io/trade/stnd_usdt' },
    {
      alt: 'coinone',
      src: coinone,
      url: 'https://coinone.co.kr/exchange/trade/stnd/krw',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs text-grey">Available on</div>
      <div className="w-full flex space-x-4 items-center">
        {LISTINGS.map((social) => {
          return (
            <div className="col-span-1 text-grey flex items-center justify-center">
              <ExternalLink href={social.url} className="!text-grey">
                {React.createElement(social.src, {
                  className: classNames(
                    'stroke-current fill-current',
                    // route.name !== 'Dividend' && 'stroke-1',
                  ),
                })}
              </ExternalLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
