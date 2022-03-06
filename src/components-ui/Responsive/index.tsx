import { useMediaQuery } from 'react-responsive';

export const useSizeXs = () => useMediaQuery({ maxWidth: 639 });

export const useSizeSm = () => useMediaQuery({ minWidth: 640, maxWidth: 907 });
export const useSizeSmUp = () => useMediaQuery({ minWidth: 640 });
export const useSizeSmDown = () => useMediaQuery({ maxWidth: 907 });

export const useSizeMd = () => useMediaQuery({ minWidth: 908, maxWidth: 1155 });
export const useSizeMdUp = () => useMediaQuery({ minWidth: 908 });
export const useSizeMdDown = () => useMediaQuery({ maxWidth: 1155 });

export const useSizeLg = () =>
  useMediaQuery({ minWidth: 1156, maxWidth: 1279 });
export const useSizeLgUp = () => useMediaQuery({ minWidth: 1156 });
export const useSizeLgDown = () => useMediaQuery({ maxWidth: 1279 });

export const useSizeXl = () =>
  useMediaQuery({ minWidth: 1280, maxWidth: 1535 });
export const useSizeXlUp = () => useMediaQuery({ minWidth: 1280 });
export const useSizeXlDown = () => useMediaQuery({ maxWidth: 1535 });

export const useSize2Xl = () => useMediaQuery({ minWidth: 1536 });

export const ViewportXSmall = ({ children }) => {
  const render = useSizeXs();

  return render ? children : null;
};

export const ViewportSmall = ({ children }) => {
  const render = useSizeSm();

  return render ? children : null;
};

export const ViewportSmallUp = ({ children }) => {
  const render = useSizeSmUp();

  return render ? children : null;
};

export const ViewportSmallDown = ({ children }) => {
  const render = useSizeSmDown();

  return render ? children : null;
};

export const ViewportMedium = ({ children }) => {
  const render = useSizeMd();

  return render ? children : null;
};

export const ViewportMediumUp = ({ children }) => {
  const render = useSizeMdUp();

  return render ? children : null;
};

export const ViewportMediumDown = ({ children }) => {
  const render = useSizeMdDown();

  return render ? children : null;
};

export const ViewportLarge = ({ children }) => {
  const render = useSizeLg();

  return render ? children : null;
};

export const ViewportLargeUp = ({ children }) => {
  const render = useSizeLgUp();

  return render ? children : null;
};

export const ViewportLargeDown = ({ children }) => {
  const render = useSizeLgDown();

  return render ? children : null;
};

export const ViewportXLarge = ({ children }) => {
  const render = useSizeXl();

  return render ? children : null;
};

export const ViewportXLargeUp = ({ children }) => {
  const render = useSizeXlUp();

  return render ? children : null;
};

export const ViewportXLargeDown = ({ children }) => {
  const render = useSizeXlDown();

  return render ? children : null;
};

export const Viewport2XLarge = ({ children }) => {
  const render = useSize2Xl();

  return render ? children : null;
};
