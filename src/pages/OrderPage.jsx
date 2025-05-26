import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderComponent from '../components/OrderComponent.jsx';
import { CheckOutComponent } from '../components/TossCheckOutComponent.jsx';
import FixedLayout from "../components/FixedLayout.jsx";
import Header from "../components/Header.jsx";
import BottomNav from "../components/BottomNav.jsx";
import styled from 'styled-components';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // fallback 데이터: state 없이 진입 시 테스트용
  const fallbackData = {
    menuName: "테스트 메뉴",
    basePrice: 5000,
    options: [],
    directCheckout: false,
  };

  const initialOrderData = location.state?.orderData || fallbackData;
  const [orderCompleteData, setOrderCompleteData] = useState(null);

  useEffect(() => {
    if (initialOrderData && initialOrderData.directCheckout) {
      console.log('바로 결제 데이터:', initialOrderData);
      setOrderCompleteData(initialOrderData);
    }
  }, [initialOrderData]);

  const handleOrderComplete = (orderData) => {
    setOrderCompleteData(orderData);
    console.log('주문 완료 데이터:', orderData);
  };

  return (
    <FixedLayout>
      <Header title="주문하기" />
      <BackButton onClick={() => navigate(-1)}>← 메뉴선택</BackButton>

      <MainContent>
        {!orderCompleteData ? (
          <OrderComponent
            initialOrderData={{ ...initialOrderData }}
            onOrderComplete={handleOrderComplete}
          />
        ) : (
          <CheckOutComponent orderData={orderCompleteData} />
        )}
      </MainContent>

      <BottomNav />
    </FixedLayout>
  );
};

export default OrderPage;

const MainContent = styled.main`
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
  font-family: 'Pretendard', sans-serif;
  margin-top: 16px;
`;

const BackButton = styled.div`
  padding: 12px 20px 0px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;
