import { HTMLProps, ReactNode, useCallback } from 'react';
import ReactGA from 'react-ga';
import { classNames } from '../../functions';

export type ExternalLinkProps = Omit<
  HTMLProps<HTMLAnchorElement>,
  'as' | 'ref' | 'onClick'
> & {
  href: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

const COLOR: { [key: string]: string } = {
  primary: 'text-primary hover:brightness-125',
  link: 'text-link hover:brightness-125',
};

export function ExternalLink({
  target = '_blank',
  children,
  className,
  color = 'primary',
  rel = 'noopener noreferrer',
  href,
  startIcon,
  endIcon,
  ...rest
}: ExternalLinkProps) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          console.debug('Outbound Link', href);
        });
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href;
        });
      }
    },
    [href, target],
  );

  return (
    <a
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      className={classNames(
        'text-baseline whitespace-nowrap',
        COLOR[color],
        (startIcon || endIcon) && 'space-x-1 flex items-center justify-center',
        className,
      )}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </a>
  );
}
