import {
  ViewportMediumUp,
  ViewportSmallDown,
} from '../../components-ui/Responsive';
import { Sidebar } from '../../components-ui/Sidebar';
import { TopBar } from '../../components-ui/TopBar';
import { isMobile } from 'react-device-detect';
import Main from './Main';

import styled from '@emotion/styled';

const Layout = ({ children }) => {
  return (
    <div
      className={`
      bg-background-main
      relative
      overflow-hidden
      w-full h-full
      z-0
      mobile-pad
      `}
    >
      {isMobile && (
        <style jsx>
          {`
            .mobile-pad {
              padding: env(safe-area-inset-top, 20px)
                env(safe-area-inset-right, 0px)
                env(safe-area-inset-bottom, 20px) env(safe-area-inset-left, 0px);
            }
          `}
        </style>
      )}
      <div
        className="z-[1] w-full h-full 
        overflow-auto
      flex flex-col md:flex-row"
      >
        <ViewportSmallDown>
          <TopBar />
        </ViewportSmallDown>
        <ViewportMediumUp>
          <Sidebar />
        </ViewportMediumUp>
        <Main>{children}</Main>
      </div>

      {!isMobile && <Cone1 />}
      {!isMobile && <Cone3 />}
    </div>
  );
};

const Cone1 = styled.div`
  position: absolute;
  width: 308.46px;
  height: 326.36px;
  right: 0px;
  top: 0%;
  z-index: -1;

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
  z-index: -1;

  background: linear-gradient(347.31deg, #ff009c -22.31%, #439fbc 92.99%);
  // opacity: 0.3;
  filter: blur(240px);
  transform: rotate(-75deg);
`;

const Cone3 = styled.div`
  position: absolute;
  width: 627.65px;
  height: 532.84px;
  right: -0%;
  bottom: -20%;
  z-index: -1;

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

export default Layout;
