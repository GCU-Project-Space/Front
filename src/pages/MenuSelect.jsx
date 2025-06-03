import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { storeService } from "../api/service";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import Header from "../components/Header";

const MenuSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get('storeId');

  const defaultStore = {
    name: "가게 이름 없음",
    location: "주소 없음",
    currentAmount: 0,
    minOrderPrice: 0,
    closeIn: "정보 없음",
  };
  
  const [store, setStore] = useState(defaultStore);
  const [menus, setMenus] = useState([]);

  const fetchData = async () => {
    try {
      // Store 정보 가져오기
      const storeResponse = await storeService.getStore(storeId);
      if (storeResponse.success === true) {
        console.log("Store 정보 가져오기 성공!");
        
        // Store 데이터 파싱
        const storeData = storeResponse.data;
        const parsedStore = {
          id: storeData.id,
          name: storeData.name,
          phone: storeData.phone,
          location: storeData.location,
          description: storeData.description,
          openHours: storeData.openHours,
          minOrderPrice: storeData.minOrderPrice,
          category: storeData.category,
          currentAmount: 0, // 기본값 추가
          closeIn: "정보 없음" // 기본값 추가
        };
        
        // store 상태에 저장
        setStore(parsedStore);
        console.log("Store 데이터 저장 완료:", parsedStore);
        
      } else {
        alert("Store 정보 불러오기 실패");
        return; // Store 정보가 없으면 메뉴도 가져오지 않음
      }

      // Menu 정보 가져오기
      const menuResponse = await storeService.getMenus(storeId);
      if (menuResponse.success === true) { // success -> isSuccess
        console.log("Menu 정보 가져오기 성공!");
        
        // Menu 데이터 파싱
        const menuList = menuResponse.data || [];
        const parsedMenus = menuList.map(menu => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          price: menu.price,
          discountRate: menu.discountRate,
          discountedPrice: menu.discountedPrice,
          imageUrl: menu.imageUrl,
          options: menu.options || []
        }));
        
        // menus 상태에 저장
        setMenus(parsedMenus);
        console.log(`Menu 데이터 저장 완료: ${parsedMenus.length}개 메뉴`);
        
      } else {
        alert("Menu 정보 불러오기 실패");
        setMenus([]); // 실패 시 빈 배열로 설정
      }

    } catch (error) {
      console.error('데이터 가져오기 중 오류:', error);
      alert('데이터를 가져오는 중 오류가 발생했습니다.');
      setStore(defaultStore); // null 대신 defaultStore
      setMenus([]);
    }
  };

  useEffect(() => {
    if (storeId) { // storeId가 있을 때만 실행
      fetchData();
    }
  }, [storeId]);

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
            <StoreTitle>📍 [{store?.name || "가게 이름 없음"}]</StoreTitle>
            <StoreInfo>{store?.location || "주소 없음"}</StoreInfo>
            <StorePrice>
              <span className="current">{(store?.currentAmount || 0).toLocaleString()}</span> / {(store?.minOrderPrice || 0).toLocaleString()}
            </StorePrice>
            <StoreTime>{store?.closeIn || "정보 없음"}</StoreTime>
          </StoreBox>

          <SectionTitle>메뉴 목록</SectionTitle>
          <MenuListContainer>
            {menus && menus.length > 0 ? (
              menus.map((menu, i) => (
                <MenuItem 
                  key={menu.id || `menu-${i}`} 
                  onClick={() => navigate('/menu-option', { state: { menu: menu, store: store } })}
                >
                  <MenuContent>
                    <MenuName>{menu.name}</MenuName>
                    <MenuDescription>{menu.description}</MenuDescription>
                    <MenuPriceInfo>
                      {menu.discountRate > 0 ? (
                        <>
                          <OriginalPrice>{menu.price.toLocaleString()}원</OriginalPrice>
                          <DiscountPrice>{menu.discountedPrice.toLocaleString()}원</DiscountPrice>
                          <DiscountBadge>{menu.discountRate}% 할인</DiscountBadge>
                        </>
                      ) : (
                        <MenuPrice>{menu.price.toLocaleString()}원</MenuPrice>
                      )}
                    </MenuPriceInfo>
                  </MenuContent>
                  {menu.imageUrl && (
                    <MenuImage src={menu.imageUrl} alt={menu.name} />
                  )}
                  <MenuArrow>›</MenuArrow>
                </MenuItem>
              ))
            ) : (
              <EmptyMessage>등록된 메뉴가 없습니다.</EmptyMessage>
            )}
          </MenuListContainer>
        </Main>

        {/* <BottomWrapper>
          <PayButton onClick={handleMyOrderClick}>결제하기</PayButton>
          <CartIcon onClick={handleCartClick} />
        </BottomWrapper> */}

        <BottomNav />
      </FixedLayout>
    </AppWrapper>
  );
}

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
  margin: 16px 0 16px 0;
`;

const MenuListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    background: #e9ecef;
  }
`;

const MenuContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const MenuDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.3;
  margin-bottom: 8px;
`;

const MenuPriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MenuPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f3993;
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #e74c3c;
`;

const DiscountBadge = styled.span`
  background: #e74c3c;
  color: white;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
`;

const MenuImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin: 0 12px;
  flex-shrink: 0;
`;

const MenuArrow = styled.div`
  font-size: 1.5rem;
  color: #ccc;
  font-weight: 300;
  flex-shrink: 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 1rem;
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