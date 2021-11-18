import { useCallback, useState } from 'react';
import { classNames, formatPercent } from '../../functions';
import Image from '../Image';
import { Question } from '../Question';
import ArbitrageToggle from './ArbitrageToggle';

export type ArbitrageTypes = {
  outbound: boolean;
  setOutbound: (outbound: boolean) => void;
  ctod?: number;
  dtoc?: number;
};

const ngmi =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/trade/ngmi.png';
const wgmi =
  'https://raw.githubusercontent.com/digitalnativeinc/icons/master/trade/wgmi.png';

export function Arbitrage({
  outbound,
  setOutbound,
  ctod,
  dtoc,
}: ArbitrageTypes) {
  const ctodRate = ctod ? ctod - 1 : 0;
  const dtoCRate = dtoc ? dtoc - 1 : 0;
  // const [toCex, setToCex] = useState(outbound);
  // console.log('toCex', toCex);
  //
  const rate = (outbound ? dtoCRate : ctodRate) * 100;
  const isWgmi = rate / 100 >= 0;

  const changeDirection = useCallback(() => {
    setOutbound(!outbound);
  }, [outbound, setOutbound]);

  return (
    <div>
      <div className="space-y-2">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div>Arbitrage</div>

            <Question
              text={
                <div>
                  Standard Protocol spots arbitrage opportunities for the users
                  <br />
                  <strong>{'DEX->CEX'}:</strong> Buy here and sell at CEX
                  <br />
                  <strong>{'CEX->DEX'}:</strong> Buy at CEX and sell here
                </div>
              }
            />
          </div>
          <ArbitrageToggle dtoc={outbound} toggle={changeDirection} />
        </div>
        <div
          className={classNames(
            isWgmi ? 'text-green' : 'text-red',
            'flex items-center justify-between',
          )}
        >
          <div
            className={classNames(
              isWgmi ? 'border-green' : 'border-red',
              'border border-2 px-2 py-1 rounded-20 flex items-center space-x-2',
            )}
          >
            <div
              className={classNames(
                isWgmi ? 'bg-green' : 'bg-red',
                'w-3 h-3 rounded-full shadow-arbitrage',
              )}
            ></div>
            <div>{isWgmi ? 'WGMI' : 'NGMI'}</div>
          </div>
          <div className="text-3xl font-bold">{formatPercent(rate)}</div>
          <div>
            <Image
              layout="fixed"
              width="44px"
              height="44px"
              src={isWgmi ? wgmi : ngmi}
              alt="STND logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
