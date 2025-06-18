import React from 'react';
import styled from 'styled-components';

const ResultContainer = styled.div`
    padding: 1rem;
    font-family: 'Gowun Batang', serif;
    color: #3b2b2b;
    display: flex;
    flex-direction: column;
    height: 100%;

    h2, h3 {
        text-align: center;
        color: #c3142d;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .score {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .names {
        font-size: 1.2rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    .elements {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .message {
        text-align: center;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }

    .section {
        margin-bottom: 1.5rem;
        h3 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid #e3d7c7;
            padding-bottom: 0.3rem;
        }
        p {
            font-size: 1rem;
            line-height: 1.6;
        }
    }
`;

export const ResultPageLeft = ({ score, nameA, nameB, elementA, elementB, message }) => (
    <ResultContainer>
        <h2>궁합 결과</h2>
        <div className="score">{score}점</div>
        <div className="names">{nameA}님과 {nameB}님의</div>
        <div className="elements">{elementA}과(와) {elementB}의 만남</div>
        <div className="message">{message}</div>
    </ResultContainer>
);

export const ResultPageRight = ({ personalityA, personalityB, detailedMessage }) => (
    <ResultContainer>
        <div className="section">
            <h3>첫번째 분의 성격</h3>
            <p>{personalityA}</p>
        </div>
        <div className="section">
            <h3>두번째 분의 성격</h3>
            <p>{personalityB}</p>
        </div>
        <div className="section">
            <h3>상세 궁합 풀이</h3>
            <p>{detailedMessage}</p>
        </div>
    </ResultContainer>
);

// The old ResultDisplay can be removed or kept for other purposes.
// For this implementation, we only need the new page components.
const ResultDisplay = () => null;
export default ResultDisplay; 