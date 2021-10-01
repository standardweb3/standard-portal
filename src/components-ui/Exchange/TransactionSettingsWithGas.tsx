import { ChainId, Percent } from '@digitalnative/standard-protocol-sdk-test';
import { useActiveWeb3React } from '../../hooks';
import { default as GasIcon } from '../../../public/icons/outlined/Gas.svg';
import { Gas } from '../Gas';
import Settings from '../Settings';

interface TransactionSettingsWithGasProps {
  allowedSlippage?: Percent;
}

export function TransactionSettingsWithGas({
  allowedSlippage,
}: TransactionSettingsWithGasProps) {
  const { chainId } = useActiveWeb3React();

  return (
    <div className="grid grid-flow-col gap-1">
      {chainId === ChainId.MAINNET && (
        <div className="flex items-center text-green space-x-2 font-semibold">
          <GasIcon className="fill-current stroke-current text-green" />
          <Gas className="text-base opacity-60" />
        </div>
      )}
      <div className="relative w-full h-full rounded flex items-center">
        <Settings placeholderSlippage={allowedSlippage} />
      </div>
    </div>
  );
}
