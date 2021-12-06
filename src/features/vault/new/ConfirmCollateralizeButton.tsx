import { Button } from '../../../components-ui/Button';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function ConfirmCollateralizeButton({ disabled, message }) {
  return (
    <div>
      <Button disabled={disabled} className={DefinedStyles.fullButton}>
        {message}
      </Button>
    </div>
  );
}
