import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import styled from 'styled-components';
import axios from 'axios';

const defaultPost = {
  storeName: '000',
  storeLocation: '000',
  currentAmount: "000",
  targetAmount: "000",
  statusText: '주문 마감',
  deliveryStatus: '주문 처리 중 입니다.',
  timeLeft: '0분 후 도착 예정',
};

function OrderHistory() {
  const [post, setPost] = useState(defaultPost);

  useEffect(() => {
    axios.get('http://서버주소/api/v1/order-info')
      .then(res => {
        if (res.data) {
          setPost(prev => ({
            ...prev,
            ...res.data,
          }));
        }
      })
      .catch(err => {
        console.error("주문 정보를 불러오지 못했습니다:", err);
      });
  }, []);

  return (
    <FixedLayout>
      <Header />
      <BackButton onClick={() => window.location.href = '/mypage'}>
        ← 마이 페이지
      </BackButton>

      <Main>
        <StoreBox>
          <StoreName>📍 {post.storeName} {post.storeLocation}</StoreName>
          <StoreInfo>
            {post.currentAmount.toLocaleString()} / {post.targetAmount.toLocaleString()}
            <br />
            {post.statusText}
          </StoreInfo>
        </StoreBox>

        <StatusBox>
          {post.deliveryStatus}
          <br />
          {post.timeLeft}
        </StatusBox>
      </Main>

      <BottomNav />
    </FixedLayout>
  );
}

export default OrderHistory;



const BackButton = styled.div`
  padding: 13px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const Main = styled.main`
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const ProfileIcon = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #ddd;
`;

const Nickname = styled.span`
  font-weight: 600;
  color: #1f3993;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 10px 0 20px;
`;

const StoreBox = styled.div`
  border: 1.5px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 10px 20px 10px 0px;
  margin-top: 30px;
  margin-bottom: 40px;
  text-align: center;
`;

const StoreName = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StoreInfo = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatusBox = styled.div`
  background-color: #1f3993;
  color: white;
  text-align: center;
  padding: 14px;
  border-radius: 10px;
  margin: 20px 0;
  font-size: 1.2rem;
  font-weight: 700;
`;
