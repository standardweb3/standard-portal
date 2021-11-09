import { usePendingXStnd } from '../../features/stake/hooks';
import { classNames, formatNumber } from '../../functions';
import { useStnd } from '../../hooks/Tokens';
import { DefinedStyles } from '../../utils/DefinedStyles';
import { Button } from '../Button';
import { CurrencyLogo } from '../CurrencyLogo';

export function XStndClaimer({ className }) {
  const pendingXStnd = usePendingXStnd();
  const stnd = useStnd();

  return (
    <div
      className={classNames(
        'bg-opaque rounded-20 p-5 grid grid-cols-8 lg:grid-cols-7',
        className,
      )}
    >
      <div className="flex items-center space-x-4 col-span-2 font-bold text-xl">
        <div>Claimable</div>
      </div>
      <div className="flex items-center space-x-4 col-span-2">
        <div>
          <div className="text-sm">YourShare:</div>
          <div className="text-lg text-green font-bold">
            {formatNumber(pendingXStnd?.toExact() ?? 0)}{' '}
            <span className="text-base !font-normal">xSTND</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 col-span-2">
        <div>
          <div className="text-sm">Reward Value:</div>
          <div className="text-lg text-green font-bold">
            {formatNumber(pendingXStnd?.toExact() ?? 0)}{' '}
            <span className="text-base !font-normal"></span>
          </div>
        </div>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Button className={classNames(DefinedStyles.fullButton, 'w-50')}>
          Claim
        </Button>
      </div>
    </div>
  );
}
