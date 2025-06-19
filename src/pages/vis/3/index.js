import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Book from '../../../components/Book';
import styled, { keyframes } from 'styled-components';

// Butterfly Animation Keyframes & Components
const fly = keyframes`
  0% { transform: rotateX(90deg) rotate(calc(var(--random) * 360deg)) translateX(200px) translateZ(-70vh); }
  100% { transform: rotateX(90deg) rotate(calc(var(--random) * 360deg - 720deg)) translateX(200px) translateZ(70vh); }
`;

const flapA = keyframes`
  from { transform: rotateY(165deg); } 
  to { transform: rotateY(210deg); } 
`;

const flapB = keyframes`
  from { transform: rotateY(15deg); } 
  to { transform: rotateY(-30deg); } 
`;

const containerRise = keyframes`
  from {
    transform: translateY(100vh);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ButterflySceneContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform-style: preserve-3d;
  perspective: 800px;
  z-index: 0;
  animation: ${containerRise} 4s ease-out forwards;
`;

const Butterfly = styled.div.attrs(props => ({
  style: {
    '--random': props.random,
  }
}))`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  animation: ${fly} calc(12s + var(--random) * 6s) calc(var(--random) * -100s) infinite linear;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 53px;
    background-color: #c3142d;
    box-shadow: 0 0 15px #0007 inset;
    clip-path: path('m0 24.949c 2.6262-5.4316 9.7782-15.554 16.428-20.546 4.798-3.6021 12.572-6.3892 12.572 2.4795 0 1.7712-1.0155 14.879-1.6111 17.007-2.0703 7.3984-9.6144 9.2854-16.325 8.1433 11.73 1.9964 14.714 8.6092 8.2697 15.222-12.239 12.559-17.591-3.1511-18.963-7.1766-.2514-.73797-.36904-1.0832-.37077-.78964z');
    transform-origin: left;
  }
        
  &::before {
    animation: ${flapB} calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
  }
        
  &::after {
    animation: ${flapA} calc(0.2s + var(--random) * 0.1s) infinite alternate ease-in-out;
  }
`;

const ButterflyScene = ({ count, zIndex }) => {
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    const newButterflies = Array.from({ length: count || 12 }).map(() => ({
      id: Math.random(),
      random: Math.random()
    }));
    setButterflies(newButterflies);
  }, [count]);

  return (
    <ButterflySceneContainer style={{ zIndex: zIndex || 0 }}>
      {butterflies.map((b) => (
        <Butterfly key={b.id} random={b.random} />
      ))}
    </ButterflySceneContainer>
  );
};


// Vis3 Page Components
const slideUp = keyframes`
  from {
    transform: translateY(100vh);
  }
  to {
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: transparent;
  padding: 2rem;
  position: relative;
`;

const BookContainer = styled.div`
  transform: translateY(${props => props.$visible ? '0' : '100vh'});
  animation: ${props => props.$visible ? slideUp : 'none'} 1s ease-out;
  position: relative;
  z-index: 5;
`;

const ChineseText = styled.div`
  position: absolute;
  bottom: 150px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Noto Serif KR', serif;
  font-size: 1.8rem;
  color: rgb(127, 6, 25);
  opacity: ${props => props.$visible ? 1 : 0};
  transition: ${props => props.$visible ? 'opacity 1.5s ease-out' : 'none'};
  pointer-events: none;
  z-index: 100;
`;

const SubtitleText = styled.div`
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Noto Serif KR', serif;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(127, 6, 25);
  opacity: ${props => props.$visible ? 1 : 0};
  transition: ${props => props.$visible ? 'opacity 1.5s ease-out' : 'none'};
  pointer-events: none;
  z-index: 100;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  filter: blur(${props => props.$blurred ? '8px' : '0px'});
  transition: filter 1s ease-out;
`;

export default function Vis3Page() {
  const [showBook, setShowBook] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isCoverTurned, setIsCoverTurned] = useState(false);
  const [showButterflies, setShowButterflies] = useState(false);

  useEffect(() => {
    const butterflyTimer = setTimeout(() => {
        setShowButterflies(true);
    }, 2000); // 2초 후에 나비 표시

    const timer = setTimeout(() => {
      setShowBook(true);
    }, 4000); // 4초 후에 책 표시

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 5000); // 5초 후에 텍스트 표시 (책 애니메이션 1초 후)

    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 5500); // 5.5초 후에 부제목 표시 (한자어 0.5초 후)
      
      return () => {
      clearTimeout(timer);
      clearTimeout(textTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(butterflyTimer);
    };
  }, []);

  // 표지 클릭 시 텍스트 숨기기
  const handleCoverClick = () => {
    setIsCoverTurned(true);
    setShowText(false);
    setShowSubtitle(false);
  };

  return (
    <div>
      <Head>
        <title>홍연 - 궁합 보기</title>
        <meta name="description" content="사주 궁합 계산기" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Back Butterflies */}
      {showButterflies && <ButterflyScene count={7} zIndex={0} />}
      
      {/* Front Butterflies */}
      {showButterflies && <ButterflyScene count={5} zIndex={10} />}

      <BackgroundVideo autoPlay muted loop $blurred={showBook}>
        <source src="/bgvideo.mp4" type="video/mp4" />
      </BackgroundVideo>

      <PageContainer>
        <BookContainer $visible={showBook}>
          <Book onCoverClick={handleCoverClick} />
          <ChineseText $visible={showText && !isCoverTurned}>緣談</ChineseText>
          <SubtitleText $visible={showSubtitle && !isCoverTurned}>인연에 대한 이야기</SubtitleText>
        </BookContainer>
      </PageContainer>
    </div>
  );
} 