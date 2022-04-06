import Image from 'next/image';
import logoLight from '../../../public/img/logos/logo.light.png';
import logoDark from '../../../public/img/logos/logo.dark.png';
import logoShortLight from '../../../public/img/logos/logo.primary.png';
import logoShortDark from '../../../public/img/logos/logo.primary.png';

export const LogosType = {
  light: {
    src: logoLight,
    alt: 'Logo for Light Theme',
  },
  dark: {
    src: logoDark,
    alt: 'Logo for Dark Theme',
  },
};

export const LogosShortType = {
  light: {
    src: logoShortLight,
    alt: 'Short Logo for Light Theme',
  },
  dark: {
    src: logoShortDark,
    alt: 'Short Logo for Dark Theme',
  },
};

export type LogoProps = {
  theme?: 'light' | 'dark';
  short?: boolean;
  width?: string;
  height?: string;
};

export function Logo({ theme = 'dark', short, width, height }: LogoProps) {
  const { src, alt } = short ? LogosShortType[theme] : LogosType[theme];
  return (
    <Image
      width={width}
      height={height}
      src={src}
      alt={alt}
      layout="intrinsic"
    />
  );
}
