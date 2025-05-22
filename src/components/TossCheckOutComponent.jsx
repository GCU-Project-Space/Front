import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 설치 필요: npm install uuid

export function CheckOutComponent({ orderData }) {
  console.log('CheckOutComponent에서 받은 orderData:', orderData);

  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: parseInt(orderData?.data?.amount, 10) || 10000, // 문자열을 숫자로 변환
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
      if (!widgets || !orderData) {
        return;
      }

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

      console.log(orderData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="wrapper">
        <div className="box_section">
          {/* 결제 UI */}
          <div id="payment-method" />
          {/* 이용약관 UI */}
          <div id="agreement" />

          <button className="button" disabled={!ready} onClick={handlePayment}>
            결제하기
          </button>
        </div>
      </div>
  );
}

export default class TossCheckOut {
}