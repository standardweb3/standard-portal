import Countdown from 'react-countdown';
import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp';

export type CountdownTimerProps = {
  time: number;
};

export function CountdownTimer({ time }: CountdownTimerProps) {
  const currentBlock = useCurrentBlockTimestamp();
  const Completionist = () => <span>You are good to go!</span>;

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {days}:{hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  return (
    <Countdown
      date={currentBlock.toNumber() * 1000 + time * 1000}
      renderer={renderer}
    />
  );
}
