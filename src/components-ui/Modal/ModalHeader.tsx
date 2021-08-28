import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline';
import { classNames } from '../../functions';
import { Typographies } from '../../utils/Typography';

export type ModalHeaderProps = {
  title?: string;
  className?: string;
  onClose?: () => void;
  onBack?: () => void;
};

export function ModalHeader({
  title,
  className,
  onClose,
  onBack,
}: ModalHeaderProps) {
  return (
    <div className={classNames(`flex items-center justify-between`, className)}>
      {onBack && (
        <div onClick={onBack}>
          <ArrowLeftIcon className="w-5 h-5" />
        </div>
      )}
      {title && <div className={Typographies.modalHeader}>{title}</div>}
      {onClose && (
        <div onClick={onClose}>
          <XIcon className="w-6 h-6 cursor-pointer" />
        </div>
      )}
    </div>
  );
}
