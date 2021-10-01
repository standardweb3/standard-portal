import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';

export type DividendProgressBarProps = {
  value: number;
  children?: React.ReactNode;
};

// const DividendProgressBarStyles = {
//   strokeLinecap: 'butt',
//   pathTransitionDuration: 0.5,
//   pathColor: '#8865DD',
//   trailColor: '#8DE7D8',
//   backgroundColor: 'transparent',
// };

const DividendProgressBarStyles = {
  root: {
    zIndex: 5,
  },
  path: {
    transition: 'stroke-dashoffset 0.5s ease 0s',
    stroke: '#8865dd',
  },
  trail: {
    stroke: '#8de7d8',
  },
  text: {},
  background: {
    fill: 'transparent',
  },
};
export function DividendProgressBar({
  value = 15,
  children,
}: DividendProgressBarProps) {
  const styles = DividendProgressBarStyles;
  return (
    <CircularProgressbarWithChildren value={value} styles={styles}>
      {children}
    </CircularProgressbarWithChildren>
  );
}
