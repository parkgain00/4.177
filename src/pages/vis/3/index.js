import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Book from '../../../components/Book';
import styled, { keyframes } from 'styled-components';

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

  useEffect(() => {
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