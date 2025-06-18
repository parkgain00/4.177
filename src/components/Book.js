import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';
import PersonInput from './PersonInput';
import {
    calculateCompatibilityScore,
    calculateElement,
    getPersonalityAnalysis,
    getCompatibilityMessage,
    getDetailedMessage
} from '../utils/dateUtils';
import { ResultPageLeft, ResultPageRight } from './ResultDisplay';

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

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="page" ref={ref} data-density={props.density || 'soft'}>
            <div className="page-content" style={{
                backgroundImage: props.image ? `url(${props.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                {props.children}
            </div>
        </div>
    );
});
Page.displayName = 'Page';

const BookWrapper = styled.div`
    position: relative;
    width: ${470 * 2}px;
    height: 650px;
`;

const BookContainer = styled.div`
    position: absolute;
    top: 0;
    left: ${({ isCoverView }) => (isCoverView ? '50%' : '0')};
    transition: left 0.5s ease-in-out;

    .react-pageflip {
        box-shadow: 0 4px 15px rgba(0,0,0,0.25);
    }
    
    .page, .page-cover {
        font-family: 'Gowun Batang', serif;
        box-sizing: border-box;
        transform-style: preserve-3d;
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
        pointer-events: auto;
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
        pointer-events: none;
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
    width: 470px;
    height: 650px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.25);
    transition: transform 0.3s ease;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover {
        transform: scale(1.02);
    }
`;

const StyledPersonInput = styled(PersonInput)`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100%;
    background: transparent;
    
    h3 {
        font-family: 'Gowun Batang', serif;
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 2rem;
        font-weight: 700;
        color: #4a3737;
    }

    .input-group {
        position: relative;
        margin-bottom: 1.5rem;

        label {
            position: absolute;
            top: 0.5rem;
            left: 0.2rem;
            color: #6d6d6d;
            transition: all 0.3s ease;
            pointer-events: none;
            font-size: 1rem;
        }

        input {
            width: 100%;
            border: none;
            background: transparent;
            padding: 0.5rem 0.2rem;
            font-size: 1.1rem;
            color: #3b2b2b;
            font-family: 'Gowun Batang', serif;
            z-index: 1;
            position: relative;

            &:focus {
                outline: none;
            }

            &[type=number]::-webkit-inner-spin-button,
            &[type=number]::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            &[type=number] {
                -moz-appearance: textfield;
            }
        }

        .underline {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 100%;
            background-image: linear-gradient(to right, #c3142d 50%, transparent 50%);
            background-size: 8px 2px;
            background-repeat: repeat-x;
            transition: all 0.3s ease;
        }

        input:focus + label + .underline, input:not(:placeholder-shown) + label + .underline {
            background-image: linear-gradient(to right, #c3142d 100%, transparent 0%);
            background-size: 100% 2px;
        }
        
        input:focus + label,
        input:not(:placeholder-shown) + label {
            top: -1.2rem;
            left: 0;
            font-size: 0.9rem;
            color: #c3142d;
        }
    }
    
    .checkbox-group {
        margin-top: auto;
        label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 1rem;
            justify-content: ${props => props.checkboxSide === 'left' ? 'flex-start' : 'flex-end'};
        }
    }

    &.align-right {
        .input-group {
            input, label {
                text-align: right;
            }
            label {
                left: auto;
                right: 0.2rem;
            }
            input:focus + label,
            input:not(:placeholder-shown) + label {
                right: 0;
                left: auto;
            }
            .underline {
                left: auto;
                right: 0;
            }
        }
    }
`;

const Corner = styled.div`
    position: absolute;
    bottom: 0;
    width: 100px;
    height: 100px;
    cursor: pointer;
    z-index: 1000;
`;

const NextCorner = styled(Corner)`
    right: 0;
`;

const PrevCorner = styled(Corner)`
    left: 0;
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
        }
        setShowResult(true);
    };

    const handleNextPage = () => {
        if (isCoverView) {
            setIsCoverView(false);
            return;
        }

        if (!bookRef.current) return;

        const currentPage = bookRef.current.pageFlip().getCurrentPageIndex();
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

    const handlePrevPage = () => {
        if (!bookRef.current) return;
        
        const currentPageIndex = bookRef.current.pageFlip().getCurrentPageIndex();
        if (currentPageIndex === 5 && showResult) {
            setShowResult(false);
        }
        
        bookRef.current.pageFlip().flipPrev();
    };

    if (!isCoverView) {
        return (
            <BookWrapper>
                <BookContainer isCoverView={isCoverView}>
                    <HTMLFlipBook
                        key={isCoverView ? 'portrait' : 'landscape'}
                        ref={bookRef}
                        width={470}
                        height={650}
                        showCover={true}
                        flippingTime={1000}
                        maxShadowOpacity={0.5}
                        className="album-web"
                        usePortrait={isCoverView}
                        startPage={isCoverView ? 0 : 1}
                        disableFlipByClick={true}
                    >
                        <PageCover key="cover-front" image="/cover.jpg" />
                        
                        <Page key="blank-1" number={1} image="/ccover.jpg"></Page>
                        <Page key="blank-2" number={2} image="/first.jpg"></Page>

                        <Page key="page-1" number={3} image="/lover-bg.jpg">
                            <StyledPersonInput
                                label="첫번째 연인"
                                name={nameA} setName={setNameA}
                                year={yearA} setYear={setYearA}
                                month={monthA} setMonth={setMonthA}
                                day={dayA} setDay={setDayA}
                                hour={hourA} setHour={setHourA}
                                minute={minuteA} setMinute={setMinuteA}
                                unknownTime={unknownTimeA} setUnknownTime={setUnknownTimeA}
                                checkboxSide="left"
                            />
                        </Page>
                        
                        <Page key="page-2" number={4} image="/lover-bg-2.jpg">
                           <StyledPersonInput
                                label="두번째 연인"
                                name={nameB} setName={setNameB}
                                year={yearB} setYear={setYearB}
                                month={monthB} setMonth={setMonthB}
                                day={dayB} setDay={setDayB}
                                hour={hourB} setHour={setHourB}
                                minute={minuteB} setMinute={setMinuteB}
                                unknownTime={unknownTimeB} setUnknownTime={setUnknownTimeB}
                                checkboxSide="right"
                                className="align-right"
                            />
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

                        <Page key="blank-3" number={7} image="/last.jpg"></Page>
                        <Page key="blank-4" number={8} image="/ccover.jpg"></Page>

                        <PageCover key="cover-back" image="/back-cover.jpg" />
                    </HTMLFlipBook>

                    <PrevCorner onClick={handlePrevPage} />
                    <NextCorner onClick={handleNextPage} />
                </BookContainer>
            </BookWrapper>
        );
    }

    return (
        <ClosedBookCover onClick={() => setIsCoverView(false)}>
            <img src="/cover.jpg" alt="홍연 - 책 표지" />
        </ClosedBookCover>
    );
}

export default Book;