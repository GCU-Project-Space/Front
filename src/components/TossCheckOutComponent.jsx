import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

export function CheckOutComponent({ orderData }) {
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: parseInt(orderData?.data?.amount, 10) || 10000,
  });

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const randomFallbackId = Math.floor(Math.random() * 1000000);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(
        'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
      );
      const widgets = tossPayments.widgets({
        customerKey: '1YxpCe8nRUy4TZE0d7ZTx',
      });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets || !orderData) return;

      await widgets.setAmount(amount);
      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, amount, orderData]);

  const handlePayment = async () => {
    try {
      const orderId =
        orderData?.data?.orderId != null
          ? orderData.data.orderId.toString().padStart(6, '0')
          : randomFallbackId.toString().padStart(6, '0');

      await widgets.requestPayment({
        orderId,
        orderName: orderData?.data?.orderName || 'VIP회원권 외 2건',
        successUrl: window.location.origin + '/toss/success',
        failUrl: window.location.origin + '/toss/fail',
        customerEmail: orderData?.data?.customerEmail || 'customer123@gmail.com',
        customerName: orderData?.data?.customerName || '김토스',
        customerMobilePhone: orderData?.data?.customerMobilePhone || '01012341234',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <div id="payment-method" />
      <div id="agreement" />
      <PayButton disabled={!ready} onClick={handlePayment}>
        결제하기
      </PayButton>
      <TossStyleFix />
    </Wrapper>
  );
}

// 스타일 컴포넌트
const Wrapper = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-color: transparent;
  border: none;
`;

const PayButton = styled.button`
  background-color: #1f3993;
  color: white;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
`;

const TossStyleFix = () => (
  <style>
    {`
      #payment-method .method {
        flex: 1 1 30% !important;
        min-width: 140px !important;
        max-width: 200px !important;
        margin: 10px !important;
        padding: 14px 10px !important;
        box-sizing: border-box !important;
      }

      @media (max-width: 480px) {
        #payment-method .method {
          flex: 1 1 45% !important;
        }
      }
    `}
  </style>
);
