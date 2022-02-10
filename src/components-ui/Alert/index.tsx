import React, { useState } from 'react';

import { XIcon } from '@heroicons/react/solid';
import { classNames } from '../../functions';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const infoClassName = 'bg-grey bg-opacity-10 text-text text-opacity-75';

const TYPE = {
  information: {
    typeClassName: infoClassName,
    icon: (
      <svg
        width="33"
        height="33"
        className="text-info"
        viewBox="0 0 33 33"
        xmlns="http://www.w3.org/2000/svg"
        path="currentColor"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M16.5 0C7.40184 0 0 7.40184 0 16.5C0 25.5982 7.40184 33 16.5 33C25.5982 33 33 25.5982 33 16.5C33 7.40184 25.5982 0 16.5 0ZM16.5 25.9909C15.5747 25.9909 14.8245 25.2407 14.8245 24.3154C14.8245 23.39 15.5747 22.6398 16.5 22.6398C17.4253 22.6398 18.1755 23.39 18.1755 24.3154C18.1755 25.2407 17.4253 25.9909 16.5 25.9909ZM18.1755 17.3898C18.1755 18.3152 17.4253 19.0654 16.5 19.0654C15.5747 19.0654 14.8245 18.3152 14.8245 17.3898V8.56534C14.8245 7.63999 15.5747 6.8898 16.5 6.8898C17.4253 6.8898 18.1755 7.63999 18.1755 8.56534V17.3898Z"
          fill="#575757"
        />
      </svg>
    ),
  },
  warning: {
    typeClassName: 'bg-black bg-opacity-50',
    icon: <ExclamationCircleIcon className="text-warn w-4 h-4" />,
  },
  error: {
    typeClassName: 'bg-alert-error backdrop-blur-2xl bg-opacity-25',
    icon: <ExclamationCircleIcon className="text-danger w-4 h-4" />,
  },
  'bordered-primary': {
    typeClassName:
      'bg-transparent rounded-20 border border-primary text-primary',
    icon: <ExclamationCircleIcon className="text-primary w-8 h-8" />,
  },
};

export interface AlertProps {
  title?: string;
  message?: string | React.ReactChild | React.ReactChild[];
  type?: 'warning' | 'error' | 'information' | 'bordered-primary';
  showIcon?: boolean;
  dismissable?: boolean;
}

export function Alert({
  title,
  message,
  type = 'warning',
  className = '',
  showIcon = false,
  dismissable = true,
}: AlertProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  // TODO: Persist this...
  const [show, setShow] = useState(true);
  const { typeClassName, icon } = TYPE[type];
  return message && show ? (
    <div
      className={classNames(
        'flex relative w-full rounded-lg text-sm p-5',
        typeClassName,
        className,
      )}
    >
      <div className="flex flex-1 flex-col">
        {title && <div className="mb-3 text-2xl font-bold">{title}</div>}
        <div className="flex items-center">
          {showIcon && <div className="flex-shrink-0">{icon}</div>}
          <div className={!showIcon ? 'w-full ml-0' : 'w-full ml-3'}>
            {typeof message === 'string' ? (
              <p className="text-base">{message}</p>
            ) : (
              <div className="text-base">{message}</div>
            )}
          </div>
        </div>
      </div>
      {dismissable && (
        <div className="top-2 right-2">
          <button
            type="button"
            onClick={() => setShow(!show)}
            className={`
            inline-flex 
            opacity-80 
            hover:opacity-100 
            focused:opacity-100 
            rounded p-1.5 
            text-primary`}
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  ) : null;
}
