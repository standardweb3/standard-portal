import Image from 'next/image';
import logoLight from '../../../public/img/logos/logo.light.png';
import logoDark from '../../../public/img/logos/logo.dark.primary.png';

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

export type LogoProps = {
  theme?: 'light' | 'dark';
};

export function Logo({ theme = 'dark' }: LogoProps) {
  const { src, alt } = LogosType[theme];
  return <Image src={src} alt={alt} layout="intrinsic" />;
}
