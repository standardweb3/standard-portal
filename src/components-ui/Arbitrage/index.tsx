import { useCallback, useState } from 'react';
import ArbitrageToggle from './ArbitrageToggle';

export type ArbitrageTypes = {
  outbound: boolean;
  ctod: number;
  dtoc: number;
};

export function Arbitrage({ outbound, ctod, dtoc }: ArbitrageTypes) {
  const ctodRate = ctod - 1;
  const dtoCRate = dtoc - 1;
  const [toCex, setToCex] = useState(outbound);

  const changeDirection = useCallback(() => {
    setToCex(!toCex);
  }, [setToCex, toCex]);

  return (
    <div>
      Arbitrage
      <ArbitrageToggle isActive={toCex} toggle={changeDirection} />
    </div>
  );
}
