import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

const flash = keyframes`
    0% 100% {
    }
    50% {
      color: blue;
    }
  `;

export const FlasherDiv = styled.div`
  ${css`
    animation: ${flash} 2s ease;
  `}
`;

export function Flasher({ content, baseColor, fromColor }) {
  const [fadeIn, set] = useSpring(() => ({
    config: { duration: 1000, mass: 1, friction: 100 },
    color: baseColor,
  }));

  useEffect(() => {
    set({ color: baseColor, from: { color: fromColor } });
  }, [set, baseColor, fromColor, content]);

  return (
    <animated.p id="text" style={fadeIn}>
      {content}
    </animated.p>
  );
}
