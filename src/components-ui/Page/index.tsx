import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { classNames } from '../../functions';

export type PageProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export function Page({ children, id, className }: PageProps) {
  return (
    <div
      id={id}
      className={classNames(
        `
    relative
    flex flex-col
    justify-start
    overflow-auto
    text-text
    w-full`,
        className,
      )}
    >
      {children}
    </div>
  );
}
// const Cone4 = styled.div`
//   position: absolute;
//   width: 399.14px;
//   height: 847.31px;
//   left: 0;
//   top: 0;

//   background: linear-gradient(347.31deg, #ff009c -22.31%, #439fbc 92.99%);
//   opacity: 0.3;
//   filter: blur(180px);
//   transform: rotate(-75deg);
// `;
