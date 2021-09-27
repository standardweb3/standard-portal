import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { classNames } from '../../functions';
import { ViewportSmallDown } from '../Responsive';
import { StndAdder } from '../TokenAdder/StndAdder';

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

      <ViewportSmallDown>
        <div className="fixed right-0 bottom-0 justify-center mb-6 px-8">
          <StndAdder />
        </div>
      </ViewportSmallDown>
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
