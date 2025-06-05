import { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { recruitmentService } from '../api/service.js';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import Header from '../components/Header';

function RecruitmentList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryType = searchParams.get('type');

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ITEMS_PER_PAGE = 4;

  // 모집 상태 판단 함수
  const getRecruitmentStatus = (deadlineTime, originalStatus) => {
    // 원래 상태가 RECRUITING이 아니면 모집 마감
    if (originalStatus !== 'RECRUITING') {
      return 'COMPLETED';
    }
    
    if (!deadlineTime) return 'RECRUITING';
    
    try {
      const now = new Date();
      const deadline = new Date(deadlineTime);
      
      // 마감 시간이 지났으면 모집 마감
      if (deadline <= now) {
        return 'COMPLETED';
      }
      
      // 모집 중 상태이고 마감시간 전이면 모집 중
      return 'RECRUITING';
    } catch (error) {
      return originalStatus || 'COMPLETED';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await recruitmentService.getRecruitments();
      
      if (response.success === true) {
        console.log("성공!");
        console.log(response.data);
        
        const recruitments = response.data || [];
        
        const parsedItems = recruitments.map(recruitment => {
          const totalOrderPrice = recruitment.orders?.reduce((sum, order) => 
            sum + (order.totalPrice || 0), 0) || 0;
          
          const participantCount = recruitment.orders?.length || 0;
          const estimatedTime = 30;
          const minOrderAmount = 0;

          // 실시간 상태 계산
          const currentStatus = getRecruitmentStatus(recruitment.deadlineTime, recruitment.status);

          return {
            id: recruitment.groupId,
            groupId: recruitment.groupId,
            leaderId: recruitment.leaderId,
            storeId: recruitment.storeId,
            title: recruitment.title || '제목 없음',
            description: recruitment.description || '',
            status: currentStatus, // 실시간 계산된 상태 사용
            originalStatus: recruitment.status, // 원본 상태 보존
            category: recruitment.category || '기타',
            deadlineTime: recruitment.deadlineTime,
            orders: recruitment.orders || [],
            participantCount: participantCount,
            totalPrice: totalOrderPrice,
            minOrderAmount: minOrderAmount,
            estimatedTime: estimatedTime,
            location: `${recruitment.category || '기타'} 매장`,
            time: estimatedTime
          };
        });
        
        let filteredItems;
        if (categoryType) {
          filteredItems = parsedItems.filter(item => 
            item.category?.toLowerCase() === categoryType.toLowerCase()
          );
          console.log(`${categoryType} 카테고리 필터링 결과: ${filteredItems.length}개`);
        } else {
          filteredItems = parsedItems;
          console.log(`전체 데이터: ${filteredItems.length}개`);
        }
        
        setItems(filteredItems);
        setCurrentPage(1);
        
      } else {
        console.log('응답 실패 또는 빈 데이터');
        setItems([]);
      }
      
    } catch (error) {
      console.error('데이터 처리 중 오류:', error);
      setError('데이터를 처리하는 중 오류가 발생했습니다.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryType]);

  // 항상 모집 중인 것만 필터링
  const filteredItems = items.filter(item => item.status === 'RECRUITING');

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const recruitingCount = items.filter(item => item.status === 'RECRUITING').length;
  const totalCount = items.length;

  return (
    <FixedLayout>
      <Header />
      <HeaderSection>
        <HeaderContent>
          <BackButton onClick={() => navigate('/home')}>
            <ArrowLeft size={20} />
          </BackButton>
          <HeaderTitle>
            {categoryType ? `${categoryType} 카테고리` : '전체 모집글'}
          </HeaderTitle>
          <RefreshButton onClick={handleRefresh} disabled={loading}>
            {loading ? '⟳' : '↻'}
          </RefreshButton>
        </HeaderContent>
        
        {/* 상태 정보만 표시 */}
        <FilterSection>
          <StatusInfo>
            <StatusCount recruiting>
              모집 중 {recruitingCount}개
            </StatusCount>
          </StatusInfo>
        </FilterSection>
      </HeaderSection>

      <MainContent>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>모집글을 불러오는 중...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={handleRefresh}>다시 시도</RetryButton>
          </ErrorContainer>
        ) : currentItems.length > 0 ? (
          <RecruitmentGrid>
            {currentItems.map((item, i) => (
              <RecruitmentItem item={item} key={item.groupId || i} />
            ))}
          </RecruitmentGrid>
        ) : (
          <EmptyContainer>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>
              {categoryType ? `${categoryType} 카테고리에 ` : ''}모집 중인 글이 없습니다.
            </EmptyText>
            <EmptySubText>새로운 모집글을 작성해보세요!</EmptySubText>
          </EmptyContainer>
        )}

        {totalPages > 1 && !loading && (
          <PaginationContainer>
            <PaginationButton onClick={handlePrev} disabled={currentPage === 1}>
              이전
            </PaginationButton>
            <PageInfo>{currentPage} / {totalPages}</PageInfo>
            <PaginationButton onClick={handleNext} disabled={currentPage === totalPages}>
              다음
            </PaginationButton>
          </PaginationContainer>
        )}

        <CreateButtonContainer>
          <CreateButton onClick={() => {
            sessionStorage.removeItem("groupId")
            navigate(`/stores?type=${categoryType}`)}}>
            ✏️ 모집글 작성하기
          </CreateButton>
        </CreateButtonContainer>
      </MainContent>

      <BottomNav />
    </FixedLayout>
  );
}

function RecruitmentItem({ item }) {
  const navigate = useNavigate();
  
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECRUITING': return '#28a745';
      case 'COMPLETED': return '#6c757d';
      default: return '#ffc107';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'RECRUITING': return '모집 중';
      case 'COMPLETED': return '모집 마감';
      default: return status || '알 수 없음';
    }
  };

  const timeRemaining = getTimeRemaining(item.deadlineTime);

  const handleClick = () => {
    sessionStorage.setItem("groupId", item.groupId);
    navigate('/recruitment-detail', { state: item });
  };

  return (
    <ItemCard onClick={handleClick}>
      <ItemHeader>
        <ItemTitle>{item.title}</ItemTitle>
        <StatusBadge color={getStatusColor(item.status)}>
          {getStatusText(item.status)}
        </StatusBadge>
      </ItemHeader>
      
      <ItemInfo>
        <InfoRow>
          <InfoIcon>📍</InfoIcon>
          <InfoText>제 2기숙사</InfoText>
        </InfoRow>
        
        <InfoRow>
          <InfoIcon>👥</InfoIcon>
          <InfoText>
            참여자 {item.participantCount}명
          </InfoText>
        </InfoRow>
        
        <InfoRow>
          <InfoIcon>⏰</InfoIcon>
          <TimeText>
            {timeRemaining}
          </TimeText>
        </InfoRow>
      </ItemInfo>
    </ItemCard>
  );
}

export default RecruitmentList;

// 스타일 컴포넌트들
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

const FilterSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0 15px 0;
  border-top: 1px solid #f1f3f4;
`;

const StatusInfo = styled.div`
  display: flex;
  gap: 15px;
`;

const StatusCount = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'recruiting'
})`
  font-size: 0.9rem;
  color: ${props => props.recruiting ? '#28a745' : '#6c757d'};
  font-weight: 600;
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

const RecruitmentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
`;

const ItemCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #1f3993;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 10px;
  line-height: 1.3;
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'color'
})`
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const ItemInfo = styled.div`
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

const TimeText = styled.span`
  color: #e74c3c;
  font-size: 0.9rem;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 30px 0;
`;

const PaginationButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #1f3993;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-weight: 600;
  color: #333;
`;

const CreateButtonContainer = styled.div`
  margin-top: 20px;
`;

const CreateButton = styled.button`
  width: 100%;
  background: #1f3993;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #1a2f7a;
  }
`;