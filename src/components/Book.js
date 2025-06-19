import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled, { keyframes } from 'styled-components';
import {
    calculateCompatibilityScore,
    calculateElement,
    getPersonalityAnalysis,
    getCompatibilityMessage,
    getDetailedMessage
} from '../utils/dateUtils';
import { ResultPageLeft, ResultPageRight } from './ResultDisplay';

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const gradientFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageCover = React.forwardRef((props, ref) => {
    return (
        <div className="page page-cover" ref={ref} data-density="hard">
            <div className="page-content" style={{
                backgroundImage: props.image ? `url(${props.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});
PageCover.displayName = 'PageCover';

const Page = React.forwardRef((props, ref) => (
    <div className={`page ${props.className || ''}`} ref={ref}>
        <div className="page-content" style={{
            backgroundImage: props.image ? `url(${props.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            {props.children}
        </div>
    </div>
));
Page.displayName = 'Page';

const BookWrapper = styled.div`
    position: relative;
    width: 840px; 
    height: 580px; 
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const BookContainer = styled.div`
    position: relative;
    transition: transform 0.8s ease-in-out;
    transform-style: preserve-3d;
    
    ${({ $isCoverView }) => `
        transform: translateX(${$isCoverView ? '210px' : '0'});
    `}

    .react-pageflip {
        .page, .page-cover {
            font-family: 'Gowun Batang', serif;
            box-sizing: border-box;
            transform-style: preserve-3d;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: box-shadow 0.3s;
        }
    }
    
    &.on-last-spread {
        .page:nth-last-child(2) {
             box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.2) !important;
        }
        .page:nth-last-child(1) {
             box-shadow: none !important;
        }
    }
    
    .front-face, .back-face {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        box-sizing: border-box;
    }

    .back-face {
        transform: rotateY(180deg);
    }
    
    .page-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        box-sizing: border-box;
    }

    .page-cover, .page-cover .back-face {
        background-color: #e3d7c7;
    }

    .page-cover .page-content {
        padding: 20px;
    }
    
    .page-cover h2 {
        text-align: center;
        font-size: 2em;
        margin-top: 50%;
        transform: translateY(-50%);
    }

    .page:not(.page-cover) {
        background-color: #e3d7c7;
    }

    .page:not(.page-cover) .front-face,
    .page:not(.page-cover) .back-face {
        background: #fdfaf7;
    }

    .page:not(.page-cover) .front-face .page-content {
        background: #fdfaf7;
        border: solid 1px #c2b5a3;
        margin-top: 10px;
        margin-bottom: 10px;
        height: calc(100% - 20px);
    }

    .page.odd:not(.page-cover) .front-face .page-content {
        margin-left: 10px;
        margin-right: 0;
        width: calc(100% - 10px);
    }

    .page.even:not(.page-cover) .front-face .page-content {
        margin-left: 0;
        margin-right: 10px;
        width: calc(100% - 10px);
    }
`;

const ClosedBookCover = styled.div`
    width: 420px; 
    height: 580px; 
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2);
    transition: transform 0.3s ease;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover {
        transform: scale(1.02);
    }
`;

const ChineseText = styled.div`
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Noto Serif KR', serif;
    font-size: 1.2rem;
    color: #c3142d;
    opacity: ${props => props.$visible ? 1 : 0};
    transition: opacity 1.5s ease-out;
    pointer-events: none;
    z-index: 1000;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
`;

const InputForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 300px;
    margin-top: 90px;
    ${props => props.$align === 'right' && `
        margin-left: auto;
    `}
`;

const SimpleInput = styled.input`
    border: none;
    border-bottom: 1px solid #ddd;
    background: transparent;
    padding: 10px 0;
    font-size: ${props => props.$largeText ? '18px' : '14px'};
    font-weight: ${props => props.$largeText ? '600' : 'normal'};
    color: #5d4037;
    font-family: 'Nanum Myeongjo', serif;
    width: 100%;
    text-align: ${props => props.$align || 'left'};
    
    border-bottom-color: ${props => props.$hideBorder ? 'transparent' : '#ddd'};
    transition: border-bottom-color 0.5s ease-out;
    
    &:focus {
        outline: none;
        border-bottom-color: ${props => props.$hideBorder ? 'transparent' : '#c3142d'};
        border-bottom-width: ${props => props.$hideBorder ? '1px' : '2px'};
    }
    
    &::placeholder {
        color: #999;
        font-size: 13px;
    }
`;

const CheckboxMark = styled.span`
  display: inline-block;
  position: relative;
  width: 18px;
  height: 18px;
  background-color: transparent;
  border: 1px solid #c3142d;
  border-radius: 3px;
  
  &::after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1px;
    width: 7px;
    height: 12px;
    border: solid #c3142d;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const CustomCheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;

  &:checked + ${CheckboxMark}::after {
    display: block;
    border-color: #c3142d;
  }
`;

const CheckboxLabelWrapper = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    flex-direction: ${props => props.$align === 'right' ? 'row-reverse' : 'row'};
    margin-top: 1.5cm;
`;

const InputTitle = styled.h2`
    font-family: 'Nanum Myeongjo', serif;
    font-size: 1.2rem;
    color: #c3142d;
    text-align: ${props => props.$align || 'center'};
    margin-bottom: 1.5rem;
    margin-top: -50px;
    font-weight: 700;
    pointer-events: none;
`;

const Label = styled.label`
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.3rem;
    font-weight: 600;
    display: block;
    opacity: ${props => props.$hidden ? 0 : 1};
    transition: opacity 0.5s ease-out;
    pointer-events: none;
    text-align: ${props => props.$align || 'left'};
`;

const CheckboxLabel = styled.label`
    font-size: 0.8rem;
    color: #666;
    cursor: pointer;
    pointer-events: auto;
`;

const BottomClickArea = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    z-index: 1000;
    pointer-events: auto;
    display: flex;
`;

const BottomLeftArea = styled.div`
    flex: 1;
    cursor: pointer;
`;

const BottomRightArea = styled.div`
    flex: 1;
    cursor: pointer;
`;

const OverlayInputContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 10000;
`;

const InputOverlay = styled.div`
    position: absolute;
    top: 10%;
    bottom: 10%;
    ${props => {
        if (props.$position === 'left') {
            return 'left: 30px; width: 350px;';
        }
        if (props.$position === 'right') {
            return 'right: 30px; width: 350px; transform: translateX(0cm);';
        }
        return 'left: 0; right: 0; width: 100%;';
    }}
    padding: 40px;
    pointer-events: auto;
    z-index: 10001;
    opacity: ${props => props.$visible ? 1 : 0};
    transition: opacity 0.8s ease-in-out;
`;

const FinalizedResultContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 1rem;
    animation: ${fadeIn} 0.5s ease-in;
`;

const ResultText = styled.p`
    font-family: 'Nanum Myeongjo', serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #5d4037;
    margin-bottom: 1.5rem;
    line-height: 1.8;
    text-align: center;
`;

const EditButton = styled.button`
    background: transparent;
    border: 1px solid #c3142d;
    color: #c3142d;
    padding: 3px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: 'Nanum Myeongjo', serif;
    transition: all 0.3s ease;
    margin-top: 2cm;
    
    &:hover {
        background: #c3142d;
        color: white;
    }
`;

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const RedThread = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;

    mask {
        fill: black;
    }

    path {
        stroke: #c3142d;
        stroke-width: 1.5;
        fill: transparent;
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: ${draw} 2s ease-out forwards;
        mask: url(#fade-mask);
        stroke-linecap: round;
    }
`;

const DetailedMessageContainer = styled.div`
    padding: 3rem;
    font-family: 'Nanum Myeongjo', serif;
    color: #333;
    line-height: 1.9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    
    h3 {
        font-size: 1.2rem;
        color: #c3142d;
        margin-bottom: 1.5rem;
        font-weight: 700;
    }

    p {
        font-size: 0.9rem;
    }
`;

const ProverbContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const ProverbText = styled.p`
    font-family: 'Nanum Myeongjo', serif;
    font-size: 1.3rem;
    font-weight: bold;
    color: #c3142d;
    text-align: center;
    line-height: 1.8;
    white-space: pre-wrap;
    padding: 2rem;
`;

const CharSpan = styled.span`
  opacity: 0;
  animation: ${gradientFadeIn} 0.6s forwards;
  animation-delay: ${props => props.$delay};
`;

function Book({ onCoverClick }) {
    const bookRef = useRef(null);
    const [isCoverView, setIsCoverView] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [nameA, setNameA] = useState('');
    const [yearA, setYearA] = useState('');
    const [monthA, setMonthA] = useState('');
    const [dayA, setDayA] = useState('');
    const [hourA, setHourA] = useState('');
    const [minuteA, setMinuteA] = useState('');
    const [unknownTimeA, setUnknownTimeA] = useState(false);
    const [filledStatusA, setFilledStatusA] = useState({ name: false, year: false, month: false, day: false, hour: false, minute: false });

    const [nameB, setNameB] = useState('');
    const [yearB, setYearB] = useState('');
    const [monthB, setMonthB] = useState('');
    const [dayB, setDayB] = useState('');
    const [hourB, setHourB] = useState('');
    const [minuteB, setMinuteB] = useState('');
    const [unknownTimeB, setUnknownTimeB] = useState(false);
    const [filledStatusB, setFilledStatusB] = useState({ name: false, year: false, month: false, day: false, hour: false, minute: false });
    const [isPersonAFinalized, setIsPersonAFinalized] = useState(false);
    const [isPersonBFinalized, setIsPersonBFinalized] = useState(false);
    const [startThreadAnimation, setStartThreadAnimation] = useState(false);

    const [score, setScore] = useState(null);
    const [message, setMessage] = useState('');
    const [detailedMessage, setDetailedMessage] = useState('');
    const [elementA, setElementA] = useState('');
    const [elementB, setElementB] = useState('');
    const [personalityA, setPersonalityA] = useState('');
    const [personalityB, setPersonalityB] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [showInputOverlay, setShowInputOverlay] = useState(false);
    const [showProverb, setShowProverb] = useState(false);
    const fullProverb = '緣(연), 실로 맺어지고,\n마음으로 이어진다.';

    useEffect(() => {
        if (!isCoverView) {
            const timer = setTimeout(() => {
                setShowProverb(true);
            }, 1300); 
            return () => clearTimeout(timer);
        } else {
            setShowProverb(false);
        }
    }, [isCoverView]);

    useEffect(() => {
      const isComplete = nameA.trim().length > 0 && yearA.length === 4 && monthA.length > 0 && dayA.length > 0 && (unknownTimeA || (hourA.length > 0 && minuteA.length > 0));
      if (isComplete) {
        const timer = setTimeout(() => setIsPersonAFinalized(true), 1300);
        return () => clearTimeout(timer);
      }
    }, [nameA, yearA, monthA, dayA, hourA, minuteA, unknownTimeA]);

    useEffect(() => {
        const isComplete = nameB.trim().length > 0 && yearB.length === 4 && monthB.length > 0 && dayB.length > 0 && (unknownTimeB || (hourB.length > 0 && minuteB.length > 0));
        if (isComplete) {
          const timer = setTimeout(() => setIsPersonBFinalized(true), 1300);
          return () => clearTimeout(timer);
        }
      }, [nameB, yearB, monthB, dayB, hourB, minuteB, unknownTimeB]);

    useEffect(() => {
        if (isPersonAFinalized && isPersonBFinalized) {
            setStartThreadAnimation(true);
        } else {
            setStartThreadAnimation(false);
        }
    }, [isPersonAFinalized, isPersonBFinalized]);

    const handleSubmit = () => {
        const isInputValid = yearA && monthA && dayA && yearB && monthB && dayB;

        if (isInputValid) {
            const personA = { year: yearA, month: monthA, day: dayA, hour: hourA, minute: minuteA };
            const personB = { year: yearB, month: monthB, day: dayB, hour: hourB, minute: minuteB };
            const compatibilityScore = calculateCompatibilityScore(personA, personB);
            setScore(compatibilityScore);
            const elemA = calculateElement(personA.year, personA.month, personA.day, personA.hour);
            const elemB = calculateElement(personB.year, personB.month, personB.day, personB.hour);
            setElementA(elemA);
            setElementB(elemB);
            setPersonalityA(getPersonalityAnalysis(elemA));
            setPersonalityB(getPersonalityAnalysis(elemB));
            setMessage(getCompatibilityMessage(compatibilityScore));
            setDetailedMessage(getDetailedMessage(compatibilityScore, elemA, elemB));
            setShowResult(true);
        } else {
            setNameA(nameA || '연인 1');
            setNameB(nameB || '연인 2');
            setScore(78);
            setElementA('물(水)');
            setElementB('불(火)');
            setMessage('서로의 장점을 키워주는 이상적인 관계입니다.');
            setPersonalityA('물의 기운을 가진 당신은 지혜롭고 유연한 사고의 소유자입니다. 주변 상황에 잘 적응하며 다른 사람의 마음을 잘 헤아리는 능력이 뛰어납니다.');
            setPersonalityB('불의 기운을 가진 상대방은 열정적이고 적극적인 에너지를 가지고 있습니다. 리더십이 강하고 자신의 목표를 향해 끊임없이 나아가는 추진력이 있습니다.');
            setDetailedMessage('두 분은 서로의 장점을 키워주고 단점을 보완해주는 이상적인 관계입니다. 물은 불의 강렬함을 지혜롭게 조절해주고, 불은 물의 차가움을 따뜻하게 만들어줍니다. 함께라면 어떤 어려움도 헤쳐나갈 수 있는 힘을 가졌습니다.');
            setShowResult(true);
        }
    };

    const handleNextPage = () => {
        if (!bookRef.current) return;

        if (startThreadAnimation) {
             setTimeout(() => {
                if (bookRef.current) {
                    bookRef.current.pageFlip().flipNext();
                    setCurrentPage(prev => prev + 1);
                    setShowInputOverlay(false);
                    setStartThreadAnimation(false);
                }
            }, 1800); 
            return;
        }

        if (currentPage === 1) setShowInputOverlay(false);
        if (currentPage === 2 && !showResult) {
            setShowInputOverlay(false);
            handleSubmit();
            setTimeout(() => {
                if (bookRef.current) {
                    bookRef.current.pageFlip().flipNext();
                    setCurrentPage(prev => prev + 1);
                }
            }, 50);
        } else {
            bookRef.current.pageFlip().flipNext();
            setCurrentPage(prev => prev + 1);
            if (currentPage === 1) {
                setTimeout(() => setShowInputOverlay(true), 800);
            }
        }
    };

    const handlePrevPage = () => {
        if (!bookRef.current) return;
        if (currentPage === 5 && showResult) setShowResult(false);
        bookRef.current.pageFlip().flipPrev();
        setCurrentPage(prev => prev - 1);
        if (currentPage === 3) {
            setTimeout(() => setShowInputOverlay(true), 1400); 
        }
    };

    if (!isCoverView) {
        return (
            <BookWrapper>
                <BookContainer 
                    $isCoverView={isCoverView}
                    className={currentPage === 4 ? 'on-last-spread' : ''}
                >
                    <HTMLFlipBook
                        ref={bookRef}
                        width={420}
                        height={580}
                        showCover={true}
                        flippingTime={800}
                        maxShadowOpacity={0.4}
                        usePortrait={isCoverView}
                        startPage={1}
                        useMouseEvents={false}
                        disableFlipByClick={true}
                    >
                        <PageCover key="cover-front" image="/cover.jpg" />
                        <Page key="blank-1" number={1} image="/ccover.jpg"></Page>
                        <Page key="blank-2" number={2} image="/first.jpg">
                            <ProverbContainer>
                                <ProverbText>
                                    {showProverb && fullProverb.split('').map((char, index) => (
                                        char === '\n' 
                                        ? <br key={index} />
                                        : <CharSpan key={index} $delay={`${index * 0.07}s`}>{char}</CharSpan>
                                    ))}
                                </ProverbText>
                            </ProverbContainer>
                        </Page>
                        <Page key="page-1" number={3} image="/lover-bg.jpg"></Page>
                        <Page key="page-2" number={4} image="/lover-bg-2.jpg"></Page>
                        <Page key="page-3" number={5} image="/result-left-bg.jpg">
                            {showResult && (
                                <ResultPageLeft 
                                    score={score}
                                    nameA={nameA}
                                    nameB={nameB}
                                    message={message}
                                />
                            )}
                        </Page>
                        <Page key="page-4" number={6} image="/result-right-bg.jpg">
                            {showResult && (
                                <ResultPageRight
                                    personalityA={personalityA}
                                    personalityB={personalityB}
                                    elementA={elementA}
                                    elementB={elementB}
                                    nameA={nameA}
                                    nameB={nameB}
                                />
                            )}
                        </Page>
                        <Page key="blank-3" number={7} image="/last.jpg">
                           {showResult && (
                                <DetailedMessageContainer>
                                    <h3>상세 궁합 풀이</h3>
                                    <p>{detailedMessage}</p>
                                </DetailedMessageContainer>
                           )}
                        </Page>
                        <Page key="blank-4" number={8} image="/ccover.jpg"></Page>
                        <PageCover key="cover-back" image="/back-cover.jpg" />
                    </HTMLFlipBook>
                </BookContainer>
                {startThreadAnimation && (
                    <RedThread viewBox="0 0 840 580">
                        <defs>
                            <linearGradient id="fade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="white" stopOpacity="0" />
                                <stop offset="45%" stopColor="white" stopOpacity="1" />
                                <stop offset="55%" stopColor="white" stopOpacity="1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <mask id="fade-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="url(#fade-gradient)" />
                            </mask>
                        </defs>
                        <path d="M 210,290 C 350,150 490,430 630,290" />
                    </RedThread>
                )}
                {currentPage === 2 && (
                    <OverlayInputContainer>
                        <InputOverlay $position="left" $visible={showInputOverlay}>
                            {isPersonAFinalized ? (
                                <FinalizedResultContainer>
                                    <ResultText>
                                        {nameA}<br />
                                        {yearA}년 {monthA}월 {dayA}일<br />
                                        {unknownTimeA ? "시간 모름" : `${hourA}시 ${minuteA}분`}
                                    </ResultText>
                                    <EditButton onClick={() => setIsPersonAFinalized(false)}>수정</EditButton>
                                </FinalizedResultContainer>
                            ) : (
                                <>
                                    <InputTitle $align="left">첫 번째 연인</InputTitle>
                                    <InputForm>
                                        <div style={{ marginBottom: '15px' }}>
                                            <Label $hidden={filledStatusA.name}>이름</Label>
                                            <SimpleInput type="text" value={nameA} onChange={(e) => setNameA(e.target.value)} onBlur={() => setFilledStatusA(prev => ({ ...prev, name: nameA.length > 0 }))} placeholder="이름을 입력하세요" $largeText={nameA.length > 0} $hideBorder={filledStatusA.name} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                            <div style={{ flex: 2 }}><Label $hidden={filledStatusA.year}>생년</Label><SimpleInput type="text" value={yearA} onChange={(e) => setYearA(e.target.value)} onBlur={() => setFilledStatusA(prev => ({...prev, year: yearA.length > 0}))} placeholder="YYYY" maxLength="4" $largeText={yearA.length > 0} $hideBorder={filledStatusA.year} /></div>
                                            <div style={{ flex: 1 }}><Label $hidden={filledStatusA.month}>월</Label><SimpleInput type="text" value={monthA} onChange={(e) => setMonthA(e.target.value)} onBlur={() => setFilledStatusA(prev => ({...prev, month: monthA.length > 0}))} placeholder="MM" maxLength="2" $largeText={monthA.length > 0} $hideBorder={filledStatusA.month} /></div>
                                            <div style={{ flex: 1 }}><Label $hidden={filledStatusA.day}>일</Label><SimpleInput type="text" value={dayA} onChange={(e) => setDayA(e.target.value)} onBlur={() => setFilledStatusA(prev => ({...prev, day: dayA.length > 0}))} placeholder="DD" maxLength="2" $largeText={dayA.length > 0} $hideBorder={filledStatusA.day} /></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                            <div style={{ flex: 1 }}><Label $hidden={filledStatusA.hour}>시</Label><SimpleInput type="text" value={hourA} onChange={(e) => setHourA(e.target.value)} onBlur={() => setFilledStatusA(prev => ({...prev, hour: hourA.length > 0}))} placeholder="HH" maxLength="2" disabled={unknownTimeA} style={{ opacity: unknownTimeA ? 0.5 : 1 }} $largeText={hourA.length > 0} $hideBorder={filledStatusA.hour} /></div>
                                            <div style={{ flex: 1 }}><Label $hidden={filledStatusA.minute}>분</Label><SimpleInput type="text" value={minuteA} onChange={(e) => setMinuteA(e.target.value)} onBlur={() => setFilledStatusA(prev => ({...prev, minute: minuteA.length > 0}))} placeholder="mm" maxLength="2" disabled={unknownTimeA} style={{ opacity: unknownTimeA ? 0.5 : 1 }} $largeText={minuteA.length > 0} $hideBorder={filledStatusA.minute} /></div>
                                        </div>
                                        <CheckboxLabelWrapper><CustomCheckboxInput checked={unknownTimeA} onChange={(e) => setUnknownTimeA(e.target.checked)} /><CheckboxMark /><CheckboxLabel>태어난 시 모름</CheckboxLabel></CheckboxLabelWrapper>
                                    </InputForm>
                                </>
                            )}
                        </InputOverlay>
                        <InputOverlay $position="right" $visible={showInputOverlay}>
                            {isPersonBFinalized ? (
                                <FinalizedResultContainer>
                                    <ResultText>
                                        {nameB}<br />
                                        {yearB}년 {monthB}월 {dayB}일<br />
                                        {unknownTimeB ? "시간 모름" : `${hourB}시 ${minuteB}분`}
                                    </ResultText>
                                    <EditButton onClick={() => setIsPersonBFinalized(false)}>수정</EditButton>
                                </FinalizedResultContainer>
                            ) : (
                                <>
                                    <InputTitle $align="right">두 번째 연인</InputTitle>
                                    <InputForm $align="right">
                                        <div style={{ marginBottom: '15px' }}><Label $align="right" $hidden={filledStatusB.name}>이름</Label><SimpleInput type="text" value={nameB} onChange={(e) => setNameB(e.target.value)} onBlur={() => setFilledStatusB(prev => ({...prev, name: nameB.length > 0}))} placeholder="이름을 입력하세요" $align="right" $largeText={nameB.length > 0} $hideBorder={filledStatusB.name} /></div>
                                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                            <div style={{ flex: 2 }}><Label $align="right" $hidden={filledStatusB.year}>생년</Label><SimpleInput type="text" value={yearB} onChange={(e) => setYearB(e.target.value)} onBlur={() => setFilledStatusB(prev => ({ ...prev, year: yearB.length > 0 }))} placeholder="YYYY" maxLength="4" $align="right" $largeText={yearB.length > 0} $hideBorder={filledStatusB.year} /></div>
                                            <div style={{ flex: 1 }}><Label $align="right" $hidden={filledStatusB.month}>월</Label><SimpleInput type="text" value={monthB} onChange={(e) => setMonthB(e.target.value)} onBlur={() => setFilledStatusB(prev => ({ ...prev, month: monthB.length > 0 }))} placeholder="MM" maxLength="2" $align="right" $largeText={monthB.length > 0} $hideBorder={filledStatusB.month} /></div>
                                            <div style={{ flex: 1 }}><Label $align="right" $hidden={filledStatusB.day}>일</Label><SimpleInput type="text" value={dayB} onChange={(e) => setDayB(e.target.value)} onBlur={() => setFilledStatusB(prev => ({ ...prev, day: dayB.length > 0 }))} placeholder="DD" maxLength="2" $align="right" $largeText={dayB.length > 0} $hideBorder={filledStatusB.day} /></div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                            <div style={{ flex: 1 }}><Label $align="right" $hidden={filledStatusB.hour}>시</Label><SimpleInput type="text" value={hourB} onChange={(e) => setHourB(e.target.value)} onBlur={() => setFilledStatusB(prev => ({ ...prev, hour: hourB.length > 0 }))} placeholder="HH" maxLength="2" disabled={unknownTimeB} style={{ opacity: unknownTimeB ? 0.5 : 1 }} $align="right" $largeText={hourB.length > 0} $hideBorder={filledStatusB.hour} /></div>
                                            <div style={{ flex: 1 }}><Label $align="right" $hidden={filledStatusB.minute}>분</Label><SimpleInput type="text" value={minuteB} onChange={(e) => setMinuteB(e.target.value)} onBlur={() => setFilledStatusB(prev => ({ ...prev, minute: minuteB.length > 0 }))} placeholder="mm" maxLength="2" disabled={unknownTimeB} style={{ opacity: unknownTimeB ? 0.5 : 1 }} $align="right" $largeText={minuteB.length > 0} $hideBorder={filledStatusB.minute} /></div>
                                        </div>
                                        <CheckboxLabelWrapper $align="right"><CustomCheckboxInput checked={unknownTimeB} onChange={(e) => setUnknownTimeB(e.target.checked)} /><CheckboxMark /><CheckboxLabel>태어난 시 모름</CheckboxLabel></CheckboxLabelWrapper>
                                    </InputForm>
                                </>
                            )}
                        </InputOverlay>
                    </OverlayInputContainer>
                )}
                <BottomClickArea>
                    <BottomLeftArea 
                        onClick={handlePrevPage}
                        style={{ pointerEvents: currentPage <= 1 ? 'none' : 'auto' }}
                    />
                    <BottomRightArea 
                        onClick={handleNextPage}
                        style={{ pointerEvents: currentPage >= 8 ? 'none' : 'auto' }}
                    />
                </BottomClickArea>

            </BookWrapper>
        );
    }

    return (
        <ClosedBookCover onClick={() => { setIsCoverView(false); onCoverClick && onCoverClick(); }}>
            <img src="/cover.jpg" alt="홍연 - 책 표지" />
            <ChineseText $visible={false}>緣談</ChineseText>
        </ClosedBookCover>
    );
}

export default Book;