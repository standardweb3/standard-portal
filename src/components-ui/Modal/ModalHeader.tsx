import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline';
import { classNames } from '../../functions';
import { Typographies } from '../../utils/Typography';

export type ModalHeaderProps = {
  title?: React.ReactNode;
  className?: string;
  xIconClassName?: string;
  onClose?: () => void;
  onBack?: () => void;
};

export function ModalHeader({
  title,
  className,
  xIconClassName,
  onClose,
  onBack,
}: ModalHeaderProps) {
  return (
    <div
      className={classNames(
        `flex w-full items-center justify-between`,
        className,
      )}
    >
      {onBack && (
        <div onClick={onBack}>
          <ArrowLeftIcon className="w-5 h-5" />
        </div>
      )}
      {title && (
        <div className={`${Typographies.modalHeader} text-sm`}>{title}</div>
      )}
      {onClose && (
        <div onClick={onClose} className="justify-self-end">
          <XIcon
            className={classNames('w-4 h-4 cursor-pointer', xIconClassName)}
          />
        </div>
      )}
    </div>
  );
}
