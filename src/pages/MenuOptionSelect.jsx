import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const MenuOptionSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuName = location.state?.menuName || "메뉴 이름 없음";

  const [menuInfo, setMenuInfo] = useState({
    description: "[00g] 메뉴의 상세설명을 적어주세요.",
    basePrice: 0,
    options: [
      { name: "OOO 추가", price: 0 },
      { name: "OOO 추가", price: 0 },
    ],
  });

  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://서버주소/api/v1/menus?name=${menuName}`)
      .then((res) => {
        setMenuInfo(res.data);
      })
      .catch((err) => {
        console.error("메뉴 정보 불러오기 실패:", err);
      });
  }, [menuName]);

  const toggleOption = (index) => {
    setSelectedOptions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const totalPrice = menuInfo.basePrice +
    selectedOptions.reduce((sum, idx) => sum + (menuInfo.options[idx]?.price || 0), 0);

  // 내가 담은 메뉴만 보여주는 주문 내역으로 이동
  const handleAddClick = () => {
    const selectedOptionDetails = selectedOptions.map(i => menuInfo.options[i]);

    const orderData = {
      menuName,
      basePrice: menuInfo.basePrice,
      options: selectedOptionDetails,
      amount: totalPrice,
    };

    navigate("/order", {
      state: {
        orderData,
        directCheckout: true,
        from: "menu-option"
      }
    });
  };

  //  전체 팀원 담은 메뉴 보여주는 주문 내역으로 이동
  const handleCartClick = () => {
    navigate("/order", {
      state: {
        directCheckout: false,
        from: "menu-option"
      }
    });
  };

  return (
    <AppWrapper>
      <FixedLayout>
        <Header title="메뉴선택" />
        <BackButton onClick={() => navigate(-1)}>← 메뉴선택</BackButton>

        <Main>
          <MenuBox>
            <MenuTitle>{menuName}</MenuTitle>
            <MenuDescription>{menuInfo.description}</MenuDescription>
            <hr style={{ border: "none", borderTop: "1.5px solid #ccc", margin: "0px 0px 10px 0px" }} />
            <PriceRow>
              <PriceLabel>가격</PriceLabel>
              <PriceValue>{menuInfo.basePrice.toLocaleString()}원</PriceValue>
            </PriceRow>
          </MenuBox>

          <OptionSection>
            <OptionTitle>옵션</OptionTitle>
            {menuInfo.options.map((opt, idx) => (
              <OptionRow key={idx}>
                <Checkbox
                  id={`option-${idx}`}
                  checked={selectedOptions.includes(idx)}
                  onChange={() => toggleOption(idx)}
                />
                <label htmlFor={`option-${idx}`}>{opt.name}</label>
                <OptionPrice>+ {opt.price.toLocaleString()}원</OptionPrice>
              </OptionRow>
            ))}
          </OptionSection>
        </Main>

        <BottomWrapper>
          <AddButton onClick={handleAddClick}>
            {totalPrice.toLocaleString()}원 담기
          </AddButton>
          <CartIcon onClick={handleCartClick} />
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
  color: #1f3993;
`;
