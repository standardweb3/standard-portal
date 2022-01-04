import { Button } from '../../../components-ui/Button';
import { DefinedStyles } from '../../../utils/DefinedStyles';

export function ConfirmCollateralizeButton({ disabled, message, onClick }) {
  return (
    <div className="w-full">
      <Button
        disabled={disabled}
        className={DefinedStyles.fullButton}
        onClick={onClick}
      >
        {message}
      </Button>
    </div>
  );
}
