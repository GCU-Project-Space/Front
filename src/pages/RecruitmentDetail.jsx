import { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { orderService, recruitmentService, storeService, userService } from '../api/service';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import Header from '../components/Header';
import { CheckOutComponent } from '../components/TossCheckOutComponent';

const RecruitmentDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [recruitmentData, setRecruitmentData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkOutData, setCheckoutData] = useState(null);

  var recruitmentId = sessionStorage.getItem("groupId") || localStorage.getItem("groupId");
  const currentUserId = parseInt(sessionStorage.getItem("userId"));

  const fetchRecruitmentDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await recruitmentService.getRecruitment(recruitmentId);
      if (response.success === true) {
        console.log("모집글 상세 정보:", response.data);
        setRecruitmentData(response.data);
        // 가게 정보도 함께 가져오기
        if (response.data.storeId) {
          await fetchStoreData(response.data.storeId);
        }
      } else {
        console.log("모집글 정보를 불러올 수 없습니다.");
        setError(`모집글 정보를 불러올 수 없습니다: ${response.message || '알 수 없는 오류'}`);
      }
      
    } catch (error) {
      console.error('모집글 상세 정보 로딩 실패:', error);
      setError('모집글 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreData = async (storeId) => {
    try {
      // storeService가 없다면 recruitmentService 사용
      const response = await storeService.getStore(storeId);
      
      if (response.success === true) {
        console.log("가게 정보:", response.data);
        setStoreData(response.data);
      } else {
        console.warn('가게 정보를 불러올 수 없습니다:', response.message);
      }
    } catch (error) {
      console.warn('가게 정보 로딩 실패:', error);
      // 가게 정보는 필수가 아니므로 에러를 던지지 않음
    }
  };

  useEffect(() => {
    if (recruitmentId) {
      fetchRecruitmentDetail();
    } else {
      setError('모집글 ID가 없습니다.');
      setLoading(false);
    }
  }, [recruitmentId]);

  // 마감 시간까지 남은 시간 계산
  const getTimeRemaining = (deadlineTime) => {
    if (!deadlineTime) return '시간 정보 없음';
    
    try {
      const now = new Date();
      const deadline = new Date(deadlineTime);
      const diffMs = deadline - now;
      
      if (diffMs <= 0) return '마감됨';
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `${diffHours}시간 ${diffMinutes}분 남음`;
      } else {
        return `${diffMinutes}분 남음`;
      }
    } catch (error) {
      return '시간 계산 오류';
    }
  };

  // 상태별 색상
  const getStatusColor = (status) => {
    switch (status) {
      case 'RECRUITING': return '#28a745';
      case 'COMPLETED': return '#17a2b8';
      default: return '#ffc107';
    }
  };

  // 상태별 텍스트
  const getStatusText = (status) => {
    switch (status) {
      case 'RECRUITING': return '모집 중';
      case 'COMPLETED': return '주문 완료됨';
      default: return status || '알 수 없음';
    }
  };

  // 총 주문 금액 계산
  const getTotalAmount = () => {
    if (!recruitmentData?.orders) return 0;
    return recruitmentData.orders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  // 현재 사용자가 리더인지 확인
  const isLeader = recruitmentData?.leaderId === currentUserId;
  
  // 현재 사용자가 이미 참여했는지 확인
  const hasJoined = recruitmentData?.orders?.some(order => order.userId === currentUserId);

  // 현재 사용자의 주문 정보 가져오기
  const getCurrentUserOrder = () => {
    return recruitmentData?.orders?.find(order => order.userId === currentUserId);
  };

  // 현재 사용자가 결제했는지 확인
  const hasPaid = () => {
    const userOrder = getCurrentUserOrder();
    return userOrder?.status === 'PAID';
  };

  // 모든 주문이 결제되었는지 확인 (리더용 주문하기 버튼 활성화 조건)
  const allOrdersPaid = () => {
    if (!recruitmentData?.orders || recruitmentData.orders.length === 0) return false;
    return recruitmentData.orders.every(order => order.status === 'PAID');
  };

  // 최소 주문 금액을 충족했는지 확인
  const meetsMinimumOrder = () => {
    if (!storeData?.minOrderPrice) return true; // 최소 주문 금액 정보가 없으면 통과
    const totalAmount = getTotalAmount();
    return totalAmount >= storeData.minOrderPrice;
  };

  // 주문 가능 여부 확인 (모든 조건)
  const canOrder = () => {
    return allOrdersPaid() && meetsMinimumOrder();
  };

  // 결제 상태별 텍스트 가져오기
  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'PAID': return '결제 완료';
      case 'PENDING': return '결제 대기';
      case 'CANCELLED': return '결제 취소';
      default: return '결제 미완료';
    }
  };

  // 결제 상태별 색상 가져오기
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // 참여하기 버튼 클릭
  const handleJoinRecruitment = () => {
    sessionStorage.setItem("recruitmentId", recruitmentData.groupId)
    navigate(`/menu-select?storeId=${recruitmentData.storeId}`);
  };

  // 결제하기 버튼 클릭 - 수정된 버전
  const handlePayment = async () => {
    try {
      const userOrder = getCurrentUserOrder();
      if (!userOrder) {
        console.error('사용자의 주문 정보를 찾을 수 없습니다.');
        return;
      }

      // 병렬로 주문 정보와 사용자 정보 가져오기
      const [orderResponse, userResponse] = await Promise.all([
        orderService.getOrder(userOrder.orderId),
        userService.getUserInfo(currentUserId)
      ]);
      
      if (orderResponse.success && orderResponse.data) {
        const orderData = orderResponse.data;
        
        // 메뉴 이름들을 조합해서 주문명 생성
        const orderName = orderData.menus.map(menu => menu.menuName).join(', ') || '주문 이어하기';
        
        // 사용자 정보 처리
        let customerInfo = {
          customerEmail: sessionStorage.getItem("customerEmail") || "",
          customerName: sessionStorage.getItem("customerName") || "",
          customerMobilePhone: sessionStorage.getItem("customerMobilePhone") || ""
        };

        // userService에서 정보를 성공적으로 가져온 경우 사용
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          customerInfo = {
            customerEmail: userData.email || customerInfo.customerEmail,
            customerName: userData.nickname || customerInfo.customerName,
            customerMobilePhone: userData.phoneNumber || customerInfo.customerMobilePhone
          };
          console.log('사용자 정보를 API에서 가져왔습니다:', userData);
        } else {
          console.warn('사용자 정보를 불러올 수 없어 세션 정보를 사용합니다:', userResponse.message);
        }
        
        // 결제 데이터 구성
        const paymentData = {
          data: {
            orderId: orderData.orderId,
            amount: orderData.totalPrice,
            orderName: orderName,
            ...customerInfo
          }
        };
        
        setCheckoutData(paymentData);
        setShowCheckout(true);
        
        console.log('결제 데이터:', paymentData);
      } else {
        console.error('주문 정보를 불러올 수 없습니다:', orderResponse.message);
        // 기존 방식으로 fallback
        await handlePaymentFallback(userOrder);
      }
    } catch (error) {
      console.error('결제 준비 중 오류 발생:', error);
      
      // 에러 발생 시 기존 방식으로 fallback
      const userOrder = getCurrentUserOrder();
      if (userOrder) {
        await handlePaymentFallback(userOrder);
      }
    }
  };

  // Fallback 결제 처리 함수
  const handlePaymentFallback = async (userOrder) => {
    try {
      // 사용자 정보만이라도 가져오기 시도
      const userResponse = await userService.getUser(currentUserId);
      
      let customerInfo = {
        customerEmail: sessionStorage.getItem("customerEmail") || "",
        customerName: sessionStorage.getItem("customerName") || "",
        customerMobilePhone: sessionStorage.getItem("customerMobilePhone") || ""
      };

      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        customerInfo = {
          customerEmail: userData.email || customerInfo.customerEmail,
          customerName: userData.nickname || customerInfo.customerName,
          customerMobilePhone: userData.phoneNumber || customerInfo.customerMobilePhone
        };
      }

      const fallbackPaymentData = {
        data: {
          orderId: userOrder.orderId,
          amount: userOrder.totalPrice,
          orderName: '주문 이어하기',
          ...customerInfo
        }
      };
      
      setCheckoutData(fallbackPaymentData);
      setShowCheckout(true);
    } catch (fallbackError) {
      console.error('Fallback 처리 중 오류:', fallbackError);
      
      // 완전 fallback - 세션 정보만 사용
      const completeFallbackData = {
        data: {
          orderId: userOrder.orderId,
          amount: userOrder.totalPrice,
          orderName: '주문 이어하기',
          customerEmail: sessionStorage.getItem("customerEmail") || "",
          customerName: sessionStorage.getItem("customerName") || "",
          customerMobilePhone: sessionStorage.getItem("customerMobilePhone") || ""
        }
      };
      
      setCheckoutData(completeFallbackData);
      setShowCheckout(true);
    }
  };

  // 주문하기 버튼 클릭 (리더용)
  const handleOrder = async () => {
    // 실제 주문 처리 로직
    console.log('주문하기 실행');
    // 주문 API 호출하거나 주문 확인 페이지로 이동
    const response = await recruitmentService.submitRecruitment(recruitmentData.groupId);

    if (response.success) {
        console.log('주문 전송 성공');
        navigate('/home');
    } else {
        console.log('주문 전송에 실패했습니다.')
    }
  };

  if (loading) {
    return (
      <FixedLayout>
        <Header title="모집글 상세" />
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>모집글 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
        <BottomNav />
      </FixedLayout>
    );
  }

  if (error) {
    return (
      <FixedLayout>
        <Header title="모집글 상세" />
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onClick={() => navigate(-1)}>이전으로</RetryButton>
        </ErrorContainer>
        <BottomNav />
      </FixedLayout>
    );
  }

  if (!recruitmentData) {
    return (
      <FixedLayout>
        <Header title="모집글 상세" />
        <ErrorContainer>
          <ErrorText>모집글 정보를 찾을 수 없습니다.</ErrorText>
          <RetryButton onClick={() => navigate(-1)}>이전으로</RetryButton>
        </ErrorContainer>
        <BottomNav />
      </FixedLayout>
    );
  }

  const timeRemaining = getTimeRemaining(recruitmentData.deadlineTime);
  const isExpired = timeRemaining === '마감됨';
  const currentStatus = isExpired ? 'COMPLETED' : recruitmentData.status;

  // 버튼 렌더링 로직
  const renderActionButton = () => {
    // 마감되었거나 모집 완료된 경우
    if (isExpired || currentStatus === 'COMPLETED') {
      return (
        <DisabledButton>
          {isExpired ? '모집 마감' : '주문 완료됨'}
        </DisabledButton>
      );
    }

    // 리더인 경우
    if (isLeader && recruitmentData.status === 'RECRUITING' && hasPaid()) {
      const orderReady = canOrder();
      let buttonText = '🛒 주문하기';
      
      if (!allOrdersPaid()) {
        buttonText = '⏳ 결제 대기 중';
      } else if (!meetsMinimumOrder() && storeData?.minimumOrderAmount) {
        buttonText = `📊 최소 주문 금액 미달 (${(storeData.minimumOrderAmount - getTotalAmount())?.toLocaleString()}원 부족)`;
      }
      
      return (
        <OrderButton 
          onClick={handleOrder} 
          disabled={!orderReady}
          canOrder={orderReady}
        >
          {buttonText}
        </OrderButton>
      );
    }

    // 참여하지 않은 경우 또는 참여하고 결제 완료하고 모집 상태가 모집 중인 경우
    if (!hasJoined || (hasJoined && hasPaid() && recruitmentData.status === 'RECRUITING')) {
      return (
        <JoinButton onClick={handleJoinRecruitment}>
          🍽️ 모집에 참여하기
        </JoinButton>
      );
    }

    // 참여했지만 결제하지 않은 경우
    if (!hasPaid()) {
      return (
        <PaymentButton onClick={handlePayment}>
          💳 결제하기
        </PaymentButton>
      );
    }

    // 이미 결제한 경우
    return (
      <DisabledButton>
        ✅ 결제 완료
      </DisabledButton>
    );
  };

  return (
    <FixedLayout>
      <Header title="모집글 상세" />
      
      <HeaderSection>
        <HeaderContent>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <HeaderTitle>모집글 상세</HeaderTitle>
          <RefreshButton onClick={fetchRecruitmentDetail} disabled={loading}>
            {loading ? '⟳' : '↻'}
          </RefreshButton>
        </HeaderContent>
      </HeaderSection>

      <MainContent>
        {/* 모집글 기본 정보 */}
        <RecruitmentCard>
          <RecruitmentHeader>
            <RecruitmentTitle>{recruitmentData.title}</RecruitmentTitle>
            <StatusBadge color={getStatusColor(currentStatus)}>
              {getStatusText(currentStatus)}
            </StatusBadge>
          </RecruitmentHeader>
          
          <RecruitmentDescription>{recruitmentData.description}</RecruitmentDescription>
          
          <RecruitmentInfo>
            <InfoRow>
              <InfoIcon>📍</InfoIcon>
              <InfoText>{recruitmentData.location}</InfoText>
            </InfoRow>
            
            <InfoRow>
              <InfoIcon>👥</InfoIcon>
              <InfoText>참여자 {recruitmentData.orders?.length || 0}명</InfoText>
            </InfoRow>
            
            <InfoRow>
              <InfoIcon>💰</InfoIcon>
              <InfoText>{getTotalAmount()?.toLocaleString()}원 / {storeData.minOrderPrice?.toLocaleString()}원</InfoText>
            </InfoRow>

            {/* 최소 주문 금액 정보 표시 */}
            {storeData?.minimumOrderAmount && (
              <InfoRow>
                <InfoIcon>📊</InfoIcon>
                <MinOrderText meetsMinimum={meetsMinimumOrder()}>
                  최소 주문 금액: {storeData.minimumOrderAmount.toLocaleString()}원
                  {meetsMinimumOrder() ? ' ✅' : ` (${(storeData.minimumOrderAmount - getTotalAmount()).toLocaleString()}원 부족)`}
                </MinOrderText>
              </InfoRow>
            )}

            {
              recruitmentData.status === 'RECRUITING' && (
                <InfoRow>
                  <InfoIcon>⏰</InfoIcon>
                  <TimeText expired={isExpired}>
                    {isExpired ? '모집 마감' : timeRemaining}
                  </TimeText>
                </InfoRow>
              )
            }


            {/* 주문 현황 표시 - COMPLETED 상태도 포함 */}
            {recruitmentData.orders && recruitmentData.orders.length > 0 && 
             (recruitmentData.status === 'SUBMITTED' || recruitmentData.status === 'CONFIRMED' || recruitmentData.status === 'COMPLETED') && (
              <PaymentSummary>
                <SummaryTitle>주문 현황</SummaryTitle>
                <OrderStatusContainer>
                  {(() => {
                    if (recruitmentData.status === 'RECRUITING') {
                        return <OrderStatusBadge status="recruiting">🔄 모집 중</OrderStatusBadge>;
                    } else if (recruitmentData.status === 'SUBMITTED') {
                        return <OrderStatusBadge status="submitted">⏳ 수락 대기 중</OrderStatusBadge>;
                    } else if (recruitmentData.status === 'CONFIRMED') {
                        return <OrderStatusBadge status="confirmed">✅ 주문 수락 됨</OrderStatusBadge>;
                    } else if (recruitmentData.status === 'REJECTED') {
                        return <OrderStatusBadge status="rejected">❌ 주문 거절 됨</OrderStatusBadge>;
                    } else if (recruitmentData.status === 'CANCELED') {
                        return <OrderStatusBadge status="canceled">🚫 주문 취소 됨</OrderStatusBadge>;
                    } else if (recruitmentData.status === 'COMPLETED') {
                        return <OrderStatusBadge status="completed">🎉 주문 완료됨</OrderStatusBadge>;
                    } else {
                        return <OrderStatusBadge status="unknown">❓ 기타</OrderStatusBadge>;
                    }
                    })()}
                </OrderStatusContainer>

                {/* COMPLETED 상태일 때 완료 정보 표시 */}
                {/* {recruitmentData.status === 'COMPLETED' && (
                  <CompletedInfo>
                    <CompletedTitle>✨ 주문이 성공적으로 완료되었습니다!</CompletedTitle>
                    <CompletedDetails>
                      <CompletedDetailItem>
                        📋 총 주문 금액: <strong>{getTotalAmount()?.toLocaleString()}원</strong>
                      </CompletedDetailItem>
                      <CompletedDetailItem>
                        👥 참여자 수: <strong>{recruitmentData.orders?.length || 0}명</strong>
                      </CompletedDetailItem>
                      {storeData?.name && (
                        <CompletedDetailItem>
                          🏪 주문 가게: <strong>{storeData.name}</strong>
                        </CompletedDetailItem>
                      )}
                    </CompletedDetails>
                  </CompletedInfo>
                )} */}

                {recruitmentData.status !== 'COMPLETED' && allOrdersPaid() && !meetsMinimumOrder() && storeData?.minimumOrderAmount && (
                  <MinOrderWarning>
                    ⚠️ 최소 주문 금액 {storeData.minimumOrderAmount.toLocaleString()}원을 충족해야 주문할 수 있습니다. 
                    (현재 {(storeData.minimumOrderAmount - getTotalAmount()).toLocaleString()}원 부족)
                  </MinOrderWarning>
                )}
              </PaymentSummary>
            )}
          </RecruitmentInfo>
        </RecruitmentCard>

        {/* 참여자 목록 */}
        <ParticipantsSection>
          <SectionTitle>참여자 목록</SectionTitle>
          
          {recruitmentData.orders && recruitmentData.orders.length > 0 ? (
            <ParticipantsList>
              {recruitmentData.orders.map((order, index) => (
                <ParticipantCard key={order.orderId}>
                  <ParticipantHeader>
                    <ParticipantInfo>
                      <ParticipantName>
                        참여자 {index + 1}
                        {order.userId === recruitmentData.leaderId && (
                          <LeaderBadge>리더</LeaderBadge>
                        )}
                        {order.userId === currentUserId && (
                          <MyBadge>나</MyBadge>
                        )}
                        <PaymentStatusBadge color={getPaymentStatusColor(order.status)}>
                          {getPaymentStatusText(order.status)}
                        </PaymentStatusBadge>
                      </ParticipantName>
                      <OrderTime>{new Date(order.createdAt).toLocaleString()}</OrderTime>
                    </ParticipantInfo>
                    <OrderAmount>{order.totalPrice.toLocaleString()}원</OrderAmount>
                  </ParticipantHeader>
                  
                  <MenusList>
                    {order.menus.map((menu, menuIndex) => (
                      <MenuItemCard key={menuIndex}>
                        <MenuItemHeader>
                          <MenuName>{menu.menuName}</MenuName>
                          <MenuQuantity>x{menu.count}</MenuQuantity>
                          <MenuPrice>{menu.totalPrice.toLocaleString()}원</MenuPrice>
                        </MenuItemHeader>
                        
                        {menu.options && menu.options.length > 0 && (
                          <OptionsList>
                            {menu.options.map((option, optionIndex) => (
                              <OptionItem key={optionIndex}>
                                <OptionName>+ {option.optionName}</OptionName>
                                <OptionPrice>+{option.price.toLocaleString()}원</OptionPrice>
                              </OptionItem>
                            ))}
                          </OptionsList>
                        )}
                      </MenuItemCard>
                    ))}
                  </MenusList>
                </ParticipantCard>
              ))}
            </ParticipantsList>
          ) : (
            <EmptyParticipants>
              <EmptyIcon>👥</EmptyIcon>
              <EmptyText>아직 참여자가 없습니다.</EmptyText>
            </EmptyParticipants>
          )}
        </ParticipantsSection>
      
        { showCheckout && checkOutData && (<CheckOutComponent orderData={checkOutData} />)}

        {/* 액션 버튼 */}
        <ActionSection>
          {renderActionButton()}
        </ActionSection>
      </MainContent>

      <BottomNav />
    </FixedLayout>
  );
};

export default RecruitmentDetailPage;

// Styled Components
const HeaderSection = styled.div`
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 0 20px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 1.2rem;
  border-radius: 50%;
  
  &:hover:not(:disabled) {
    background: #f8f9fa;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 100px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1f3993;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background: #1f3993;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #1a2f7a;
  }
`;

const RecruitmentCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const RecruitmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const RecruitmentTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  margin-right: 12px;
  line-height: 1.3;
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'color'
})`
  background: ${props => props.color};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
`;

const RecruitmentDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const RecruitmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoIcon = styled.span`
  font-size: 1rem;
  width: 20px;
`;

const InfoText = styled.span`
  color: #666;
  font-size: 1rem;
`;

const TimeText = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'expired'
})`
  color: ${props => props.expired ? '#dc3545' : '#e74c3c'};
  font-size: 1rem;
  font-weight: ${props => props.expired ? 'bold' : 'normal'};
`;

const PaymentSummary = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
`;

const SummaryTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const SummaryText = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const MinOrderText = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'meetsMinimum'
})`
  color: ${props => props.meetsMinimum ? '#28a745' : '#dc3545'};
  font-size: 1rem;
  font-weight: ${props => props.meetsMinimum ? '600' : 'normal'};
`;

const OrderStatusInfo = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OrderStatusItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'completed'
})`
  font-size: 0.85rem;
  color: ${props => props.completed ? '#28a745' : '#dc3545'};
  font-weight: 600;
`;

const AllReadyBadge = styled.div`
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
`;

const MinOrderWarning = styled.div`
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 8px;
  line-height: 1.4;
`;

const OrderStatusContainer = styled.div`
  margin-bottom: 8px;
`;

const OrderStatusBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'status'
})`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'recruiting': return '#1f3993';
      case 'submitted': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'canceled': return '#6c757d';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CompletedInfo = styled.div`
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%);
  border: 2px solid #28a745;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
`;

const CompletedTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #155724;
  margin-bottom: 12px;
  text-align: center;
`;

const CompletedDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CompletedDetailItem = styled.div`
  font-size: 0.9rem;
  color: #155724;
  display: flex;
  align-items: center;
  gap: 8px;
  
  strong {
    color: #0f4c2c;
    font-weight: 600;
  }
`;

const AllPaidBadge = styled.div`
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
`;

const ParticipantsSection = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ParticipantCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
`;

const ParticipantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ParticipantInfo = styled.div`
  flex: 1;
`;

const ParticipantName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

const LeaderBadge = styled.span`
  background: #ffc107;
  color: #333;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const MyBadge = styled.span`
  background: #1f3993;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const PaymentStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'color'
})`
  background: ${props => props.color};
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const OrderTime = styled.div`
  font-size: 0.85rem;
  color: #999;
`;

const OrderAmount = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f3993;
`;

const MenusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItemCard = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
`;

const MenuItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const MenuName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const MenuQuantity = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin: 0 8px;
`;

const MenuPrice = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f3993;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
`;

const OptionName = styled.span`
  font-size: 0.85rem;
  color: #666;
`;

const OptionPrice = styled.span`
  font-size: 0.85rem;
  color: #1f3993;
`;

const EmptyParticipants = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

const ActionSection = styled.section`
  margin-top: 24px;
`;

const JoinButton = styled.button`
  width: 100%;
  background: #1f3993;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #1a2f7a;
  }
`;

const PaymentButton = styled.button`
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
`;

const OrderButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'canOrder'
})`
  width: 100%;
  background: ${props => props.canOrder ? '#ff6b35' : '#ccc'};
  color: ${props => props.canOrder ? 'white' : '#666'};
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.canOrder ? 'pointer' : 'not-allowed'};
  
  &:hover {
    background: ${props => props.canOrder ? '#e55a2b' : '#ccc'};
  }
`;

const DisabledButton = styled.button`
  width: 100%;
  background: #ccc;
  color: #666;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: not-allowed;
`;