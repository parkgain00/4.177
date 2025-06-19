import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const ButterflyPage = () => {
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    // Generate random values for butterflies on mount
    const newButterflies = Array.from({ length: 12 }).map(() => ({
      random: Math.random()
    }));
    setButterflies(newButterflies);
  }, []);

  return (
    <>
      <Head>
        <title>Butterfly Scene</title>
      </Head>
      <div className="scene">
        {butterflies.map((b, i) => (
          <div key={i} className="butterfly" style={{ '--random': b.random }}></div>
        ))}
      </div>
      <style jsx global>{`
*, *::before, *::after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

        body {
          background-color: transparent;
          background-image: none;
          min-height: 100vh;
          display: grid;
          place-items: center;
          perspective: 800px;
          overflow: clip;
        }

        body * {
          transform-style: preserve-3d;
        }

.scene {
          position: relative;
        }

        .scene * {
  position: absolute;
        }

.butterfly {
  position: absolute;
          animation: fly calc(12s + var(--random) * 6s) calc(var(--random) * -100s) infinite linear;
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
          animation: flapB calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
}
        
.butterfly::after {
          animation: flapA calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
}

        @keyframes fly {
          0% { transform: rotateX(90deg) rotate(calc(var(--random) * 360deg)) translateX(200px) translateZ(-70vh); }
          100% { transform: rotateX(90deg) rotate(calc(var(--random) * 360deg - 720deg)) translateX(200px) translateZ(70vh); }
        }

@keyframes flapB {
  from { rotate: y 15deg; } 
  to { rotate: y -30deg; } 
}
        
@keyframes flapA {
  from { rotate: y 165deg; } 
  to { rotate: y 210deg; } 
}

        .butterfly-wrapper {
          position: absolute;
          bottom: -100px;
          left: calc(var(--random) * 100vw - 50px);
          animation: rise-up 10s linear forwards, side-to-side 3s ease-in-out infinite alternate;
          animation-delay: calc(var(--i) * 0.5s);
          transform-style: preserve-3d;
        }
      `}</style>
    </>
  );
};

export default ButterflyPage; 
