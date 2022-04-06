import React, { FC, useCallback, useState } from 'react';
import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from '@heroicons/react/solid';
import { Tooltip } from '../Tooltip';
import { classNames } from '../../functions';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

export const Question: FC<{
  text: any;
  className?: string;
  disableShow?: boolean;
}> = ({ children, text, className, disableShow }) => {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  if (children) {
    return (
      <Tooltip text={text} show={!disableShow && show}>
        <div
          className="flex items-center justify-center outline-none"
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {children}
        </div>
      </Tooltip>
    );
  }

  return (
    <span className={classNames('flex items-center justify-center', className)}>
      <Tooltip text={text} show={!disableShow && show}>
        <div
          className="flex items-center justify-center outline-none cursor-help"
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <ExclamationCircleIcon className="w-4 h-4" />
        </div>
      </Tooltip>
    </span>
  );
};
