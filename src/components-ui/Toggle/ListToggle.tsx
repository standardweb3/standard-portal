import React from 'react';

export interface ToggleProps {
  id?: string;
  isActive: boolean;
  bgColor: string;
}

export function ListToggle({ id, isActive, bgColor }: ToggleProps) {
  return (
    <div
      id={id}
      className={`rounded-full w-5 h-5 ${
        !isActive ? 'bg-danger' : 'bg-success'
      }`}
    />
  );
}
