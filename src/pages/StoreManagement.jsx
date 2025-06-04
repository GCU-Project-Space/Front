import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { recruitmentService, storeService } from '../api/service';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import Header from '../components/Header';

const StoreManagementPage = () => {
  const navigate = useNavigate();
  
  // 가게 정보 상태
  const [storeInfo, setStoreInfo] = useState({
    id: null,
    name: "",
    phone: "",
    location: "",
    description: "",
    openHours: "",
    minOrderPrice: 0,
    category: ""
  });
  
  // 주문 목록 상태
  const [orders, setOrders] = useState([]);
  
  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editingStore, setEditingStore] = useState({ ...storeInfo });
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'orders'
  const [loading, setLoading] = useState(false);

  // 가게 정보 불러오기
  const fetchStoreInfo = async () => {
    try {
      setLoading(true);
      const storeId = sessionStorage.getItem("storeId");
      if (!storeId) {
        alert('가게 ID를 찾을 수 없습니다.');
        navigate('/');
        return;
      }

      const response = await storeService.getStore(storeId);
      if (response.success) {
        setStoreInfo(response.data);
        setEditingStore(response.data);
      } else {
        console.error('가게 정보 로딩 실패:', response.message);
        alert('가게 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('가게 정보 로딩 실패:', error);
      alert('가게 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 주문 목록 불러오기
  const fetchOrders = async () => {
    try {
      const storeId = sessionStorage.getItem("storeId");
      if (!storeId) return;

      const response = await recruitmentService.getStoreRecruitments(storeId);
      if (response.success) {
        // 백엔드 데이터 구조에 맞게 변환
        const formattedOrders = [];
        
        response.data.forEach(group => {
          // 각 그룹의 주문들을 개별 주문으로 변환
          group.orders.forEach(order => {
            // 메뉴 정보 변환
            const formattedMenus = order.menus.map(menu => ({
              name: menu.menuName,
              count: menu.count,
              price: menu.totalPrice,
              basePrice: menu.basePrice,
              options: menu.options || []
            }));

            // 상태 매핑 (실제 API 상태값에 따라 조정 필요)
            const mappedStatus = mapStatusFromAPI(group.status);

            formattedOrders.push({
              id: order.orderId,
              groupId: group.groupId,
              customerName: `고객 ${order.userId}`, // userId를 기반으로 고객명 생성
              orderTime: order.createdAt,
              status: mappedStatus, // 매핑된 상태 사용
              totalAmount: order.totalPrice,
              menus: formattedMenus,
              phoneNumber: '', // API에서 제공되지 않음
              address: '', // API에서 제공되지 않음
              title: group.title,
              description: group.description,
              category: group.category,
              deadlineTime: group.deadlineTime,
              leaderId: group.leaderId,
              userId: order.userId,
              orderStatus: order.status, // 개별 주문 상태 (PREPAID 등)
              originalStatus: group.status // 원본 상태값 보관
            });
          });
        });
        
        setOrders(formattedOrders);
      } else {
        console.error('주문 목록 로딩 실패:', response.message);
      }
    } catch (error) {
      console.error('주문 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchStoreInfo();
    fetchOrders();
    
    // 주기적으로 주문 목록 새로고침 (30초마다)
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // 가게 정보 수정
  const handleStoreEdit = () => {
    setIsEditing(true);
    setEditingStore({ ...storeInfo });
  };

  const handleStoreSave = async () => {
    try {
      setLoading(true);
      const response = await storeService.updateStore(storeInfo.id, editingStore);
      if (response.success) {
        setStoreInfo({ ...editingStore });
        setIsEditing(false);
        alert('가게 정보가 수정되었습니다.');
      } else {
        alert(response.message || '가게 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('가게 정보 수정 실패:', error);
      alert('가게 정보 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreCancel = () => {
    setEditingStore({ ...storeInfo });
    setIsEditing(false);
  };

  // 주문 상태 변경
  const updateOrderStatus = async (order, newStatus) => {
    try {
      setLoading(true);
      let response;
      const groupId = order.groupId;

      switch (newStatus) {
        case 'ACCEPTED':
          response = await recruitmentService.acceptRecruitment(groupId);
          break;
        case 'REJECTED':
          response = await recruitmentService.rejectRecruitment(groupId);
          break;
        case 'COMPLETED':
          response = await recruitmentService.completeRecruitment(groupId);
          break;
        default:
          throw new Error('Invalid status');
      }

      if (response.success) {
        const statusText = {
          'ACCEPTED': '수락',
          'REJECTED': '거절',
          'COMPLETED': '완료'
        };
        alert(`주문이 ${statusText[newStatus]}되었습니다.`);
        
        // 주문 목록 새로고침 (상태 변경 후 최신 데이터로 업데이트)
        fetchOrders();
      } else {
        alert(response.message || '주문 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 상태 변경 실패:', error);
      alert('주문 상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // API 상태값을 내부 상태값으로 매핑
  const mapStatusFromAPI = (apiStatus) => {
    // 실제 API에서 사용하는 상태값에 따라 매핑
    // 예시: API에서 다른 상태값을 사용할 경우
    switch (apiStatus?.toUpperCase()) {
      case 'RECRUITING':
      case 'WAITING':
      case 'OPEN':
        return 'SUBMITTED';
      case 'ACCEPTED':
      case 'CONFIRMED':
        return 'ACCEPTED';
      case 'REJECTED':
      case 'CANCELLED':
        return 'REJECTED';
      case 'COMPLETED':
      case 'FINISHED':
        return 'COMPLETED';
      default:
        return apiStatus || 'SUBMITTED'; // 기본값
    }
  };

  // 주문 상태별 색상
  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return '#ffc107';
      case 'ACCEPTED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      case 'COMPLETED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  // 주문 상태별 텍스트
  const getStatusText = (status) => {
    switch (status) {
      case 'SUBMITTED': return '수락 대기 중';
      case 'ACCEPTED': return '주문 수락됨';
      case 'REJECTED': return '거절됨';
      case 'COMPLETED': return '주문 완료됨';
      default: return '알 수 없음';
    }
  };

  // 원본 상태별 텍스트 (디버깅용)
  const getOriginalStatusText = (originalStatus) => {
    switch (originalStatus) {
      case 'SUBMITTED': return '수락 대기 중';
      case 'CONFIRMED': return '주문 수락됨';
      case 'REJECTED': return '거절됨';
      case 'FAILED': return '주문 실패';
      case 'CANCELED': return '주문 취소';
      case 'COMPLETED': return '주문 완료됨';
      default: return originalStatus;
    }
  };

  // 메뉴 아이템 렌더링 (백엔드 데이터 구조에 따라 조정)
  const renderMenuItems = (menus) => {
    if (!menus || menus.length === 0) return null;
    
    return menus.map((menu, index) => (
      <MenuItem key={index}>
        <MenuDetails>
          <MenuName>{menu.name}</MenuName>
          {menu.options && menu.options.length > 0 && (
            <MenuOptions>
              {menu.options.map((option, optIndex) => (
                <OptionItem key={optIndex}>
                  + {option.optionName} (+{option.price.toLocaleString()}원)
                </OptionItem>
              ))}
            </MenuOptions>
          )}
        </MenuDetails>
        <MenuQuantity>x{menu.count}</MenuQuantity>
        <MenuPriceContainer>
          {menu.basePrice !== menu.price && (
            <BasePrice>{menu.basePrice?.toLocaleString()}원</BasePrice>
          )}
          <MenuPrice>{menu.price.toLocaleString()}원</MenuPrice>
        </MenuPriceContainer>
      </MenuItem>
    ));
  };

  if (loading && orders.length === 0 && !storeInfo.id) {
    return (
      <FixedLayout>
        <Header title="가게 관리" />
        <MainContent>
          <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
        </MainContent>
        <BottomNav />
      </FixedLayout>
    );
  }

  return (
    <FixedLayout>
      <Header title="가게 관리" />
      <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>

      <MainContent>
        {/* 탭 메뉴 */}
        <TabContainer>
          <Tab 
            active={activeTab === 'info'} 
            onClick={() => setActiveTab('info')}
          >
            가게 정보
          </Tab>
          <Tab 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            주문 관리 ({orders.filter(order => order.status === 'SUBMITTED').length})
          </Tab>
        </TabContainer>

        {/* 가게 정보 탭 */}
        {activeTab === 'info' && (
          <Section>
            <SectionHeader>
              <SectionTitle>가게 정보</SectionTitle>
              {!isEditing ? (
                <EditButton onClick={handleStoreEdit} disabled={loading}>
                  수정
                </EditButton>
              ) : (
                <ButtonGroup>
                  <SaveButton onClick={handleStoreSave} disabled={loading}>
                    {loading ? '저장중...' : '저장'}
                  </SaveButton>
                  <CancelButton onClick={handleStoreCancel} disabled={loading}>
                    취소
                  </CancelButton>
                </ButtonGroup>
              )}
            </SectionHeader>

            <StoreInfoCard>
              <InfoRow>
                <Label>가게명</Label>
                {isEditing ? (
                  <Input
                    value={editingStore.name}
                    onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                    disabled={loading}
                  />
                ) : (
                  <Value>{storeInfo.name}</Value>
                )}
              </InfoRow>

              <InfoRow>
                <Label>전화번호</Label>
                {isEditing ? (
                  <Input
                    value={editingStore.phone}
                    onChange={(e) => setEditingStore({...editingStore, phone: e.target.value})}
                    disabled={loading}
                  />
                ) : (
                  <Value>{storeInfo.phone}</Value>
                )}
              </InfoRow>

              <InfoRow>
                <Label>주소</Label>
                {isEditing ? (
                  <Input
                    value={editingStore.location}
                    onChange={(e) => setEditingStore({...editingStore, location: e.target.value})}
                    disabled={loading}
                  />
                ) : (
                  <Value>{storeInfo.location}</Value>
                )}
              </InfoRow>

              <InfoRow>
                <Label>설명</Label>
                {isEditing ? (
                  <TextArea
                    value={editingStore.description}
                    onChange={(e) => setEditingStore({...editingStore, description: e.target.value})}
                    disabled={loading}
                  />
                ) : (
                  <Value>{storeInfo.description}</Value>
                )}
              </InfoRow>

              <InfoRow>
                <Label>영업시간</Label>
                {isEditing ? (
                  <Input
                    value={editingStore.openHours}
                    onChange={(e) => setEditingStore({...editingStore, openHours: e.target.value})}
                    disabled={loading}
                  />
                ) : (
                  <Value>{storeInfo.openHours}</Value>
                )}
              </InfoRow>

              <InfoRow>
                <Label>최소주문금액</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editingStore.minOrderPrice}
                    onChange={(e) => setEditingStore({...editingStore, minOrderPrice: parseInt(e.target.value) || 0})}
                    disabled={loading}
                  />
                ) : (
                  <Value>{storeInfo.minOrderPrice?.toLocaleString()}원</Value>
                )}
              </InfoRow>
            </StoreInfoCard>
          </Section>
        )}

        {/* 주문 관리 탭 */}
        {activeTab === 'orders' && (
          <Section>
            <SectionHeader>
              <SectionTitle>주문 관리</SectionTitle>
              <RefreshButton onClick={fetchOrders} disabled={loading}>
                {loading ? '새로고침중...' : '새로고침'}
              </RefreshButton>
            </SectionHeader>
            
            {orders.length === 0 ? (
              <EmptyMessage>주문이 없습니다.</EmptyMessage>
            ) : (
              <OrderList>
                {orders.map((order) => (
                  <OrderCard key={order.id}>
                    <OrderHeader>
                      <OrderNumber>주문 #{order.id}</OrderNumber>
                      <StatusBadge status={order.status}>
                        {getOriginalStatusText(order.originalStatus)}
                      </StatusBadge>
                    </OrderHeader>

                    <OrderInfo>
                      <InfoItem>
                        <InfoLabel>그룹 제목:</InfoLabel>
                        <InfoValue>{order.title}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>설명:</InfoLabel>
                        <InfoValue>{order.description}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>카테고리:</InfoLabel>
                        <InfoValue>{order.category}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>주문자 ID:</InfoLabel>
                        <InfoValue>{order.userId}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>주문시간:</InfoLabel>
                        <InfoValue>{order.orderTime}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>마감시간:</InfoLabel>
                        <InfoValue>{new Date(order.deadlineTime).toLocaleString()}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>결제상태:</InfoLabel>
                        <InfoValue>
                          <PaymentStatus status={order.orderStatus}>
                            {order.orderStatus}
                          </PaymentStatus>
                        </InfoValue>
                      </InfoItem>
                    </OrderInfo>

                    <MenuList>
                      <MenuTitle>주문 메뉴</MenuTitle>
                      {renderMenuItems(order.menus)}
                      <TotalAmount>
                        총 금액: {order.totalAmount.toLocaleString()}원
                      </TotalAmount>
                    </MenuList>

                    {order.status === 'SUBMITTED' && (
                      <OrderActions>
                        <AcceptButton 
                          onClick={() => updateOrderStatus(order, 'ACCEPTED')}
                          disabled={loading}
                        >
                          {loading ? '처리중...' : '수락'}
                        </AcceptButton>
                        <RejectButton 
                          onClick={() => updateOrderStatus(order, 'REJECTED')}
                          disabled={loading}
                        >
                          {loading ? '처리중...' : '거절'}
                        </RejectButton>
                      </OrderActions>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <OrderActions>
                        <CompleteButton 
                          onClick={() => updateOrderStatus(order, 'COMPLETED')}
                          disabled={loading}
                        >
                          {loading ? '처리중...' : '완료'}
                        </CompleteButton>
                      </OrderActions>
                    )}
                  </OrderCard>
                ))}
              </OrderList>
            )}
          </Section>
        )}
      </MainContent>

      <BottomNav />
    </FixedLayout>
  );
};

export default StoreManagementPage;

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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: ${props => props.active ? '#1f3993' : '#666'};
  border-bottom-color: ${props => props.active ? '#1f3993' : 'transparent'};
  
  &:hover {
    color: #1f3993;
  }
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const EditButton = styled.button`
  background: #1f3993;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RefreshButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StoreInfoCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  width: 120px;
  font-weight: 600;
  color: #333;
  margin-right: 16px;
  flex-shrink: 0;
`;

const Value = styled.div`
  flex: 1;
  color: #666;
  line-height: 1.4;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 1rem;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrderCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const OrderNumber = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch (props.status) {
      case 'SUBMITTED': return '#ffc107'; // 수락 대기 중 - 노란색
      case 'ACCEPTED': return '#28a745'; // 주문 수락됨 - 초록색
      case 'REJECTED': return '#dc3545'; // 거절됨/실패/취소 - 빨간색
      case 'COMPLETED': return '#6c757d'; // 완료됨 - 회색
      default: return '#6c757d';
    }
  }};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const OrderInfo = styled.div`
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const InfoLabel = styled.span`
  width: 80px;
  font-weight: 600;
  color: #333;
`;

const InfoValue = styled.span`
  color: #666;
`;

const MenuList = styled.div`
  margin-bottom: 16px;
`;

const MenuTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MenuDetails = styled.div`
  flex: 1;
`;

const MenuName = styled.div`
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
`;

const MenuOptions = styled.div`
  margin-top: 4px;
`;

const OptionItem = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin: 2px 0;
`;

const MenuQuantity = styled.span`
  color: #666;
  margin: 0 12px;
  min-width: 40px;
  text-align: center;
`;

const MenuPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 80px;
`;

const BasePrice = styled.span`
  font-size: 0.8rem;
  color: #999;
  text-decoration: line-through;
`;

const MenuPrice = styled.span`
  color: #1f3993;
  font-weight: 600;
`;

const PaymentStatus = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'PREPAID': return '#e3f2fd';
      case 'PAID': return '#e8f5e8';
      case 'SUBMITTED': return '#fff3e0';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'PREPAID': return '#1976d2';
      case 'PAID': return '#388e3c';
      case 'SUBMITTED': return '#f57c00';
      default: return '#666';
    }
  }};
`;

const TotalAmount = styled.div`
  text-align: right;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f3993;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
`;

const OrderActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const AcceptButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RejectButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CompleteButton = styled.button`
  background: #1f3993;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// StatusBadge에서 사용하는 함수를 컴포넌트 외부로 이동
function getStatusColor(status) {
  switch (status) {
    case 'SUBMITTED': return '#ffc107';
    case 'ACCEPTED': return '#28a745';
    case 'REJECTED': return '#dc3545';
    case 'COMPLETED': return '#6c757d';
    default: return '#6c757d';
  }
}