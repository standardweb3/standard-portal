import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';

export type DropdownOption = {
  key: string;
  value: any;
  onSelect: () => void;
};
export function Dropdown({
  selected,
  options,
  hideChevron = undefined,
}: {
  selected: string;
  options: DropdownOption[];
  hideChevron?: boolean;
}) {
  const selectedOption = options.filter((o) => o.key === selected)[0];
  return (
    <Listbox value={selectedOption.value} onChange={() => {}}>
      <div className="flex justify-center">
        <Listbox.Button
          className="
            font-bold
            text-sm
            rounded-lg
            relative
            flex items-center
            bg-dark-3
            space-x-2
            py-[0.325rem] px-4
            flex justify-between space-x-4"
        >
          <div>{selectedOption.value}</div>
          {!hideChevron && (
            <div className="flex items-center pointer-events-none">
              <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
            </div>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="
            border
            border-border
            text-sm
            py-2
            px-4
            translate-y-[62px]
            absolute
            z-40
            overflow-auto 
            text-base bg-dark-3
            rounded-lg
            focus:outline-none
            "
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `select-none relative cursor-pointer py-1 px-2`
                }
                value={option.key}
              >
                {({ selected, active }) => (
                  <div
                    className="flex items-center space-x-3"
                    onClick={option.onSelect}
                  >
                    {option.value}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
