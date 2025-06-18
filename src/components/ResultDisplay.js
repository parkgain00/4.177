import React from 'react';
import styled from 'styled-components';

const ResultContainer = styled.div`
    padding: 1rem;
    font-family: 'Gowun Batang', serif;
    color: #3b2b2b;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    background: transparent;

    &.centered {
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    h3 {
        text-align: center;
        color: #c3142d;
    }

    .score {
        font-size: 6rem;
        font-weight: bold;
        color: #c3142d;
        line-height: 1;
        margin-top: 1rem;
    }
    
    .names {
        font-size: 1.5rem;
    }

    .message {
        text-align: center;
        font-size: 1.2rem;
        font-style: italic;
        color: #c3142d;
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
            white-space: pre-wrap;
        }
    }
`;

export const ResultPageLeft = ({ score, nameA, nameB }) => (
    <ResultContainer className="centered">
        <div className="names">{nameA}님과 {nameB}님의 궁합</div>
        <div className="score">{score}</div>
        <h2>점</h2>
    </ResultContainer>
);

export const ResultPageRight = ({ message, personalityA, personalityB, detailedMessage, elementA, elementB }) => (
    <ResultContainer>
        <div className="message">"{message}"</div>
        <div className="section">
            <h3>첫번째 분 ({elementA})</h3>
            <p>{personalityA}</p>
        </div>
        <div className="section">
            <h3>두번째 분 ({elementB})</h3>
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