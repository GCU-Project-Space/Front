import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import { FaShoppingCart } from "react-icons/fa";

const MenuSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultStore = {
    name: "가게 이름 없음",
    location: "주소 없음",
    currentAmount: 0,
    minOrder: 0,
    closeIn: "정보 없음",
  };
  const store = { ...defaultStore, ...(location.state || {}) };

  const [mainMenus, setMainMenus] = useState(["대표메뉴 A", "대표메뉴 B", "대표메뉴 C"]);
  const [sideMenus, setSideMenus] = useState(["사이드메뉴 A", "사이드메뉴 B", "사이드메뉴 C"]);

  useEffect(() => {
    axios.get("http://서버주소/api/v1/menus")
      .then(res => {
        setMainMenus(res.data.mainMenus || []);
        setSideMenus(res.data.sideMenus || []);
      })
      .catch(err => {
        console.error("메뉴 불러오기 실패:", err);
      });
  }, []);

  // 내가 담은 메뉴만 결제하러 가기
  const handleMyOrderClick = () => {
    navigate("/order", {
      state: {
        directCheckout: true,  // 내 메뉴만
        from: "menu-select"
      }
    });
  };

  // 팀원들 메뉴 포함 전체 주문 확인
  const handleCartClick = () => {
    navigate("/order", {
      state: {
        directCheckout: false,  // 전체 주문 내역
        from: "menu-select"
      }
    });
  };

  return (
    <AppWrapper>
      <FixedLayout>
        <Header title="가게목록" />
        <BackButton onClick={() => navigate(-1)}>← 가게 목록</BackButton>

        <Main>
          <StoreBox>
            <StoreTitle>📍 [{store.name}]</StoreTitle>
            <StoreInfo>{store.location}</StoreInfo>
            <StorePrice>
              <span className="current">{store.currentAmount.toLocaleString()}</span> / {store.minOrder.toLocaleString()}
            </StorePrice>
            <StoreTime>{store.closeIn}</StoreTime>
          </StoreBox>

          <SectionTitle>대표 메뉴 ➝</SectionTitle>
          <TagScrollContainer>
            {mainMenus.map((menu, i) => (
              <Tag key={`main-${i}`} onClick={() => navigate('/menu-option', { state: { menuName: menu } })}>
                {menu}
              </Tag>
            ))}
          </TagScrollContainer>

          <SectionTitle>사이드 메뉴 ➝</SectionTitle>
          <TagScrollContainer>
            {sideMenus.map((menu, i) => (
              <Tag key={`side-${i}`} onClick={() => navigate('/menu-option', { state: { menuName: menu } })}>
                {menu}
              </Tag>
            ))}
          </TagScrollContainer>
        </Main>

        <BottomWrapper>
          <PayButton onClick={handleMyOrderClick}>결제하기</PayButton>
          <CartIcon onClick={handleCartClick} />
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
  border: 1.5px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 10px 20px 10px 0px;
  margin-bottom: 20px;
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
  color: #1f3993;
`;
