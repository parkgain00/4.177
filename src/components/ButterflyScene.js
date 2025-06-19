import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const flapA = keyframes`
  from { transform: rotateY(165deg); } 
  to { transform: rotateY(210deg); } 
`;

const flapB = keyframes`
  from { transform: rotateY(15deg); } 
  to { transform: rotateY(-30deg); } 
`;

const rise = keyframes`
  from {
    transform: translateY(0) scale(var(--scale-start));
  }
  to {
    transform: translateY(-110vh) scale(var(--scale-end));
  }
`;

const sway = keyframes`
  0% { transform: translateX(-25px); }
  100% { transform: translateX(25px); }
`;

const SceneContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.5s ease-in;
  z-index: 999;
`;

const ButterflyWrapper = styled.div.attrs(props => ({
  style: {
    '--random-x': props.$randomX,
    '--delay': `${props.$delay}s`,
    '--duration': `${props.$duration}s`,
    '--sway-duration': `${props.$swayDuration}s`,
    '--scale-start': props.$scaleStart,
    '--scale-end': props.$scaleEnd,
  }
}))`
  position: absolute;
  bottom: -60px;
  left: calc(var(--random-x) * 100vw);
  
  animation: 
    ${rise} var(--duration) linear var(--delay) forwards,
    ${sway} var(--sway-duration) ease-in-out infinite alternate var(--delay);
`;

const Butterfly = styled.div.attrs(props => ({
  style: {
    '--random': props.$random,
  }
}))`
  position: absolute;
  transform-style: preserve-3d;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 53px;
    background-color: #c3142d;
    box-shadow: 0 0 15px #0007 inset;
    clip-path: path('m0 24.949c 2.6262-5.4316 9.7782-15.554 16.428-20.546 4.798-3.6021 12.572-6.3892 12.572 2.4795 0 1.7712-1.0155 14.879-1.6111 17.007-2.0703 7.3984-9.6144 9.2854-16.325 8.1433 11.73 1.9964 14.714 8.6092 8.2697 15.222-12.239 12.559-17.591-3.1511-18.963-7.1766-.2514-.73797-.36904-1.0832-.37077-.78964z');
    transform-origin: left;
    transform-style: preserve-3d;
  }
        
  &::before {
    animation: ${flapB} calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
  }
        
  &::after {
    animation: ${flapA} calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
  }
`;

const ButterflyScene = () => {
  const [butterflies, setButterflies] = useState([]);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newButterflies = Array.from({ length: 20 }).map(() => ({
        random: Math.random(),
        randomX: Math.random(),
        delay: Math.random() * 6,
        duration: 9 + Math.random() * 8,
        swayDuration: 4 + Math.random() * 3,
        scaleStart: 0.4 + Math.random() * 0.4,
        scaleEnd: 0.6 + Math.random() * 0.6,
      }));
      setButterflies(newButterflies);
      setStartAnimation(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SceneContainer $visible={startAnimation}>
      {butterflies.map((b, i) => (
        <ButterflyWrapper 
            key={i}
            $randomX={b.randomX}
            $delay={b.delay}
            $duration={b.duration}
            $swayDuration={b.swayDuration}
            $scaleStart={b.scaleStart}
            $scaleEnd={b.scaleEnd}
        >
          <Butterfly $random={b.random} />
        </ButterflyWrapper>
      ))}
    </SceneContainer>
  );
};

export default ButterflyScene; 