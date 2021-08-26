import React, { FC, useCallback } from 'react';
import { isAddress } from '../../functions';
import useENS from '../../hooks/useENS';

interface AddressInputPanelProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}

export const AddressInputPanel: FC<AddressInputPanelProps> = ({
  id,
  value,
  onChange,
}) => {
  const { address, loading } = useENS(value);

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, '');
      onChange(withoutSpaces);
    },
    [onChange],
  );

  const error = Boolean(value.length > 0 && !loading && !address);

  return (
    <div
      className={`
        flex flex-row 
        rounded-xl
        items-center h-[64px] ${
          error ? 'text-danger' : address ? 'text-success' : ''
        }`}
      id={id}
    >
      <div
        className={`
        flex justify-between 
        w-full
        text-sm`}
      >
        {`Recipient:`}
      </div>
      <div
        className={`
        flex w-full h-full
        `}
      >
        <input
          className={`
            p-3 
            h-full w-full  
            flex
            overflow-ellipsis 
            font-bold 
            bg-transparent
            rounded-xl 
            placeholder-info
            focus:placeholder-text`}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Wallet Address or ENS name"
          pattern="^(0x[a-fA-F0-9]{40})$"
          onChange={handleInput}
          value={value}
        />
      </div>
    </div>
  );
};
