import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { recruitmentService } from '../api/service.js';
import BottomNav from "../components/BottomNav.jsx";
import FixedLayout from "../components/FixedLayout.jsx";
import Header from "../components/Header.jsx";
import { CheckOutComponent } from '../components/TossCheckOutComponent.jsx';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialOrderData = location.state?.orderData;
  const directCheckout = location.state?.directCheckout || false;
  const storeInfo = location.state?.store || {};
  const from = location.state?.from || "unknown";

  const [orderData, setOrderData] = useState(initialOrderData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  
  // 모집글 정보 입력 상태
  const [showRecruitmentForm, setShowRecruitmentForm] = useState(false);
  const [recruitmentInfo, setRecruitmentInfo] = useState({
    title: "",
    description: "",
    location: "제 2기숙사",
    deadlineHours: 1 // 기본 1시간
  });

  const recruitmentId = sessionStorage.getItem("recruitmentId");
  const isJoiningRecruitment = recruitmentId !== null;

  useEffect(() => {
    console.log('주문 페이지 진입:', {
      orderData: initialOrderData,
      directCheckout,
      from,
      store: storeInfo,
      recruitmentId
    });

    // 모집 생성 시 기본값 설정
    if (!isJoiningRecruitment) {
      setRecruitmentInfo({
        title: `${sessionStorage.getItem("nickname")}님의 ${orderData.storeName} 공동주문`,
        description: `${orderData.storeName}에서 함께 주문하실 분 모집합니다!`,
        deadlineHours: 1 // 기본 1시간
      });
    }
  }, []);

  const updateCount = (newCount) => {
    if (newCount < 1) return;
    
    const updatedData = {
      ...orderData,
      count: newCount,
      totalPrice: (orderData.basePrice + getOptionsPrice()) * newCount
    };
    setOrderData(updatedData);
  };

  const getOptionsPrice = () => {
    return orderData.selectedOptions?.reduce((sum, option) => sum + (option.price || 0), 0) || 0;
  };

  // 주문 데이터 생성
  const createOrderRequestData = () => {
    const menuData = {
      menuId: orderData.menuId,
      menuName: orderData.menuName,
      basePrice: orderData.basePrice,
      count: orderData.count,
      options: orderData.selectedOptions?.map(option => ({
        optionId: option.id,
        optionName: option.name,
        price: option.price
      })) || []
    };

    if (isJoiningRecruitment) {
      // 모집 참가 요청 데이터
      return {
        groupId: parseInt(recruitmentId),
        userId: parseInt(sessionStorage.getItem("userId")),
        storeId: orderData.storeId,
        menus: [menuData]
      };
    } else {
      // 모집 생성 요청 데이터
      const deadlineTime = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
      deadlineTime.setHours(deadlineTime.getHours() + recruitmentInfo.deadlineHours);
      
      return {
        leaderId: parseInt(sessionStorage.getItem("userId")) || 1,
        storeId: orderData.storeId,
        title: recruitmentInfo.title,
        description: recruitmentInfo.description,
        deadlineTime: deadlineTime.toISOString(),
        category: orderData.storeCategory || "FAST_FOOD",
        groupOrder: [{
          userId: parseInt(sessionStorage.getItem("userId")) || 1,
          storeId: orderData.storeId,
          menus: [menuData]
        }]
      };
    }
  };

  // 주문 완료 처리
  const handleOrderSubmit = async () => {
    // 모집 생성 시 필수 정보 검증
    if (!isJoiningRecruitment) {
      if (!recruitmentInfo.title.trim() || !recruitmentInfo.description.trim()) {
        alert('모집글 제목과 설명을 모두 입력해주세요.');
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      const requestData = createOrderRequestData();
      console.log('API 요청 데이터:', requestData);
      
      let response;
      if (isJoiningRecruitment) {
        response = await recruitmentService.joinRecruitment(recruitmentId, requestData);
      } else {
        response = await recruitmentService.createRecruitment(requestData);
      }

      console.log('API 응답:', response);
      
      if (response.success === true) {
        console.log(isJoiningRecruitment ? '모집 참가 완료!' : '모집 생성 완료!');
        
        // 응답에서 orderId와 groupId 저장
        const responseData = response.data;
        const userOrder = responseData.orders?.find(order => 
          order.userId == parseInt(sessionStorage.getItem("userId"))
        );
        
        if (userOrder) {
          sessionStorage.setItem("orderId", userOrder.orderId.toString());
        }
        sessionStorage.setItem("groupId", responseData.groupId.toString());
        localStorage.setItem("groupId", responseData.groupId.toString());
        
        // 결제용 데이터 준비
        const paymentData = {
          data: {
            orderId: userOrder.orderId,
            amount: orderData.totalPrice,
            orderName: `${orderData.storeName} - ${orderData.menuName}${orderData.count > 1 ? ` 외 ${orderData.count - 1}건` : ''}`,
            customerEmail: sessionStorage.getItem("email") || 'customer@example.com',
            customerName: sessionStorage.getItem("nickname") || '고객',
            customerMobilePhone: sessionStorage.getItem("phoneNumber") || '01012345678'
          }
        };
        
        setCheckoutData(paymentData);
        setShowCheckout(true);
        
      } else {
        console.log('요청 처리 중 문제 발생');
        alert(`${isJoiningRecruitment ? '모집 참가' : '모집 생성'}에 실패했습니다: ${response.message || '알 수 없는 오류'}`);
      }

    } catch (error) {
      console.error('요청 처리 실패:', error);
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackFromCheckout = () => {
    setShowCheckout(false);
    setCheckoutData(null);
  };

  // 결제 화면
  if (showCheckout && checkoutData) {
    return (
      <FixedLayout>
        <Header title="결제하기" />
        <BackButton onClick={handleBackFromCheckout}>← 주문으로 돌아가기</BackButton>
        
        <MainContent>
          <CheckoutSummary>
            <SectionTitle>주문 요약</SectionTitle>
            <SummaryCard>
              <SummaryRow>
                <SummaryLabel>가게</SummaryLabel>
                <SummaryValue>{orderData.storeName}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>메뉴</SummaryLabel>
                <SummaryValue>{orderData.menuName}</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>수량</SummaryLabel>
                <SummaryValue>{orderData.count}개</SummaryValue>
              </SummaryRow>
              <Divider />
              <SummaryRow total>
                <SummaryLabel>결제 금액</SummaryLabel>
                <TotalPrice>{orderData.totalPrice.toLocaleString()}원</TotalPrice>
              </SummaryRow>
            </SummaryCard>
          </CheckoutSummary>

          <CheckOutComponent orderData={checkoutData} />
        </MainContent>

        <BottomNav />
      </FixedLayout>
    );
  }

  // 주문 화면
  return (
    <FixedLayout>
      <Header title={isJoiningRecruitment ? "모집 참가" : "모집 생성"} />
      <BackButton onClick={() => navigate(-1)}>← 이전으로</BackButton>

      <MainContent>
        {/* 모집글 정보 (신규 생성 시에만) */}
        {!isJoiningRecruitment && (
          <RecruitmentSection>
            <SectionTitle>모집글 정보</SectionTitle>
            <RecruitmentCard>
              <InputGroup>
                <Label>제목</Label>
                <Input
                  value={recruitmentInfo.title}
                  onChange={(e) => setRecruitmentInfo({...recruitmentInfo, title: e.target.value})}
                  placeholder="모집글 제목을 입력하세요"
                />
              </InputGroup>
              
              <InputGroup>
                <Label>설명</Label>
                <TextArea
                  value={recruitmentInfo.description}
                  onChange={(e) => setRecruitmentInfo({...recruitmentInfo, description: e.target.value})}
                  placeholder="모집글 설명을 입력하세요"
                  rows={3}
                />
              </InputGroup>
              
              <InputGroup>
                <Label>장소</Label>
                <Input
                  value={recruitmentInfo.location}
                  onChange={(e) => setRecruitmentInfo({...recruitmentInfo, location: e.target.value})}
                  placeholder="배달 받을 장소를 입력하세요"
                />
              </InputGroup>

              <InputGroup>
                <Label>마감시간</Label>
                <DeadlineOptions>
                  <DeadlineOption 
                    selected={recruitmentInfo.deadlineHours === 0.5}
                    onClick={() => setRecruitmentInfo({...recruitmentInfo, deadlineHours: 0.5})}
                  >
                    30분 후
                  </DeadlineOption>
                  <DeadlineOption 
                    selected={recruitmentInfo.deadlineHours === 1}
                    onClick={() => setRecruitmentInfo({...recruitmentInfo, deadlineHours: 1})}
                  >
                    1시간 후
                  </DeadlineOption>
                  <DeadlineOption 
                    selected={recruitmentInfo.deadlineHours === 2}
                    onClick={() => setRecruitmentInfo({...recruitmentInfo, deadlineHours: 2})}
                  >
                    2시간 후
                  </DeadlineOption>
                </DeadlineOptions>
              </InputGroup>
            </RecruitmentCard>
          </RecruitmentSection>
        )}

        {/* 스토어 정보 */}
        <StoreSection>
          <SectionTitle>주문 정보</SectionTitle>
          <StoreCard>
            <StoreName>📍 {orderData.storeName || storeInfo.name || "가게명 없음"}</StoreName>
            <StoreLocation>{orderData.storeLocation || storeInfo.location || "위치 정보 없음"}</StoreLocation>
          </StoreCard>
        </StoreSection>

        {/* 메뉴 정보 */}
        <MenuSection>
          <SectionTitle>주문 메뉴</SectionTitle>
          <MenuCard>
            {orderData.imageUrl && (
              <MenuImage src={orderData.imageUrl} alt={orderData.menuName} />
            )}
            <MenuInfo>
              <MenuName>{orderData.menuName}</MenuName>
              
              <PriceSection>
                {orderData.discountRate > 0 ? (
                  <>
                    <OriginalPrice>{orderData.originalPrice?.toLocaleString()}원</OriginalPrice>
                    <DiscountPrice>{orderData.basePrice.toLocaleString()}원</DiscountPrice>
                    <DiscountBadge>{orderData.discountRate}% 할인</DiscountBadge>
                  </>
                ) : (
                  <MenuPrice>{orderData.basePrice.toLocaleString()}원</MenuPrice>
                )}
              </PriceSection>

              <CountSection>
                <CountLabel>수량</CountLabel>
                <CountControls>
                  <CountButton onClick={() => updateCount(orderData.count - 1)}>-</CountButton>
                  <CountDisplay>{orderData.count}</CountDisplay>
                  <CountButton onClick={() => updateCount(orderData.count + 1)}>+</CountButton>
                </CountControls>
              </CountSection>
            </MenuInfo>
          </MenuCard>
        </MenuSection>

        {/* 선택한 옵션 */}
        {orderData.selectedOptions && orderData.selectedOptions.length > 0 && (
          <OptionsSection>
            <SectionTitle>선택한 옵션</SectionTitle>
            <OptionsCard>
              {orderData.selectedOptions.map((option, index) => (
                <OptionItem key={index}>
                  <OptionName>{option.name}</OptionName>
                  <OptionPrice>+{option.price.toLocaleString()}원</OptionPrice>
                </OptionItem>
              ))}
            </OptionsCard>
          </OptionsSection>
        )}

        {/* 주문 요약 */}
        <SummarySection>
          <SectionTitle>주문 요약</SectionTitle>
          <SummaryCard>
            <SummaryRow>
              <SummaryLabel>메뉴 가격</SummaryLabel>
              <SummaryValue>{orderData.basePrice.toLocaleString()}원</SummaryValue>
            </SummaryRow>
            
            {getOptionsPrice() > 0 && (
              <SummaryRow>
                <SummaryLabel>옵션 가격</SummaryLabel>
                <SummaryValue>+{getOptionsPrice().toLocaleString()}원</SummaryValue>
              </SummaryRow>
            )}
            
            <SummaryRow>
              <SummaryLabel>수량</SummaryLabel>
              <SummaryValue>x{orderData.count}</SummaryValue>
            </SummaryRow>
            
            <Divider />
            
            <SummaryRow total>
              <SummaryLabel>총 금액</SummaryLabel>
              <TotalPrice>{orderData.totalPrice.toLocaleString()}원</TotalPrice>
            </SummaryRow>
          </SummaryCard>
        </SummarySection>

        {/* 주문 버튼 */}
        <OrderButtonSection>
          <OrderButton 
            onClick={handleOrderSubmit} 
            disabled={isProcessing}
          >
            {isProcessing ? '처리 중...' : 
             isJoiningRecruitment ? 
             `${orderData.totalPrice.toLocaleString()}원 모집 참가하기` : 
             `${orderData.totalPrice.toLocaleString()}원 모집 생성하기`}
          </OrderButton>
        </OrderButtonSection>
      </MainContent>

      <BottomNav />
    </FixedLayout>
  );
};

export default OrderPage;

// 기존 스타일 + 추가 스타일
const MainContent = styled.main`
  flex: 1;
  padding: 0 20px;
  overflow-y: auto;
  font-family: 'Pretendard', sans-serif;
  margin-top: 16px;
  padding-bottom: 100px;
`;

const BackButton = styled.div`
  padding: 12px 20px 0px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;

const RecruitmentSection = styled.section`
  margin-bottom: 24px;
`;

const RecruitmentCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1f3993;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1f3993;
  }
`;

const StoreSection = styled.section`
  margin-bottom: 24px;
`;

const StoreCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
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

const MenuSection = styled.section`
  margin-bottom: 24px;
`;

const MenuCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const MenuImage = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 16px;
`;

const MenuInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MenuName = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MenuPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f3993;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountPrice = styled.span`
  font-size: 1.2rem;
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

const CountSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CountLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const CountControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CountButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f8f9fa;
  }

  &:active {
    background: #e9ecef;
  }
`;

const CountDisplay = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
`;

const OptionsSection = styled.section`
  margin-bottom: 24px;
`;

const OptionsCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
`;

const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }
`;

const OptionName = styled.span`
  font-size: 1rem;
  color: #333;
`;

const OptionPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1f3993;
`;

const SummarySection = styled.section`
  margin-bottom: 24px;
`;

const CheckoutSummary = styled.section`
  margin-bottom: 24px;
`;

const SummaryCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  
  ${props => props.total && `
    font-weight: 600;
    font-size: 1.1rem;
  `}
`;

const SummaryLabel = styled.span`
  color: #333;
`;

const SummaryValue = styled.span`
  color: #666;
`;

const TotalPrice = styled.span`
  color: #1f3993;
  font-weight: 700;
  font-size: 1.2rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e9ecef;
  margin: 12px 0;
`;

const OrderButtonSection = styled.section`
  margin-bottom: 20px;
`;

const DeadlineOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const DeadlineOption = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${props => props.selected ? '#1f3993' : '#ddd'};
  background: ${props => props.selected ? '#1f3993' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1f3993;
    background: ${props => props.selected ? '#1f3993' : '#f8f9fa'};
  }
`;

const OrderButton = styled.button`
  width: 100%;
  background: #1f3993;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1a2f7a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;