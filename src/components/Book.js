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
    z-index: 2001;
    position: relative;
    pointer-events: auto;
`;

const Input = styled.input`
    padding: 0.8rem;
    border: 2px solid transparent;
    border-radius: 8px;
    background: transparent;
    font-size: 1rem;
    color: #2c1810;
    font-family: 'Nanum Myeongjo', serif;
    transition: all 0.3s ease;
    z-index: 2003;
    pointer-events: auto;
    position: relative;
    
    &:focus {
        outline: none;
        border-color: #c3142d;
        background: transparent;
        box-shadow: none;
        z-index: 2004;
    }
    
    &::placeholder {
        color: rgba(44, 24, 16, 0.5);
    }
`;

const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
    z-index: 2003;
    pointer-events: auto;
    position: relative;
`;

// 새로운 입력창 컨테이너
const NewInputContainer = styled.div`
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 15px;
    margin: 1rem;
    z-index: 2000;
    pointer-events: none;
    isolation: isolate;
    position: relative;
    
    /* 입력 요소들만 pointer-events 활성화 */
    ${InputForm}, ${Input}, ${Checkbox} {
        pointer-events: auto;
    }
`;

const InputTitle = styled.h2`
    font-family: 'Nanum Myeongjo', serif;
    font-size: 1.5rem;
    color: #c3142d;
    text-align: center;
    margin-bottom: 2rem;
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
    font-size: 0.9rem;
    color: #2c1810;
    margin-bottom: 0.5rem;
    font-weight: 600;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
    pointer-events: none;
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
    font-size: 1rem;
    color: #2c1810;
    cursor: pointer;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.7);
    pointer-events: auto;
`;

function Book(props) {
    const bookRef = useRef(null);
    const [isCoverView, setIsCoverView] = useState(true);
    
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

    // 생년월일을 YYYY-MM-DD 형식으로 변환
    const getBirthDateA = () => {
        if (yearA && monthA && dayA) {
            const paddedMonth = monthA.toString().padStart(2, '0');
            const paddedDay = dayA.toString().padStart(2, '0');
            return `${yearA}-${paddedMonth}-${paddedDay}`;
        }
        return '';
    };

    const getBirthDateB = () => {
        if (yearB && monthB && dayB) {
            const paddedMonth = monthB.toString().padStart(2, '0');
            const paddedDay = dayB.toString().padStart(2, '0');
            return `${yearB}-${paddedMonth}-${paddedDay}`;
        }
        return '';
    };

    // 생년월일 변경 처리
    const handleBirthDateChangeA = (e) => {
        e.stopPropagation();
        const dateValue = e.target.value;
        if (dateValue) {
            const [newYear, newMonth, newDay] = dateValue.split('-');
            setYearA(newYear);
            setMonthA(newMonth);
            setDayA(newDay);
        } else {
            setYearA('');
            setMonthA('');
            setDayA('');
        }
    };

    const handleBirthDateChangeB = (e) => {
        e.stopPropagation();
        const dateValue = e.target.value;
        if (dateValue) {
            const [newYear, newMonth, newDay] = dateValue.split('-');
            setYearB(newYear);
            setMonthB(newMonth);
            setDayB(newDay);
        } else {
            setYearB('');
            setMonthB('');
            setDayB('');
        }
    };

    // 시간을 HH:MM 형식으로 변환
    const getTimeValueA = () => {
        if (hourA && minuteA) {
            const paddedHour = hourA.toString().padStart(2, '0');
            const paddedMinute = minuteA.toString().padStart(2, '0');
            return `${paddedHour}:${paddedMinute}`;
        }
        return '';
    };

    const getTimeValueB = () => {
        if (hourB && minuteB) {
            const paddedHour = hourB.toString().padStart(2, '0');
            const paddedMinute = minuteB.toString().padStart(2, '0');
            return `${paddedHour}:${paddedMinute}`;
        }
        return '';
    };

    // 시간 변경 처리
    const handleTimeChangeA = (e) => {
        e.stopPropagation();
        const timeValue = e.target.value;
        if (timeValue) {
            const [newHour, newMinute] = timeValue.split(':');
            setHourA(newHour);
            setMinuteA(newMinute);
        } else {
            setHourA('');
            setMinuteA('');
        }
    };

    const handleTimeChangeB = (e) => {
        e.stopPropagation();
        const timeValue = e.target.value;
        if (timeValue) {
            const [newHour, newMinute] = timeValue.split(':');
            setHourB(newHour);
            setMinuteB(newMinute);
        } else {
            setHourB('');
            setMinuteB('');
        }
    };

    // 입력 이벤트 핸들러 강화
    const handleInputChange = (setter) => (e) => {
        e.stopPropagation();
        setter(e.target.value);
    };

    const handleInputFocus = (e) => {
        e.stopPropagation();
    };

    const handleInputClick = (e) => {
        e.stopPropagation();
    };

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

    const handleNextPage = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        console.log("handleNextPage called");
        if (isCoverView) {
            setIsCoverView(false);
            return;
        }

        if (!bookRef.current) {
            console.log("bookRef.current is null");
            return;
        }

        const currentPage = bookRef.current.pageFlip().getCurrentPageIndex();
        console.log("Current page index:", currentPage);
        if (currentPage === 4 && !showResult) {
            handleSubmit();
            setTimeout(() => {
                if (bookRef.current) {
                    bookRef.current.pageFlip().flipNext();
                }
            }, 50);
        } else {
            bookRef.current.pageFlip().flipNext();
        }
    };

    const handlePrevPage = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        console.log("handlePrevPage called");
        if (!bookRef.current) {
            console.log("bookRef.current is null for prev");
            return;
        }
        
        const currentPageIndex = bookRef.current.pageFlip().getCurrentPageIndex();
        console.log("Current page index for prev:", currentPageIndex);
        if (currentPageIndex === 5 && showResult) {
            setShowResult(false);
        }
        
        bookRef.current.pageFlip().flipPrev();
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
                        useMouseEvents={true}
                        disableFlipByClick={true}
                    >
                        <PageCover key="cover-front" image="/cover.jpg" />
                        
                        <Page key="blank-1" number={1} image="/ccover.jpg"></Page>
                        <Page key="blank-2" number={2} image="/first.jpg"></Page>

                        {/* 첫 번째 연인 입력 페이지 */}
                        <Page key="page-1" number={3} image="/lover-bg.jpg">
                            <NewInputContainer>
                                <InputTitle>첫 번째 연인</InputTitle>
                                <InputForm>
                                    <LeftInputGroup>
                                        <Label htmlFor="nameA">이름</Label>
                                        <Input
                                            type="text"
                                            id="nameA"
                                            value={nameA}
                                            onChange={handleInputChange(setNameA)}
                                            onFocus={handleInputFocus}
                                            onClick={handleInputClick}
                                            placeholder="이름을 입력하세요"
                                        />
                                    </LeftInputGroup>

                                    <LeftInputGroup>
                                        <Label htmlFor="birthA">생년월일</Label>
                                        <Input
                                            type="date"
                                            id="birthA"
                                            value={getBirthDateA()}
                                            onChange={handleBirthDateChangeA}
                                            onFocus={handleInputFocus}
                                            onClick={handleInputClick}
                                        />
                                    </LeftInputGroup>

                                    <LeftInputGroup>
                                        <Label htmlFor="timeA">태어난 시간</Label>
                                        <Input
                                            type="time"
                                            id="timeA"
                                            value={getTimeValueA()}
                                            onChange={handleTimeChangeA}
                                            onFocus={handleInputFocus}
                                            onClick={handleInputClick}
                                            disabled={unknownTimeA}
                                            style={{ opacity: unknownTimeA ? 0.5 : 1 }}
                                        />
                                    </LeftInputGroup>

                                    <CheckboxContainer $align="left">
                                        <Checkbox
                                            type="checkbox"
                                            id="unknownTimeA"
                                            checked={unknownTimeA}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setUnknownTimeA(e.target.checked);
                                            }}
                                            onClick={handleInputClick}
                                        />
                                        <CheckboxLabel htmlFor="unknownTimeA">
                                            태어난 시 모름
                                        </CheckboxLabel>
                                    </CheckboxContainer>
                                </InputForm>
                            </NewInputContainer>
                        </Page>
                        
                        {/* 두 번째 연인 입력 페이지 */}
                        <Page key="page-2" number={4} image="/lover-bg-2.jpg">
                            <NewInputContainer>
                                <InputTitle>두 번째 연인</InputTitle>
                                <InputForm>
                                    <RightInputGroup>
                                        <Label htmlFor="nameB">이름</Label>
                                        <Input
                                            type="text"
                                            id="nameB"
                                            value={nameB}
                                            onChange={handleInputChange(setNameB)}
                                            onFocus={handleInputFocus}
                                            onClick={handleInputClick}
                                            placeholder="이름을 입력하세요"
                                        />
                                    </RightInputGroup>

                                    <RightInputGroup>
                                        <Label htmlFor="birthB">생년월일</Label>
                                        <Input
                                            type="date"
                                            id="birthB"
                                            value={getBirthDateB()}
                                            onChange={handleBirthDateChangeB}
                                            onFocus={handleInputFocus}
                                            onClick={handleInputClick}
                                        />
                                    </RightInputGroup>

                                    <RightInputGroup>
                                        <Label htmlFor="timeB">태어난 시간</Label>
                                        <Input
                                            type="time"
                                            id="timeB"
                                            value={getTimeValueB()}
                                            onChange={handleTimeChangeB}
                                            onFocus={handleInputFocus}
                                            onClick={handleInputClick}
                                            disabled={unknownTimeB}
                                            style={{ opacity: unknownTimeB ? 0.5 : 1 }}
                                        />
                                    </RightInputGroup>

                                    <CheckboxContainer $align="right">
                                        <CheckboxLabel htmlFor="unknownTimeB">
                                            태어난 시 모름
                                        </CheckboxLabel>
                                        <Checkbox
                                            type="checkbox"
                                            id="unknownTimeB"
                                            checked={unknownTimeB}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                setUnknownTimeB(e.target.checked);
                                            }}
                                            onClick={handleInputClick}
                                        />
                                    </CheckboxContainer>
                                </InputForm>
                            </NewInputContainer>
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
            </BookWrapper>
        );
    }

    return (
        <ClosedBookCover onClick={() => setIsCoverView(false)}>
            <img src="/cover.jpg" alt="홍연 - 책 표지" />
            <ChineseText $visible={false}>緣談</ChineseText>
        </ClosedBookCover>
    );
}

export default Book;