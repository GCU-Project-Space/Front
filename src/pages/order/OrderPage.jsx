import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OrderComponent from '../../components/OrderComponent';
import { CheckOutComponent } from '../../components/TossCheckOutComponent';
import FixedLayout from "../../components/FixedLayout.jsx";

const OrderPage = () => {
  const location = useLocation();
  const initialOrderData = location.state?.orderData || null;

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
        <div>
          {!orderCompleteData ? (
              <div>
                <OrderComponent
                    initialOrderData={{...initialOrderData}}
                    onOrderComplete={handleOrderComplete}
                />
              </div>
          ) : (
              <CheckOutComponent orderData={orderCompleteData}/>
          )}
        </div>
      </FixedLayout>
  );
};

export default OrderPage;
