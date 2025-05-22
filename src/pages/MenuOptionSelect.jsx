import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation } from "react-router-dom";


const MenuOptionSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuName = location.state?.menuName || "메뉴 이름 없음";

  return (
    <AppWrapper>
      <FixedLayout>
        <Header title="메뉴선택" />
        <BackButton onClick={() => navigate(-1)}>← 메뉴선택</BackButton>

        <Main>
          <MenuBox>
          <MenuTitle>{menuName}</MenuTitle>
            <MenuDescription>
              [150g] 콜팝치킨에서 음료를 뺀 실속형 콜팝치킨. 치킨만 원하시는 분을 위한 미니 콜팝
            </MenuDescription>
            <hr style={{ border: 'none', borderTop: '1.5px solid #ccc',margin: '0px 0px 10px 0px'}}/>
            <PriceRow>
              <PriceLabel>가격</PriceLabel>
              <PriceValue>5,000원</PriceValue>
            </PriceRow>
          </MenuBox>

          <OptionSection>
            <OptionTitle>옵션</OptionTitle>
            <OptionRow>
            <Checkbox id="option1" />
              <label htmlFor="option1">뿌링뿌링소스 추가</label>
              <OptionPrice>+ 2,500원</OptionPrice>
            </OptionRow>
            <OptionRow>
            <Checkbox id="option1" />
              <label htmlFor="option1">치킨무</label>
              <OptionPrice>+ 1,000원</OptionPrice>
            </OptionRow>
          </OptionSection>
        </Main>

        <BottomWrapper>
          <AddButton>5,000원 담기</AddButton>
          <CartIcon />
        </BottomWrapper>

        <BottomNav />
      </FixedLayout>
    </AppWrapper>
  );
};

export default MenuOptionSelect;

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
  padding: 0 20px;
  overflow-y: auto;
`;

const MenuBox = styled.div`
  border: 1.5px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 0px 20px 20px 20px;
  margin-bottom: 20px;
`;

const MenuTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 15px;
`;

const MenuDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 12px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.1rem;
  color: #1f3993;
`;

const PriceLabel = styled.span`
  color: black;
`;

const PriceValue = styled.span``;

const OptionSection = styled.div`
  margin-top: 20px;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  accent-color: #1f3993;  
  cursor: pointer;
`;

const OptionTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 12px;
  font-weight: 700;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  margin-bottom: 17px;
`;

const OptionPrice = styled.span`
  margin-left: auto;
  color: #1f3993;
  font-weight: 600;
  font-size: 1.1rem;
`;

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  gap: 12px;
`;

const AddButton = styled.button`
  flex: 1;
  background: #1f3993;
  color: white;
  font-size: 1.2rem;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
`;

const CartIcon = styled(FaShoppingCart)`
  font-size: 1.6rem;
  color:#1f3993;
`;
