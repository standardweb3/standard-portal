import React, { FC, useState } from 'react';

import { Image } from '../Image';
import { classNames } from '../../functions';
import { cloudinaryLoader } from '../../functions/cloudinary';

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export type SequentialLogoProps = {
  srcs: string[];
  width: string | number;
  height: string | number;
  alt?: string;
  className?: string;
};

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export const SequentialLogo: FC<SequentialLogoProps> = ({
  srcs,
  width,
  height,
  alt = '',
  className,
  ...rest
}) => {
  const [, refresh] = useState<number>(0);
  const src = srcs.find((src) => !BAD_SRCS[src]);
  return (
    <div style={{ width, height }}>
      <Image
        src={
          src ||
          'https://raw.githubusercontent.com/sushiswap/icons/master/token/unknown.png'
        }
        loader={cloudinaryLoader}
        unoptimized
        onError={() => {
          if (src) BAD_SRCS[src] = true;
          refresh((i) => i + 1);
        }}
        width={width}
        height={height}
        alt={alt}
        layout="fixed"
        className={classNames(className)}
        {...rest}
      />
    </div>
  );
};
