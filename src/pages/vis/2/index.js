import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: 'Nanum Myeongjo', serif;
    overflow: hidden;
    background-color: #f0f0f0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
  
  .book {
    transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .book.final-state {
    transform: scale(0.9);
  }
  .page {
    background-color: #fdfaf3;
    background-size: cover;
    background-position: center;
    border: 1px solid #c9c8c3;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
  }

  .p1 { background-image: url(/cover.jpg); }
  .p2 { background-image: url(/oldpaper.jpg); }
  .p3 { background-image: url(/lover-bg.jpg); }
  .p4 { background-image: url(/lover-bg-2.jpg); }
  .p5 { background-image: url(/result-left-bg.jpg); }
  .p6 { background-image: url(/back-cover.jpg); }

  .page-content-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .page-content {
    padding: 40px;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transition: opacity 0.5s ease-out;
  }
  .page-content.fade-out {
    opacity: 0;
  }
  .input-group {
      position: relative;
      margin-bottom: 30px;
  }
  .input-group label {
      position: absolute;
      top: 10px;
      left: 0;
      color: #333;
      font-weight: bold;
      transition: all 0.3s ease;
      pointer-events: none;
      font-size: 1rem;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.7);
  }
  .input-group input {
      border: none;
      border-bottom: 1px solid #555;
      width: 100%;
      padding: 10px 0;
      background-color: transparent;
      font-size: 1rem;
      color: #333;
      transition: all 0.3s ease;
  }
  .input-group input:focus {
      outline: none;
      border-bottom-color: #c3142d;
  }
  .input-group input:focus + label,
  .input-group input:valid + label {
      top: -10px;
      font-size: 0.8rem;
      color: #c3142d;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .yeondam-text {
      font-family: 'Italiana', serif;
      font-size: 5rem;
      color: white;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
      animation: fadeIn 2s ease-in-out 1s forwards;
      opacity: 0;
  }
  .subtitle-text {
      font-size: 1.5rem;
      color: white;
      margin-top: 10px;
      text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
      animation: fadeIn 2s ease-in-out 1.5s forwards;
      opacity: 0;
  }

  @keyframes blink {
    50% { opacity: 0.5; }
  }

  .page-turn-prompt {
    position: absolute;
    bottom: 40px;
    right: 40px;
    font-size: 1rem;
    color: white;
    text-shadow: 1px 1px 4px rgba(0,0,0,0.7);
    animation: blink 2.5s infinite;
  }

  @keyframes fly {
    100% {
      transform: translateY(-120vh) rotateZ(180deg) scale(0.5);
    }
  }

  @keyframes flap {
      0%, 100% { transform: rotateY(30deg); }
      50% { transform: rotateY(-30deg); }
  }

  .butterfly-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
    pointer-events: none;
    z-index: 20;
  }
  
  .butterfly-wrapper {
          position: absolute;
    bottom: -100px;
    left: calc(var(--random) * 100%);
    transform-style: preserve-3d;
    transform: rotateX(60deg);
    animation: fly 20s linear forwards;
    animation-delay: calc(1s + var(--i) * 0.5s);
  }

  .butterfly {
          position: absolute;
    width: 50px;
    height: 40px;
    transform-style: preserve-3d;
  }

  .butterfly::before, .butterfly::after {
          content: '';
          position: absolute;
    width: 30px;
    height: 53px;
    background-color: #c3142d;
    clip-path: path('m0 24.949c2.6262-5.4316 9.7782-15.554 16.428-20.546 4.798-3.6021 12.572-6.3892 12.572 2.4795 0 1.7712-1.0155 14.879-1.6111 17.007-2.0703 7.3984-9.6144 9.2854-16.325 8.1433 11.73 1.9964 14.714 8.6092 8.2697 15.222-12.239 12.559-17.591-3.1511-18.963-7.1766-.2514-.73797-.36904-1.0832-.37077-.78964z');
    transform-origin: left;
    animation: flap calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
  }

  .butterfly::before {
    transform: rotateY(0deg);
  }

  .butterfly::after {
    transform: rotateY(180deg) translateZ(1px);
  }
`;

const FinalInfoContainer = styled.div`
  position: absolute;
          width: 100%;
  height: 100%;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
  gap: 20%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  pointer-events: none;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => $align};
  color: white;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  font-size: 1.2rem;
  transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ isFinal }) => (isFinal ? 'translateX(0)' : 'translateX(0)')};

  &.left {
    transform: ${({ isFinal }) => isFinal ? 'translateX(50%)' : 'translateX(0)'};
  }
  &.right {
    transform: ${({ isFinal }) => isFinal ? 'translateX(-50%)' : 'translateX(0)'};
  }

  div {
    margin-bottom: 20px;
          opacity: 0;
    transform: translateY(20px);
  }
`;

const slideInAnimation = keyframes`
          from {
            opacity: 0;
    transform: translateY(20px);
          }
          to {
            opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedInfo = styled.div`
  animation: ${slideInAnimation} 0.5s ease-out forwards;
  animation-delay: ${({ delay }) => delay};
`;

const SvgOverlay = styled.svg`
          position: absolute;
  top: 0;
  left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 1s ease-in-out 1.5s;
  z-index: 10;
`;

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const ThreadPath = styled.path`
  fill: none;
  stroke: #c3142d;
  stroke-width: 1;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: ${draw} 4s linear forwards;
  animation-delay: 2.5s;
  stroke-linecap: round;
  mask-image: linear-gradient(to left, transparent, black 20%, black 80%, transparent 100%);
`;

const BookContainer = styled.div`
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(${({ $isPortrait }) => ($isPortrait ? '210px' : '0')});
  transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const isPortrait = true; // 임의로 설정한 값

const Vis2 = () => {
  const [isBookVisible, setIsBookVisible] = useState(false);
  const [butterflies, setButterflies] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(1);
  const firstLoadTime = useRef(Date.now());
  const pageTurned = useRef(false);
  const [allInputsFilled, setAllInputsFilled] = useState(false);
  const [isFinalState, setIsFinalState] = useState(false);
  const [showFinalInfo, setShowFinalInfo] = useState(false);

  const [person1, setPerson1] = useState({ name: '', year: '', month: '', day: '', time: '' });
  const [person2, setPerson2] = useState({ name: '', year: '', month: '', day: '', time: '' });

  const turnRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsBookVisible(true), 1000);
    setButterflies(
      Array.from({ length: 15 }).map((_, i) => ({
        random: Math.random(),
        isCancelled: false,
      }))
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentLocation > 1 && !pageTurned.current) {
        pageTurned.current = true;
        const timeSinceLoad = (Date.now() - firstLoadTime.current) / 1000;
        setButterflies(currentButterflies =>
            currentButterflies.map((b, i) => {
                const animationDelay = 1 + i * 0.5;
                if (timeSinceLoad < animationDelay) {
                    return { ...b, isCancelled: true };
                }
                return b;
            })
        );
    }
  }, [currentLocation]);

  useEffect(() => {
    const setupTurnJs = async () => {
      const jquery = (await import('jquery')).default;
      window.$ = window.jQuery = jquery;
      
      await import('turn.js');

      const el = window.$('#book');
      if (el.length && typeof el.turn === 'function' && !el.turn('is')) {
        el.turn({
          width: 900,
          height: 600,
          elevation: 50,
          gradients: true,
          autoCenter: true,
          acceleration: true,
          when: {
            turned: function(event, page, view) {
              setCurrentLocation(page);
            }
          }
        });
        turnRef.current = el;
      }
    };
    if (typeof window !== 'undefined') {
      setupTurnJs();
    }
  }, []);

  const handleInputChange = (person, field, value) => {
      const newPerson = { ... (person === 1 ? person1 : person2), [field]: value };
      if (person === 1) setPerson1(newPerson);
      else setPerson2(newPerson);
  };

  useEffect(() => {
    const p1_filled = Object.values(person1).every(v => v.trim() !== '');
    const p2_filled = Object.values(person2).every(v => v.trim() !== '');

    if(p1_filled && p2_filled && !allInputsFilled) {
        setAllInputsFilled(true);
        setTimeout(() => setShowFinalInfo(true), 1000);
        setTimeout(() => setIsFinalState(true), 2500);
    }
  }, [person1, person2, allInputsFilled]);

  const person1Info = [
    { label: "Name", field: "name", value: person1.name },
    { label: "Year", field: "year", value: person1.year },
    { label: "Month", field: "month", value: person1.month },
    { label: "Day", field: "day", value: person1.day },
    { label: "Time", field: "time", value: person1.time },
  ];

  const person2Info = [
    { label: "Name", field: "name", value: person2.name },
    { label: "Year", field: "year", value: person2.year },
    { label: "Month", field: "month", value: person2.month },
    { label: "Day", field: "day", value: person2.day },
    { label: "Time", field: "time", value: person2.time },
  ];
  
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Hongyeon</title>
        <meta name="description" content="Saju Compatibility Calculator" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Nanum+Myeongjo:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        width: '100%', height: '100%', position: 'absolute',
        top: 0, left: 0, perspective: '1500px',
        transformStyle: 'preserve-3d'
      }}>
        <div className="butterfly-container">
          {butterflies.map((b, i) => (
            <div 
              key={i} 
              className="butterfly-wrapper" 
              style={{ '--i': i, '--random': b.random, display: b.isCancelled ? 'none' : 'block' }}>
              <div className="butterfly"></div>
            </div>
          ))}
        </div>
        <BookContainer $isPortrait={isPortrait}>
          <div id="book" className={`book ${currentLocation >= 4 ? 'final-state' : ''}`}>
            <div className="page p1">
              <div className="page-content-wrapper">
                <div className="yeondam-text">Hongyeon</div>
                <div className="subtitle-text">Stories of Fate</div>
                <div className="page-turn-prompt">Turn the page</div>
              </div>
            </div>
            <div className="page p2">
              <div className="page-content-wrapper">
                {/* This page is intentionally left blank */}
              </div>
            </div>
            <div className="page p3">
              <div className="page-content-wrapper">
                <div className={`page-content ${allInputsFilled ? 'fade-out' : ''}`}>
                      <h2>First Person</h2>
                      {person1Info.map(info => (
                        <div className="input-group" key={`p1-${info.field}`}>
                            <input type="text" id={`p1_${info.field}`} name={`p1_${info.field}`} 
                                    value={info.value} onChange={(e) => handleInputChange(1, info.field, e.target.value)} required />
                            <label htmlFor={`p1_${info.field}`}>{info.label}</label>
                        </div>
                      ))}
                </div>
                <FinalInfoContainer $visible={showFinalInfo}>
                    <InfoColumn $align="flex-end" className={`left ${isFinalState ? 'final' : ''}`}>
                        {person1Info.map((item, index) => (
                            <AnimatedInfo key={index} delay={`${1 + index * 0.15}s`}>
                                {item.label}: {item.value}
                            </AnimatedInfo>
                        ))}
                    </InfoColumn>
                </FinalInfoContainer>
              </div>
            </div>
            <div className="page p4">
              <div className="page-content-wrapper">
                <div className={`page-content ${allInputsFilled ? 'fade-out' : ''}`}>
                    <h2>Second Person</h2>
                    {person2Info.map(info => (
                        <div className="input-group" key={`p2-${info.field}`}>
                            <input type="text" id={`p2_${info.field}`} name={`p2_${info.field}`}
                                    value={info.value} onChange={(e) => handleInputChange(2, info.field, e.target.value)} required />
                              <label htmlFor={`p2_${info.field}`}>{info.label}</label>
                        </div>
                    ))}
                </div>
                <FinalInfoContainer $visible={showFinalInfo}>
                      <InfoColumn $align="flex-start" className={`right ${isFinalState ? 'final' : ''}`}>
                        {person2Info.map((item, index) => (
                            <AnimatedInfo key={index} delay={`${1 + index * 0.15}s`}>
                                {item.label}: {item.value}
                            </AnimatedInfo>
                        ))}
                    </InfoColumn>
                </FinalInfoContainer>
                <SvgOverlay $visible={isFinalState}>
                      <ThreadPath d="M 450,150 C 300,150 300,200 150,200" />
                      <ThreadPath d="M 450,250 C 300,250 300,300 150,300" />
                      <ThreadPath d="M 450,350 C 300,350 300,400 150,400" />
                      <ThreadPath d="M 450,450 C 300,450 300,500 150,500" />
                  </SvgOverlay>
              </div>
            </div>
            <div className="page p5">
               <div className="page-content-wrapper">
                  {/* Result page content can go here */}
               </div>
            </div>
            <div className="page p6">
              <div className="page-content-wrapper">
                {/* Back cover content can go here */}
              </div>
            </div>
          </div>
        </BookContainer>
      </div>
    </>
  );
};

export default Vis2;