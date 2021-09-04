import { ReactNode } from 'react';
import styled from '@emotion/styled';

export type PageProps = {
  children: ReactNode;
  id?: string;
};

export function Page({ children, id }: PageProps) {
  return (
    <div
      id={id}
      className={`
    bg-main-background
    relative
    flex flex-col
    justify-start
    overflow-hidden
    text-text
    w-full h-full`}
    >
      <Cone1 />
      <Cone2 />
      <Cone3 />
      {children}
    </div>
  );
}

const Cone1 = styled.div`
  position: absolute;
  width: 308.46px;
  height: 326.36px;
  right: 0px;
  top: 104.04px;
  z-index: 0;

  background: conic-gradient(
    from 161.21deg at 34.58% 54.69%,
    #6143bc -72.28deg,
    #ff009c 2.21deg,
    #6143bc 287.72deg,
    #ff009c 362.21deg
  );
  filter: blur(180px);
  transform: rotate(-29.96deg);
`;

const Cone2 = styled.div`
  position: absolute;
  width: 428.56px;
  height: 909.75px;
  right: 25%;
  top: 25%;
  z-index: 0;

  background: linear-gradient(347.31deg, #ff009c -22.31%, #439fbc 92.99%);
  opacity: 0.3;
  filter: blur(240px);
  transform: rotate(-75deg);
`;

const Cone3 = styled.div`
  position: absolute;
  width: 627.65px;
  height: 532.84px;
  left: 0;
  top: 20%;
  z-index: 0;

  background: conic-gradient(
    from 161.21deg at 34.58% 54.69%,
    #6143bc -72.28deg,
    #ff009c 2.21deg,
    #6143bc 287.72deg,
    #ff009c 362.21deg
  );
  opacity: 0.3;
  filter: blur(180px);
  transform: rotate(-29.96deg);
`;

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
