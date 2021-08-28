import React, { useMemo } from 'react';
import Particles from 'react-tsparticles';
import styled from '@emotion/styled';

interface ParticlesBackgroundProps {
  className?: string;
  id: string;
  options: any;
}

export const ParticlesBackground = ({
  className,
  id,
  options,
}: ParticlesBackgroundProps) => {
  const particlesInit = (main: any) => {};
  const particlesLoaded = (container: any) => {};
  const particles = useMemo(
    () => (
      <Particles
        className={className}
        id={id}
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
      />
    ),
    [className, id, options],
  );
  return particles;
};

export const ParticlesBackgroundMemoized = React.memo(styled(
  ParticlesBackground,
)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`);
