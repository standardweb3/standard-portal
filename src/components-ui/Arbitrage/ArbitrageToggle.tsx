import React from 'react';
import { Switch } from '@headlessui/react';
import { classNames } from '../../functions';

export interface ToggleProps {
  id?: string;
  dtoc: boolean;
  toggle: () => void;
  disabled?: boolean;
}

export default function ArbitrageToggle({
  id,
  disabled,
  dtoc,
  // isActive,
  toggle,
}: ToggleProps) {
  const style = 'px-2 py-2 cursor-pointer';
  const activeStyle =
    'border-2 border-primary font-bold text-primary rounded-20';
  return (
    <div className="bg-background-2 flex items-center rounded-20 text-xs text-grey">
      <div className={classNames(style, dtoc && activeStyle)} onClick={toggle}>
        DEX {'>'} CEX
      </div>
      <div className={classNames(style, !dtoc && activeStyle)} onClick={toggle}>
        CEX {'>'} DEX
      </div>
    </div>
    // <Switch
    //   disabled={disabled}
    //   checked={isActive}
    //   onChange={toggle}
    //   className={classNames(
    //     'bg-background-2',
    //     `relative inline-flex
    //      h-6
    //     border-2 border-transparent
    //     rounded-full
    //     cursor-pointer
    //     transition-colors ease-in-out duration-200 focus:outline-none`,
    //   )}
    // >
    //   <span className="sr-only">Use setting</span>
    //   <span
    //     className={classNames(
    //       isActive
    //         ? 'translate-x-5 border-primary'
    //         : 'translate-x-0 border-white',
    //       `bg-opaque
    //       border
    //       pointer-events-none relative inline-block
    //        h-5
    //        rounded-full
    //        shadow
    //        flex items-center justify-center
    //       transition ease-in-out duration-200`,
    //     )}
    //   >
    //     Cex -> Dex
    //   </span>
    // </Switch>
  );
}
