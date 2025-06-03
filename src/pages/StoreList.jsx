import { useEffect, useState } from "react";
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from 'styled-components';
import { storeService } from "../api/service";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";
import Header from "../components/Header";

const StoreList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryType = searchParams.get('type');

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClosedStores, setShowClosedStores] = useState(false);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await storeService.getStores();
      
      if (response.success === true) {
        console.log("성공!");
        console.log(response.data);
        
        // API 응답 데이터 파싱
        const storeList = response.data || [];
        
        // 데이터를 UI에 맞는 형태로 변환
        const parsedStores = storeList.map(store => {
          let isOpen = true; // 기본값
          
          // 영업시간 파싱 (00:00 ~ 00:00 형태)
          if (store.openHours) {
            try {
              const timeRange = store.openHours.split('~').map(time => time.trim());
              if (timeRange.length === 2) {
                const [openTime, closeTime] = timeRange;
                const [openHour, openMin] = openTime.split(':').map(Number);
                const [closeHour, closeMin] = closeTime.split(':').map(Number);
                
                const now = new Date();
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();
                const currentTotalMin = currentHour * 60 + currentMin;
                
                const openTotalMin = openHour * 60 + openMin;
                let closeTotalMin = closeHour * 60 + closeMin;
                
                // 자정을 넘어가는 경우 (예: 09:00 ~ 02:00)
                if (closeTotalMin < openTotalMin) {
                  closeTotalMin += 24 * 60; // 다음날로 계산
                  // 현재 시간도 다음날 기준으로 조정할지 확인
                  if (currentTotalMin < openTotalMin) {
                    const adjustedCurrentMin = currentTotalMin + 24 * 60;
                    isOpen = adjustedCurrentMin >= openTotalMin && adjustedCurrentMin <= closeTotalMin;
                  } else {
                    isOpen = currentTotalMin >= openTotalMin || currentTotalMin <= (closeTotalMin - 24 * 60);
                  }
                } else {
                  // 일반적인 경우 (예: 09:00 ~ 22:00)
                  isOpen = currentTotalMin >= openTotalMin && currentTotalMin <= closeTotalMin;
                }
              }
            } catch (error) {
              console.warn('영업시간 파싱 오류:', store.openHours, error);
              isOpen = true; // 파싱 실패 시 기본적으로 영업중으로 처리
            }
          }
          
          return {
            id: store.id,
            name: store.name,
            phone: store.phone,
            location: store.location,
            description: store.description,
            openHours: store.openHours,
            minOrderPrice: store.minOrderPrice,
            category: store.category,
            isOpen: true,//isOpen,
            status: isOpen ? "OPEN" : "CLOSED"
          };
        });
        
        // 카테고리별 필터링
        let filteredStores;
        if (categoryType) {
          filteredStores = parsedStores.filter(store => 
            store.category?.toLowerCase() === categoryType.toLowerCase()
          );
          console.log(`${categoryType} 카테고리 필터링 결과: ${filteredStores.length}개`);
        } else {
          filteredStores = parsedStores;
          console.log(`전체 상점 데이터: ${filteredStores.length}개`);
        }
        
        // stores 상태에 저장
        setStores(filteredStores);
        
      } else {
        console.log('응답 실패 또는 빈 데이터');
        setStores([]);
      }
      
    } catch (error) {
      console.error('데이터 처리 중 오류:', error);
      setError('데이터를 처리하는 중 오류가 발생했습니다.');
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryType]);

  const handleRefresh = () => {
    fetchData();
  };

  // 마감된 가게 필터링
  const filteredStores = showClosedStores 
    ? stores 
    : stores.filter(store => store.isOpen);

  const openStoreCount = stores.filter(store => store.isOpen).length;
  const closedStoreCount = stores.filter(store => !store.isOpen).length;

  return (
    <FixedLayout>
      <Header title="가게 리스트" />

      <HeaderSection>
        <HeaderContent>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </BackButton>
          <HeaderTitle>
            {categoryType ? `${categoryType} 가게` : '전체 가게'}
          </HeaderTitle>
          <RefreshButton onClick={handleRefresh} disabled={loading}>
            {loading ? '⟳' : '↻'}
          </RefreshButton>
        </HeaderContent>
      </HeaderSection>

      <FilterSection>
        <StoreStats>
          영업중 {openStoreCount}개 • 마감 {closedStoreCount}개
        </StoreStats>
        <ToggleContainer>
          <ToggleLabel>마감된 가게 보기</ToggleLabel>
          <ToggleSwitch
            checked={showClosedStores}
            onChange={(e) => setShowClosedStores(e.target.checked)}
          />
        </ToggleContainer>
      </FilterSection>

      <MainContent>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>가게 목록을 불러오는 중...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={handleRefresh}>다시 시도</RetryButton>
          </ErrorContainer>
        ) : filteredStores.length > 0 ? (
          <StoreGrid>
            {filteredStores.map((store, idx) => (
              <StoreCard 
                key={store.id || idx} 
                onClick={() => {
                  if (store.isOpen) {
                    navigate(`/menu-select?storeId=${store.id}`);
                  }
                }}
                isOpen={store.isOpen}
              >
                <StoreHeader>
                  <StoreName>{store.name}</StoreName>
                  <StatusBadge isOpen={store.isOpen}>
                    {store.isOpen ? '영업중' : '마감'}
                  </StatusBadge>
                </StoreHeader>
                
                <StoreInfo>
                  <InfoRow>
                    <InfoIcon>📍</InfoIcon>
                    <InfoText>{store.location}</InfoText>
                  </InfoRow>
                  
                  <InfoRow>
                    <InfoIcon>💰</InfoIcon>
                    <InfoText>최소 주문 금액 {store.minOrderPrice?.toLocaleString()}원</InfoText>
                  </InfoRow>
                  
                  <InfoRow>
                    <InfoIcon>🕒</InfoIcon>
                    <InfoText>배달 예상 시간 정보 없음</InfoText>
                  </InfoRow>
                  
                  {store.openHours && (
                    <InfoRow>
                      <InfoIcon>⏰</InfoIcon>
                      <InfoText>영업시간 {store.openHours}</InfoText>
                    </InfoRow>
                  )}
                  
                  {store.description && (
                    <StoreDescription>{store.description}</StoreDescription>
                  )}
                </StoreInfo>
                
                {!store.isOpen && (
                  <ClosedOverlay>
                    <ClosedText>현재 영업시간이 아닙니다</ClosedText>
                  </ClosedOverlay>
                )}
              </StoreCard>
            ))}
          </StoreGrid>
        ) : (
          <EmptyContainer>
            <EmptyIcon>🏪</EmptyIcon>
            <EmptyText>
              {showClosedStores 
                ? (categoryType ? `${categoryType} 카테고리에 해당하는 ` : '') + '가게가 없습니다.'
                : '현재 영업중인 가게가 없습니다.'
              }
            </EmptyText>
            <EmptySubText>
              {!showClosedStores && closedStoreCount > 0 && 
                '마감된 가게 보기를 켜면 더 많은 가게를 볼 수 있습니다.'
              }
            </EmptySubText>
          </EmptyContainer>
        )}
      </MainContent>

      <BottomNav />
    </FixedLayout>
  );
};

export default StoreList;

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

const FilterSection = styled.div`
  background: white;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StoreStats = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  width: 40px;
  height: 20px;
  appearance: none;
  background: #ddd;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  
  &:checked {
    background: #1f3993;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }
  
  &:checked::before {
    transform: translateX(20px);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
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

const StoreGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StoreCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: ${props => props.isOpen ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  opacity: ${props => props.isOpen ? 1 : 0.7};
  position: relative;
  
  &:hover {
    transform: ${props => props.isOpen ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isOpen ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
    border-color: ${props => props.isOpen ? '#1f3993' : '#e9ecef'};
  }
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const StoreName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  margin-right: 10px;
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})`
  background: ${props => props.isOpen ? '#28a745' : '#dc3545'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.span`
  font-size: 0.9rem;
  width: 16px;
`;

const InfoText = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const StoreDescription = styled.p`
  color: #777;
  font-size: 0.85rem;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const ClosedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClosedText = styled.div`
  background: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const EmptyText = styled.p`
  color: #666;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 5px;
`;

const EmptySubText = styled.p`
  color: #999;
  font-size: 0.9rem;
  text-align: center;
`;