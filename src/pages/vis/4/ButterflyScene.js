import React from 'react';
import Head from 'next/head';

export default function ButterflyScene({ onEnd }) {
  // 애니메이션 종료 후 onEnd 콜백 호출 (최대 18초)
  React.useEffect(() => {
    console.log('ButterflyScene 렌더링됨');
    const timer = setTimeout(() => {
      if (onEnd) onEnd();
    }, 18000);
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <>
      <style jsx global>{`
*, *::before, *::after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
.butterfly-container {
  position: fixed;
  left: 0; top: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 10001;
  display: flex;
  justify-content: center;
  align-items: center;
}
.scene {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 650px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.butterfly {
  position: absolute;
  animation: fly calc(12s + var(--random) * 6s) calc(var(--random) * -100s) 1 linear;
}
@keyframes fly {
  0% { transform: rotateX(90deg) rotate(calc(var(--random) * 360deg)) translateY(200px) scale(1); }
  100% { transform: rotateX(90deg) rotate(calc(var(--random) * 360deg - 720deg)) translateY(-600px) scale(1.2); }
}
.butterfly::before, .butterfly::after {
  box-shadow: 0 0 15px #0007 inset;
  content: '';
  position: absolute;
  width: 30px;
  height: 53px;
  background-color: #c3142d;
  clip-path: path('m0 24.949c 2.6262-5.4316 9.7782-15.554 16.428-20.546 4.798-3.6021 12.572-6.3892 12.572 2.4795 0 1.7712-1.0155 14.879-1.6111 17.007-2.0703 7.3984-9.6144 9.2854-16.325 8.1433 11.73 1.9964 14.714 8.6092 8.2697 15.222-12.239 12.559-17.591-3.1511-18.963-7.1766-.2514-.73797-.36904-1.0832-.37077-.78964z');
  transform-origin: left;
}
.butterfly::before {
  animation: flapB calc(0.2s + var(--random) * 0.1s) 1 alternate ease-in-out;
}
.butterfly::after {
  animation: flapA calc(0.2s + var(--random) * 0.1s) 1 alternate ease-in-out;
}
@keyframes flapB {
  from { rotate: y 15deg; } 
  to { rotate: y -30deg; } 
}
@keyframes flapA {
  from { rotate: y 165deg; } 
  to { rotate: y 210deg; } 
}
      `}</style>
      <div className="butterfly-container">
        <div className="scene">
          <div className="butterfly" style={{ '--random': 0.73428 }} />
          <div className="butterfly" style={{ '--random': 0.82130 }} />
          <div className="butterfly" style={{ '--random': 0.46092 }} />
          <div className="butterfly" style={{ '--random': 0.05981 }} />
          <div className="butterfly" style={{ '--random': 0.20235 }} />
          <div className="butterfly" style={{ '--random': 0.91763 }} />
          <div className="butterfly" style={{ '--random': 0.34480 }} />
          <div className="butterfly" style={{ '--random': 0.27659 }} />
          <div className="butterfly" style={{ '--random': 0.08087 }} />
          <div className="butterfly" style={{ '--random': 0.66670 }} />
          <div className="butterfly" style={{ '--random': 0.39124 }} />
          <div className="butterfly" style={{ '--random': 0.15907 }} />
        </div>
      </div>
    </>
  );
} 