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
        'bg-opaque rounded-20 p-5 flex flex-col justify-between',
        className,
      )}
    >
      <div className="flex items-center space-x-4">
        <CurrencyLogo currency={stnd} className="rounded-full" size={60} />
        <div>
          <div className="text-sm">Claimable:</div>
          <div className="text-4xl text-green font-bold">
            {formatNumber(pendingXStnd?.toExact() ?? 0)}{' '}
            <span className="text-base !font-normal">xSTND</span>
          </div>
        </div>
      </div>
      <Button className={classNames(DefinedStyles.fullButton, 'mt-4')}>
        Claim
      </Button>
    </div>
  );
}
