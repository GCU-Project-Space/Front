import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

const OrderComponent = ({ initialOrderData, onOrderComplete }) => {
  const defaultOrderData = {
    items: [{ productId: 'EXAMPLE-001', count: 1 }],
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
      const uniqueOrderId = `ORDER-${uuidv4()}`;

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
    <Container>
      <Form onSubmit={handleSubmit}>
        <Section>
          <Label>주문 상품 목록</Label>
          <ItemList>
            {orderData.items?.length > 0 ? (
              orderData.items.map((item, index) => (
                <Item key={index}>
                  <ItemText>상품   {item.productId}</ItemText>
                  <ItemText>수량   {item.count}</ItemText>
                </Item>
              ))
            ) : (
              <ItemText>선택된 상품이 없습니다.</ItemText>
            )}
          </ItemList>
        </Section>
        <SubmitButton type="submit">주문 완료</SubmitButton>
      </Form>
    </Container>
  );
};

export default OrderComponent;

const Container = styled.div`
  border: 1.5px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 15px 20px 20px 20px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div``;

const Label = styled.label`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
`;

const ItemList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Item = styled.li`
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const ItemText = styled.div`
  font-size: 1.1rem;
`;

const SubmitButton = styled.button`
  background-color: #1f3993;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
