import React, { ReactNode } from 'react';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import { PencilIcon, CheckIcon } from '@heroicons/react/outline';
import { classNames } from '../../functions';
import { Typographies } from '../../utils/Typography';

interface CopierProps {
  className?: string;
  toCopy: string;
  children?: ReactNode;
  iconSize?: number;
}

export function Copier({ className, toCopy, children }: CopierProps) {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <div
      className={classNames(
        'flex items-center flex-shrink-0',
        'space-x-1',
        'whitespace-nowrap',
        'text-link hover:brightness-125',
        'cursor-pointer',
        className,
      )}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied && (
        <>
          <CheckIcon className="w-4 h-4" />
          <div className={Typographies.copierCopied}>Copied</div>
        </>
      )}

      {!isCopied && (
        <>
          <PencilIcon className="w-4 h-4" />
          {children}
        </>
      )}
    </div>
  );
}

export default Copier;
