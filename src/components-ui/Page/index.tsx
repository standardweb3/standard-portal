import { ReactNode } from 'react';
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
    text-text
    w-full`,
        className,
      )}
    >
      {children}
      {/* 
      <ViewportSmallDown>
        <div className="fixed flex w-full justify-between right-0 bottom-0 items-center mb-6 px-4 sm:px-8 space-x-4">
          <ConnectionStatus className="!rounded-20" />
          <StndAdder />
        </div>
      </ViewportSmallDown> */}
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
