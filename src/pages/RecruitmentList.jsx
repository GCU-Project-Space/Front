import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import { ArrowLeft } from 'react-bootstrap-icons';
import Item from './Data/Item.jsx';
import './RecruitmentList.css';

function RecruitmentList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryType = searchParams.get('type');

  const [items] = useState(Item);

  // 카테고리별 필터링
  const filteredItems = categoryType
    ? items.filter(item => item.category === categoryType)
    : items;

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <FixedLayout>
      <Header />
      <div className="header">
        <h4 style={{ padding: '10px' }}>
          <ArrowLeft size={20} onClick={() => navigate('/home')} /> 카테고리
        </h4>
      </div>

      <div className="RecruitmentList">
        {currentItems.map((a, i) => (
          <RecruitmentItem item={a} key={i} />
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          이전
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>

      <div className="recruitment-create">
        <button onClick={() => navigate('/stores')}>모집글 작성하기</button>
      </div>

      <BottomNav />
    </FixedLayout>
  );
}

function RecruitmentItem({ item }) {
    const navigate = useNavigate();
  
    return (
      <div
        className="RecruitmentItem"
        onClick={() => navigate('/menu-select', { state: item })}
        style={{ cursor: 'pointer' }}
      >
        <p style={{ fontSize: '18px', fontWeight: '600', padding: '5px 0' }}>{item.title}</p>
        <p>{item.location}</p>
        <p>{item.price.toLocaleString()}원</p>
        <p>{item.time}분</p>
      </div>
    );
  }

export default RecruitmentList;
