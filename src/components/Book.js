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
            <div className="page-content">
                <h2>{props.children}</h2>
            </div>
        </div>
    );
});
PageCover.displayName = 'PageCover';

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="page" ref={ref}>
            <div className="page-content">
                {props.children}
            </div>
        </div>
    );
});
Page.displayName = 'Page';

const BookContainer = styled.div`
    .page {
        padding: 20px;
        background-color: #fdfaf7;
        border: solid 1px #c2b5a3;
        overflow: hidden;
        font-family: 'Gowun Batang', serif;
        box-sizing: border-box;
    }

    .page-cover {
        background-color: #e3d7c7;
        border: solid 1px #998a73;
    }

    .page-cover h2 {
        text-align: center;
        font-size: 2em;
        margin-top: 50%;
        transform: translateY(-50%);
    }

    .page-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
    }
`;

const StyledPersonInput = styled(PersonInput)`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100%;
    
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

const SubmitButton = styled.button`
  margin: 20px auto;
  padding: 0.8rem 2.2rem;
  font-size: 1.2rem;
  background-color: transparent;
  color: #c3142d;
  border: 1px solid #c3142d;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #c3142d;
    color: white;
  }
`;

function Book(props) {
    const bookRef = useRef(null);
    
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
        const personA = { year: yearA, month: monthA, day: dayA, hour: hourA, minute: minuteA };
        const personB = { year: yearB, month: monthB, day: dayB, hour: hourB, minute: minuteB };

        // Basic validation
        if (!personA.year || !personA.month || !personA.day || !personB.year || !personB.month || !personB.day) {
            alert('두 사람의 이름과 생년월일을 모두 입력해주세요.');
            return;
        }

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

        // Flip to the result pages
        if (bookRef.current) {
            bookRef.current.pageFlip().flip(6); // Flip to the beginning of the result spread
        }
    };

    const onFlip = (e) => {
        // This keeps the "open to blank page" effect
        if (e.data === 0) {
            if (bookRef.current && !showResult) { // Do not auto-flip if we just calculated results
                setTimeout(() => {
                    bookRef.current.pageFlip().flipNext();
                }, 300);
            }
        }
    };

    return (
        <BookContainer>
            <HTMLFlipBook
                ref={bookRef}
                onFlip={onFlip}
                width={450}
                height={630}
                showCover={true}
                flippingTime={1000}
                maxShadowOpacity={0.5}
                className="album-web"
                usePortrait={false}
                startPage={0}
            >
                <PageCover key="cover-front">홍연</PageCover>
                
                <Page key="page-1" number={1}></Page>
                <Page key="page-2" number={2}></Page>
                
                <Page key="page-3" number={3}>
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
                
                <Page key="page-4" number={4}>
                   <StyledPersonInput
                        label="두번째 연인"
                        name={nameB} setName={setNameB}
                        year={yearB} setYear={setYearB}
                        month={monthB} setMonth={setMonthB}
                        day={dayB} setDayB={setDayB}
                        hour={hourB} setHour={setHourB}
                        minute={minuteB} setMinute={setMinuteB}
                        unknownTime={unknownTimeB} setUnknownTime={setUnknownTimeB}
                        checkboxSide="right"
                        className="align-right"
                    />
                </Page>
                
                <Page key="page-5" number={5}>
                    {showResult && (
                        <ResultPageLeft 
                            score={score}
                            nameA={nameA}
                            nameB={nameB}
                            elementA={elementA}
                            elementB={elementB}
                            message={message}
                        />
                    )}
                </Page>
                <Page key="page-6" number={6}>
                    {showResult && (
                        <ResultPageRight
                            personalityA={personalityA}
                            personalityB={personalityB}
                            detailedMessage={detailedMessage}
                        />
                    )}
                </Page>

                <PageCover key="cover-back">
                    <SubmitButton onClick={handleSubmit}>궁합 보기</SubmitButton>
                </PageCover>
            </HTMLFlipBook>
        </BookContainer>
    );
}

export default Book; 