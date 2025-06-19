import React from 'react';
import styled from 'styled-components';

const ResultContainer = styled.div`
    padding: 2.5rem;
    font-family: 'Nanum Myeongjo', serif;
    color: #3b2b2b;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    background: transparent;
`;

const ScoreContainer = styled.div`
    .title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #3b2b2b;
        margin-bottom: 0.5rem;
    }
    .score {
        font-size: 6rem;
        font-weight: bold;
        color: #c3142d;
        line-height: 1.2;
    }
    .message {
        font-size: 1rem;
        color: #3b2b2b;
        margin-top: 1.5rem;
    }
`;

const Section = styled.div`
    margin-bottom: 3rem;
    &:last-child {
        margin-bottom: 0;
    }

    h3 {
        font-size: 1.2rem;
        color: #c3142d;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .name {
        font-size: 1rem;
        color: #c3142d;
        margin-bottom: 1.5rem;
    }

    p {
        font-size: 0.9rem;
        line-height: 1.8;
        color: #5d4037;
    }
`;

const Highlight = styled.span`
    color: inherit; 
`;

const getColorForElement = (element) => {
    // 이 함수는 현재 h3에서 직접 색상을 지정하므로 사용되지 않지만,
    // 추후 다른 Highlight 컴포넌트 사용을 위해 남겨둡니다.
    switch (element) {
        case '목(木)': return '#2E7D32';
        case '화(火)': return '#C62828';
        case '토(土)': return '#8D6E63';
        case '금(金)': return '#BDBDBD';
        case '수(水)': return '#1565C0';
        default: return '#c3142d';
    }
};

export const ResultPageLeft = ({ score, message }) => (
    <ResultContainer>
        <ScoreContainer>
            <div className="title">궁합 점수</div>
            <div className="score">{score}</div>
            <div className="message">"{message}"</div>
        </ScoreContainer>
    </ResultContainer>
);

export const ResultPageRight = ({ personalityA, personalityB, elementA, elementB, nameA, nameB }) => (
    <ResultContainer>
        <Section>
            <h3>{elementA}의 기운</h3>
            <div className="name">{nameA || '연인 1'}</div>
            <p>{personalityA}</p>
        </Section>
        <Section>
            <h3>{elementB}의 기운</h3>
            <div className="name">{nameB || '연인 2'}</div>
            <p>{personalityB}</p>
        </Section>
    </ResultContainer>
);

const ResultDisplay = () => null;
export default ResultDisplay; 