import React from 'react';
import Head from 'next/head';
import Book from '../../../components/Book';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fdfaf7;
  padding: 2rem;
`;

export default function Vis3Page() {
  return (
    <div>
      <Head>
        <title>홍연 - 궁합 보기</title>
        <meta name="description" content="사주 궁합 계산기" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <Book />
      </PageContainer>
    </div>
  );
} 