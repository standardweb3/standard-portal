import Image from 'next/image';
import React from 'react';
import styled from '@emotion/styled';

const SubHeader = styled.div`
  margin-top: 10px;
  font-size: 12px;
`;

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  col,
  id,
  disabled = false,
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  icon: string;
  active?: boolean;
  col?: boolean;
  id: string;
  disabled?: boolean;
}) {
  const content = (
    <div
      onClick={() => !disabled && onClick()}
      className={`
        flex ${col ? 'flex-col space-y-2' : 'flex-row space-x-4'}
        items-center
        w-full 
        p-3 rounded-xl 
        cursor-pointer 
        backdrop-filter
        backdrop-blur-sm
        ${
          !active
            ? 'bg-background-modal-inner '
            : 'bg-background border border-green'
        }
        ${!active ? 'hover:bg-green' : ''}
        transition duration-500
        `}
    >
      <Image src={icon} alt={'wallet icon'} width="32px" height="32px" />

      <div>
        <div className="flex items-center text-sm text-center">
          {active && (
            <div
              className="w-4 h-4 mr-4 rounded-full"
              style={{ background: color }}
            />
          )}
          {header}
        </div>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </div>
    </div>
  );
  if (link) {
    return <a href={link}>{content}</a>;
  }

  return content;
}
