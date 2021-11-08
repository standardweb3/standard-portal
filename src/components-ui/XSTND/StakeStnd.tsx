import { STND_ADDRESS, Token } from '@digitalnative/standard-protocol-sdk';
import { useState } from 'react';
import { useActiveWeb3React } from '../../hooks';
import { useStnd } from '../../hooks/Tokens';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Button } from '../Button';
import { TokenInputPanel } from './TokenInputPanel';

export function StakeStnd() {
  const [stakeAmount, setStakeAmount] = useState('0');
  const stnd = useStnd();

  return (
    <div>
      <TokenInputPanel
        token={stnd}
        showMax
        onAmountChange={setStakeAmount}
        className="
            rounded-20 py-3 px-4
            bg-opaque
            text-text
        "
        inputClassName="
            !text-base
            !font-normal
        "
      />
      <Button className={DefinedStyles.fullButton}>Stake</Button>
    </div>
  );
}
