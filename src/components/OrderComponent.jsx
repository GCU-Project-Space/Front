import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 설치 필요: npm install uuid


const OrderComponent = ({
  initialOrderData,
  onOrderComplete,
}) => {
  const defaultOrderData = {
    items: [{productId: 'EXAMPLE-001', count: 1}],
  };

  const [orderData, setOrderData] = useState(
    initialOrderData || defaultOrderData
  );

  useEffect(() => {
    setOrderData((prevOrderData) => {
      const merged = {
        ...defaultOrderData,
        ...prevOrderData,
        ...initialOrderData,
      };

      console.log('새로 설정된 orderData:', merged);
      return merged;
    });
  }, [initialOrderData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uniqueOrderId = `ORDER-${uuidv4()}`; // 매번 유일한 ID

      const mockResponse = {
        orderId: uniqueOrderId,
        items: orderData.items,
        orderTime: new Date().toISOString(),
      };

      console.log('모의 주문 응답:', mockResponse);
      onOrderComplete(mockResponse);
    } catch (error) {
      console.error('모의 주문 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <div className='order-container'>
      <form onSubmit={handleSubmit}>
        <div>
          <label>주문 상품 목록:</label>
          <ul>
            {orderData.items?.length > 0 ? (
              orderData.items.map((item, index) => (
                <li key={index}>
                  <div>상품 이름: {item.productId}</div>
                  <div>수량: {item.count}</div>
                </li>
              ))
            ) : (
              <p>선택된 상품이 없습니다.</p>
            )}
          </ul>
        </div>
        <button type='submit'>주문 완료</button>
      </form>
    </div>
  );
};

export default OrderComponent;
