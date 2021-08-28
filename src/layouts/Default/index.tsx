import { Sidebar } from '../../components-ui/Sidebar';
import Main from './Main';

const Layout = ({ children }) => {
  return (
    <div
      className={`
      flex items-center
      w-full h-full
      `}
    >
      <Sidebar />
      <Main>{children}</Main>
    </div>
  );
};

export default Layout;
