import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import Header from "../components/Header";

const MenuOptionSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 이전 화면에서 전달받은 정보
  const store = location.state?.store || {};
  const menu = location.state?.menu || {};
  const menuName = menu.name || "메뉴 이름 없음";

  const [menuInfo, setMenuInfo] = useState({
    id: menu.id || 0,
    name: menu.name || "메뉴 이름 없음",
    description: menu.description || "메뉴 설명이 없습니다.",
    basePrice: menu.price || 0,
    discountRate: menu.discountRate || 0,
    discountedPrice: menu.discountedPrice || 0,
    imageUrl: menu.imageUrl || "",
    options: menu.options || null // null 허용
  });

  const [storeInfo, setStoreInfo] = useState({
    id: store.id || 0,
    name: store.name || "가게명 없음",
    location: store.location || "위치 정보 없음",
    category: store.category || "기타"
  });

  const [selectedOptions, setSelectedOptions] = useState([]);

  // 메뉴 정보가 전달되었다면 fetchData 불필요, 하지만 추가 데이터가 필요한 경우를 위해 유지
  const fetchData = async () => {
    // 메뉴 상세 정보가 필요한 경우 여기서 API 호출
    // 현재는 이전 화면에서 모든 정보를 받아오므로 별도 처리 불필요
    console.log("메뉴 정보:", menuInfo);
    console.log("스토어 정보:", storeInfo);
  };

  useEffect(() => {
    // 메뉴 정보가 전달되었는지 확인
    if (menu && menu.id) {
      setMenuInfo({
        id: menu.id,
        name: menu.name || "메뉴 이름 없음",
        description: menu.description || "메뉴 설명이 없습니다.",
        basePrice: menu.discountRate > 0 ? menu.discountedPrice : menu.price,
        originalPrice: menu.price,
        discountRate: menu.discountRate || 0,
        discountedPrice: menu.discountedPrice || 0,
        imageUrl: menu.imageUrl || "",
        options: menu.options || null // null 허용
      });
    }

    // 스토어 정보 설정
    if (store && store.id) {
      setStoreInfo({
        id: store.id,
        name: store.name || "가게명 없음",
        location: store.location || "위치 정보 없음",
        category: store.category || "기타"
      });
    }

    fetchData();
  }, []);

  const toggleOption = (groupIndex, optionIndex) => {
    // options가 null이면 아무것도 하지 않음
    if (!menuInfo.options || !Array.isArray(menuInfo.options)) {
      return;
    }

    const optionKey = `${groupIndex}-${optionIndex}`;
    setSelectedOptions((prev) => {
      const exists = prev.find(item => item.key === optionKey);
      if (exists) {
        return prev.filter(item => item.key !== optionKey);
      } else {
        const optionGroup = menuInfo.options[groupIndex];
        if (!optionGroup) return prev;
        
        const option = Array.isArray(optionGroup) ? optionGroup[optionIndex] : optionGroup;
        if (!option) return prev;
        
        return [...prev, {
          key: optionKey,
          groupIndex,
          optionIndex,
          id: option.id || `${groupIndex}-${optionIndex}`, // 실제 optionId 사용
          name: option.name,
          price: option.price || 0
        }];
      }
    });
  };

  // 최종 가격 계산 (할인 적용 + 옵션 가격)
  const optionsPrice = selectedOptions.reduce((sum, option) => sum + (option.price || 0), 0);
  const totalPrice = menuInfo.basePrice + optionsPrice;

  // 내가 담은 메뉴만 보여주는 주문 내역으로 이동
  const handleAddClick = () => {
    // API 요청 형식에 맞는 메뉴 데이터 구성
    const menuData = {
      menuId: menuInfo.id,
      menuName: menuInfo.name,
      basePrice: menuInfo.basePrice,
      count: 1, // 기본 수량 1개
      options: selectedOptions.map(option => ({
        optionId: option.id || parseInt(option.key.split('-').join('')), // 실제 optionId 또는 임시 ID
        optionName: option.name,
        price: option.price
      }))
    };

    // 주문 생성을 위한 전체 데이터 (실제 API 호출 시 사용)
    const orderRequestData = {
      userId: sessionStorage.getItem("userId"),
      storeId: storeInfo.id,
      title: `${storeInfo.name}에서 같이 주문해요!`,
      description: `${sessionStorage.getItem("nickname")}님의 모집방`,
      deadlineTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1시간 후
      category: storeInfo.category || "INDIVIDUAL",
      menus: [menuData]
    };

    // 화면 이동용 데이터 (기존 정보 + 새로운 구조)
    const orderData = {
      // 기존 화면 표시용 데이터
      menuId: menuInfo.id,
      menuName: menuInfo.name,
      basePrice: menuInfo.basePrice,
      originalPrice: menuInfo.originalPrice,
      discountRate: menuInfo.discountRate,
      selectedOptions: selectedOptions,
      totalPrice: totalPrice,
      imageUrl: menuInfo.imageUrl,
      count: 1,
      
      // 스토어 정보
      storeId: storeInfo.id,
      storeName: storeInfo.name,
      storeLocation: storeInfo.location,
      storeCategory: storeInfo.category,
      
      // API 요청용 데이터
      apiRequestData: orderRequestData,
      menuData: menuData
    };

    navigate("/order", {
      state: {
        orderData,
        store: storeInfo,
        directCheckout: true,
        from: "menu-option"
      }
    });
  };

  // 전체 팀원 담은 메뉴 보여주는 주문 내역으로 이동
  const handleCartClick = () => {
    navigate("/order", {
      state: {
        store: storeInfo,
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
          {/* 스토어 정보 표시 */}
          <StoreInfoBox>
            <StoreName>📍 {storeInfo.name}</StoreName>
            <StoreLocation>{storeInfo.location}</StoreLocation>
          </StoreInfoBox>

          <MenuBox>
            {menuInfo.imageUrl && (
              <MenuImage src={menuInfo.imageUrl} alt={menuInfo.name} />
            )}
            <MenuTitle>{menuInfo.name}</MenuTitle>
            <MenuDescription>{menuInfo.description}</MenuDescription>
            <hr style={{ border: "none", borderTop: "1.5px solid #ccc", margin: "10px 0" }} />
            
            <PriceSection>
              {menuInfo.discountRate > 0 ? (
                <>
                  <PriceRow>
                    <PriceLabel>정가</PriceLabel>
                    <OriginalPrice>{menuInfo.originalPrice?.toLocaleString()}원</OriginalPrice>
                  </PriceRow>
                  <PriceRow>
                    <PriceLabel>할인가 ({menuInfo.discountRate}% 할인)</PriceLabel>
                    <DiscountPrice>{menuInfo.basePrice.toLocaleString()}원</DiscountPrice>
                  </PriceRow>
                </>
              ) : (
                <PriceRow>
                  <PriceLabel>가격</PriceLabel>
                  <PriceValue>{menuInfo.basePrice.toLocaleString()}원</PriceValue>
                </PriceRow>
              )}
            </PriceSection>
          </MenuBox>

          {menuInfo.options && Array.isArray(menuInfo.options) && menuInfo.options.length > 0 && (
            <OptionSection>
              <OptionTitle>옵션</OptionTitle>
              {menuInfo.options.map((optionGroup, groupIndex) => (
                <OptionGroup key={groupIndex}>
                  {Array.isArray(optionGroup) ? (
                    // 배열 형태의 옵션 그룹
                    optionGroup.map((option, optionIndex) => {
                      const optionKey = `${groupIndex}-${optionIndex}`;
                      const isSelected = selectedOptions.some(item => item.key === optionKey);
                      
                      return (
                        <OptionRow key={optionKey}>
                          <Checkbox
                            id={`option-${optionKey}`}
                            checked={isSelected}
                            onChange={() => toggleOption(groupIndex, optionIndex)}
                          />
                          <label htmlFor={`option-${optionKey}`}>{option.name || '옵션명 없음'}</label>
                          <OptionPrice>+ {(option.price || 0).toLocaleString()}원</OptionPrice>
                        </OptionRow>
                      );
                    })
                  ) : optionGroup && typeof optionGroup === 'object' ? (
                    // 단일 옵션 객체인 경우
                    <OptionRow key={`single-${groupIndex}`}>
                      <Checkbox
                        id={`option-single-${groupIndex}`}
                        checked={selectedOptions.some(item => item.key === `${groupIndex}-0`)}
                        onChange={() => toggleOption(groupIndex, 0)}
                      />
                      <label htmlFor={`option-single-${groupIndex}`}>{optionGroup.name || '옵션명 없음'}</label>
                      <OptionPrice>+ {(optionGroup.price || 0).toLocaleString()}원</OptionPrice>
                    </OptionRow>
                  ) : null}
                </OptionGroup>
              ))}
            </OptionSection>
          )}
        </Main>

        <BottomWrapper>
          <AddButton onClick={handleAddClick}>
            {totalPrice.toLocaleString()}원 주문하기
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

const StoreInfoBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

const StoreName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const StoreLocation = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const MenuBox = styled.div`
  border: 1.5px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
`;

const MenuImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 15px;
`;

const MenuTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const MenuDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 12px;
  color: #666;
  line-height: 1.4;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.1rem;
`;

const PriceLabel = styled.span`
  color: black;
`;

const PriceValue = styled.span`
  color: #1f3993;
`;

const OriginalPrice = styled.span`
  color: #999;
  text-decoration: line-through;
`;

const DiscountPrice = styled.span`
  color: #e74c3c;
  font-weight: bold;
`;

const OptionSection = styled.div`
  margin-top: 20px;
`;

const OptionGroup = styled.div`
  margin-bottom: 15px;
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
  margin-bottom: 12px;
  padding: 8px 0;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  accent-color: #1f3993;
  cursor: pointer;
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