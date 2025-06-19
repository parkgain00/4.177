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
    <div className="page" ref={ref}>
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
    width: 840px; // 420px * 2 (양쪽 페이지)
    height: 580px; // 책의 실제 높이
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

    /* --- Cover Styling --- */
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

    /* --- Inner Page Styling --- */
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
    width: 420px; // 한 페이지 크기에 맞춤
    height: 580px; // 책의 실제 높이에 맞춤
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

// 먼저 기본 컴포넌트들을 정의
const InputForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 300px;
    margin-top: 90px;
`;

const SimpleInput = styled.input`
    border: none;
    border-bottom: ${props => props.$hideBorder ? 'none' : '1px solid #ddd'};
    background: transparent;
    padding: 10px 0;
    font-size: ${props => props.$largeText ? '18px' : '14px'};
    font-weight: ${props => props.$largeText ? '600' : 'normal'};
    color: #333;
    font-family: 'Nanum Myeongjo', serif;
    width: 50%;
    text-align: ${props => props.$align || 'left'};
    
    &:focus {
        outline: none;
        border-bottom-color: ${props => props.$hideBorder ? 'transparent' : '#c3142d'};
        border-bottom-width: ${props => props.$hideBorder ? '0' : '2px'};
    }
    
    &::placeholder {
        color: #999;
        font-size: 13px;
    }
`;

const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

// 새로운 입력창 컨테이너
const NewInputContainer = styled.div`
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    margin: 1rem;
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

const InputGroup = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 2002;
`;

const LeftInputGroup = styled(InputGroup)`
    text-align: left;
`;

const RightInputGroup = styled(InputGroup)`
    text-align: right;
`;

const Label = styled.label`
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.3rem;
    font-weight: 600;
    display: ${props => props.$hidden ? 'none' : 'block'};
    pointer-events: none;
    text-align: ${props => props.$align || 'left'};
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => props.$align === 'right' ? 'flex-end' : 'flex-start'};
    margin-top: 1rem;
    gap: 0.5rem;
    z-index: 2002;
    position: relative;
`;

const CheckboxLabel = styled.label`
    font-size: 0.8rem;
    color: #666;
    cursor: pointer;
    pointer-events: auto;
`;

// 하단 모서리 클릭 영역
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
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 10px;
    
    &:hover::after {
        content: '← 이전';
        color: rgba(195, 20, 45, 0.8);
        font-size: 12px;
        font-family: 'Nanum Myeongjo', serif;
    }
`;

const BottomRightArea = styled.div`
    flex: 1;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 10px;
    
    &:hover::after {
        content: '다음 →';
        color: rgba(195, 20, 45, 0.8);
        font-size: 12px;
        font-family: 'Nanum Myeongjo', serif;
    }
`;

// HTMLFlipBook 밖의 입력 필드 오버레이
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
    ${props => props.$position === 'left' ? 'left: 30px;' : 'right: 30px;'}
    width: 350px;
    padding: 40px;
    pointer-events: auto;
    z-index: 10001;
    opacity: ${props => props.$visible ? 1 : 0};
    transition: opacity 0.8s ease-in-out;
`;



function Book({ onCoverClick }) {
    const bookRef = useRef(null);
    const [isCoverView, setIsCoverView] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Input States
    const [nameA, setNameA] = useState('');
    const [yearA, setYearA] = useState('');
    const [monthA, setMonthA] = useState('');
    const [dayA, setDayA] = useState('');
    const [hourA, setHourA] = useState('');
    const [minuteA, setMinuteA] = useState('');
    const [unknownTimeA, setUnknownTimeA] = useState(false);

    const [nameB, setNameB] = useState('');
    const [yearB, setYearB] = useState('');
    const [monthB, setMonthB] = useState('');
    const [dayB, setDayB] = useState('');
    const [hourB, setHourB] = useState('');
    const [minuteB, setMinuteB] = useState('');
    const [unknownTimeB, setUnknownTimeB] = useState(false);

    // Result States
    const [score, setScore] = useState(null);
    const [message, setMessage] = useState('');
    const [detailedMessage, setDetailedMessage] = useState('');
    const [elementA, setElementA] = useState('');
    const [elementB, setElementB] = useState('');
    const [personalityA, setPersonalityA] = useState('');
    const [personalityB, setPersonalityB] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [showInputOverlay, setShowInputOverlay] = useState(false);





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
        console.log("handleNextPage called, current page:", currentPage);
        
        if (!bookRef.current) {
            console.log("bookRef.current is null");
            return;
        }

        // 페이지 1에서 2로 이동할 때 입력창 숨기기
        if (currentPage === 1) {
            setShowInputOverlay(false);
        }

        // 페이지 2(두 번째 연인 입력)에서 결과 페이지로 넘어갈 때 궁합 계산
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
            
            // 페이지 2에 도달했을 때 딜레이 후 입력창 표시
            if (currentPage === 1) {
                setTimeout(() => {
                    setShowInputOverlay(true);
                }, 800);
            }
        }
    };

    const handlePrevPage = () => {
        console.log("handlePrevPage called, current page:", currentPage);
        
        if (!bookRef.current) {
            console.log("bookRef.current is null for prev");
            return;
        }
        
        // 결과 페이지에서 나갈 때 결과 숨기기
        if (currentPage === 5 && showResult) {
            setShowResult(false);
        }
        
        bookRef.current.pageFlip().flipPrev();
        setCurrentPage(prev => prev - 1);
        
        // 페이지 2로 돌아갈 때 페이지 전환 완료 후 딜레이하여 입력창 표시
        if (currentPage === 3) {
            setTimeout(() => {
                setShowInputOverlay(true);
            }, 1400); // 페이지 전환 시간(800ms) + 추가 딜레이(600ms)
        }
    };

    if (!isCoverView) {
        return (
            <BookWrapper>
                <BookContainer $isCoverView={isCoverView}>
                    <HTMLFlipBook
                        key={isCoverView ? 'portrait' : 'landscape'}
                        ref={bookRef}
                        width={420}
                        height={580}
                        showCover={true}
                        flippingTime={800}
                        maxShadowOpacity={0.4}
                        className="album-web"
                        usePortrait={isCoverView}
                        startPage={isCoverView ? 0 : 1}
                        useMouseEvents={false}
                        disableFlipByClick={true}
                        mobileScrollSupport={false}
                        swipeDistance={0}
                        clickEventForward={false}
                    >
                        <PageCover key="cover-front" image="/cover.jpg" />
                        
                        <Page key="blank-1" number={1} image="/ccover.jpg"></Page>
                        <Page key="blank-2" number={2} image="/first.jpg"></Page>

                        {/* 첫 번째 연인 입력 페이지 - 입력 필드 제거 */}
                        <Page key="page-1" number={3} image="/lover-bg.jpg">
                        </Page>
                        
                        {/* 두 번째 연인 입력 페이지 - 입력 필드 제거 */}
                        <Page key="page-2" number={4} image="/lover-bg-2.jpg">
                        </Page>
                        
                        <Page key="page-3" number={5} image="/result-left-bg.jpg">
                            {showResult && (
                                <ResultPageLeft 
                                    score={score}
                                    nameA={nameA}
                                    nameB={nameB}
                                />
                            )}
                        </Page>
                        <Page key="page-4" number={6} image="/result-right-bg.jpg">
                            {showResult && (
                                <ResultPageRight
                                    message={message}
                                    elementA={elementA}
                                    elementB={elementB}
                                    personalityA={personalityA}
                                    personalityB={personalityB}
                                    detailedMessage={detailedMessage}
                                />
                            )}
                        </Page>

                        <Page key="blank-3" number={7} image="/last.jpg">
                        </Page>
                        <Page key="blank-4" number={8} image="/ccover.jpg">
                        </Page>

                        <PageCover key="cover-back" image="/back-cover.jpg" />
                    </HTMLFlipBook>
                </BookContainer>
                
                {/* HTMLFlipBook 밖에 있는 입력 필드들 */}
                {currentPage === 2 && (
                    <OverlayInputContainer>
                        <InputOverlay $position="left" $visible={showInputOverlay}>
                            <InputTitle>첫 번째 연인</InputTitle>
                            <InputForm>
                                <div style={{ marginBottom: '15px' }}>
                                    <Label $hidden={nameA.length > 0}>이름</Label>
                                    <SimpleInput
                                        type="text"
                                        value={nameA}
                                        onChange={(e) => setNameA(e.target.value)}
                                        placeholder="이름을 입력하세요"
                                        $largeText={nameA.length > 0}
                                        $hideBorder={nameA.length > 0}
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <Label $hidden={yearA || monthA || dayA}>생년월일</Label>
                                    <SimpleInput
                                        type="text"
                                        value={`${yearA || ''}${monthA ? '.' + monthA : ''}${dayA ? '.' + dayA : ''}`}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parts = value.split('.');
                                            setYearA(parts[0] || '');
                                            setMonthA(parts[1] || '');
                                            setDayA(parts[2] || '');
                                        }}
                                        placeholder="1990.01.01"
                                        $largeText={yearA || monthA || dayA}
                                        $hideBorder={yearA || monthA || dayA}
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <Label $hidden={hourA || minuteA}>태어난 시간</Label>
                                    <SimpleInput
                                        type="text"
                                        value={`${hourA || ''}${minuteA ? ':' + minuteA : ''}`}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parts = value.split(':');
                                            setHourA(parts[0] || '');
                                            setMinuteA(parts[1] || '');
                                        }}
                                        disabled={unknownTimeA}
                                        style={{ opacity: unknownTimeA ? 0.5 : 1 }}
                                        placeholder="14:30"
                                        $largeText={hourA || minuteA}
                                        $hideBorder={hourA || minuteA}
                                    />
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Checkbox
                                        type="checkbox"
                                        checked={unknownTimeA}
                                        onChange={(e) => setUnknownTimeA(e.target.checked)}
                                    />
                                    <CheckboxLabel>태어난 시 모름</CheckboxLabel>
                                </div>
                            </InputForm>
                        </InputOverlay>
                        
                        <InputOverlay $position="right" $visible={showInputOverlay}>
                            <InputTitle $align="right">두 번째 연인</InputTitle>
                            <InputForm>
                                <div style={{ marginBottom: '15px' }}>
                                    <Label $align="right" $hidden={nameB.length > 0}>이름</Label>
                                    <SimpleInput
                                        type="text"
                                        value={nameB}
                                        onChange={(e) => setNameB(e.target.value)}
                                        placeholder="이름을 입력하세요"
                                        $align="right"
                                        $largeText={nameB.length > 0}
                                        $hideBorder={nameB.length > 0}
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <Label $align="right" $hidden={yearB || monthB || dayB}>생년월일</Label>
                                    <SimpleInput
                                        type="text"
                                        value={`${yearB || ''}${monthB ? '.' + monthB : ''}${dayB ? '.' + dayB : ''}`}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parts = value.split('.');
                                            setYearB(parts[0] || '');
                                            setMonthB(parts[1] || '');
                                            setDayB(parts[2] || '');
                                        }}
                                        placeholder="1990.01.01"
                                        $align="right"
                                        $largeText={yearB || monthB || dayB}
                                        $hideBorder={yearB || monthB || dayB}
                                    />
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <Label $align="right" $hidden={hourB || minuteB}>태어난 시간</Label>
                                    <SimpleInput
                                        type="text"
                                        value={`${hourB || ''}${minuteB ? ':' + minuteB : ''}`}
                                        $align="right"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const parts = value.split(':');
                                            setHourB(parts[0] || '');
                                            setMinuteB(parts[1] || '');
                                        }}
                                        disabled={unknownTimeB}
                                        style={{ opacity: unknownTimeB ? 0.5 : 1 }}
                                        placeholder="14:30"
                                        $largeText={hourB || minuteB}
                                        $hideBorder={hourB || minuteB}
                                    />
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                                    <CheckboxLabel>태어난 시 모름</CheckboxLabel>
                                    <Checkbox
                                        type="checkbox"
                                        checked={unknownTimeB}
                                        onChange={(e) => setUnknownTimeB(e.target.checked)}
                                    />
                                </div>
                            </InputForm>
                        </InputOverlay>
                    </OverlayInputContainer>
                )}
                
                {/* 하단 모서리 클릭 영역 */}
                <BottomClickArea>
                    <BottomLeftArea 
                        onClick={handlePrevPage}
                        style={{ 
                            pointerEvents: currentPage <= 1 ? 'none' : 'auto',
                            opacity: currentPage <= 1 ? 0.3 : 1
                        }}
                    />
                    <BottomRightArea 
                        onClick={handleNextPage}
                        style={{ 
                            pointerEvents: currentPage >= 8 ? 'none' : 'auto',
                            opacity: currentPage >= 8 ? 0.3 : 1
                        }}
                    />
                </BottomClickArea>
            </BookWrapper>
        );
    }

    return (
        <ClosedBookCover onClick={() => {
            setIsCoverView(false);
            onCoverClick && onCoverClick();
        }}>
            <img src="/cover.jpg" alt="홍연 - 책 표지" />
            <ChineseText $visible={false}>緣談</ChineseText>
        </ClosedBookCover>
    );
}

export default Book;