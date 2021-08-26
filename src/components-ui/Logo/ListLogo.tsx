import React from 'react';
import useHttpLocations from '../../hooks/useHttpLocations';
import { SequentialLogo } from './SequentialLogo';

export function ListLogo({
  logoURI,
  style,
  size = '24px',
  alt,
}: {
  logoURI: string;
  size?: string;
  style?: React.CSSProperties;
  alt?: string;
}) {
  const srcs: string[] = useHttpLocations(logoURI);

  return (
    <SequentialLogo
      alt={alt}
      width={size}
      height={size}
      srcs={srcs}
      style={style}
    />
  );
}
