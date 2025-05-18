import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";

const MenuSelect = () => {
  const navigate = useNavigate();

  return (
    <AppWrapper>
      <FixedLayout>
        <Header title="가게목록" />
        <BackButton onClick={() => navigate(-1)}>← 가게목록</BackButton>

        <Main>
          <StoreBox>
            <StoreTitle>📍 [BHC - 가천대점]</StoreTitle>
            <StoreInfo>성남시 중원구 태평동</StoreInfo>
            <StorePrice>
              <span className="current">17,000</span> / 29,000
            </StorePrice>
            <StoreTime>30분 후 마감</StoreTime>
          </StoreBox>

          <SectionTitle>대표 메뉴 ➝</SectionTitle>
          <TagScrollContainer>
            <Tag>뿌링클</Tag>
            <Tag>콰삭킹</Tag>
            <Tag>후라이드</Tag>
            <Tag>양념</Tag>
            <Tag>간장</Tag>
            <Tag>마늘</Tag>
          </TagScrollContainer>

          <SectionTitle>사이드 메뉴 ➝</SectionTitle>
          <TagScrollContainer>
            <Tag>치즈볼</Tag>
            <Tag>뿌링소떡</Tag>
            <Tag>감자튀김</Tag>
            <Tag>콜라</Tag>
            <Tag>사이다</Tag>
          </TagScrollContainer>
        </Main>

        <BottomWrapper>
          <PayButton>결제하기</PayButton>
          <CartIcon />
        </BottomWrapper>

        <BottomNav />
      </FixedLayout>
    </AppWrapper>
  );
};

export default MenuSelect;
  
const AppWrapper = styled.div`
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.div`
  padding: 13px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const Main = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 20px;
`;

const StoreBox = styled.div`
  border: 1.5px solid;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 8px;
  margin: 0 0 20px 0;
  text-align: center;
`;

const StoreTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0px;
`;

const StoreInfo = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StorePrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 2px 0;
  .current {
    color: #1f3993;
    font-weight: bold;
  }
`;

const StoreTime = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  margin: 16px 0 8px 0;
`;

const TagScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 10px;
  padding-bottom: 8px;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tag = styled.div`
  background: #d9d9d9;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 1.2rem;
  color: #000;
  flex-shrink: 0;
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  gap: 12px;
`;

const PayButton = styled.button`
  flex: 1;
  background: #1f3993;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 12px;
  border: none;
  border-radius: 8px;
`;

const CartIcon = styled(FaShoppingCart)`
  font-size: 1.6rem;
  color:#1f3993;
`;
