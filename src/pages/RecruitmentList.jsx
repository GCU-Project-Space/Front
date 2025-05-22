import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import { ArrowLeft } from 'react-bootstrap-icons';
import Item from './Data/Item.jsx';
import './RecruitmentList.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function RecruitmentList() {
    let navigate = useNavigate();
    // If Item is an array, use it directly; if it's data, import as array
    const [items] = useState(Item);

    const ITEMS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
    
    return (
        <FixedLayout>
            <Header />
            <div className="header">
                <h4 style={{
                    padding: '10px'
                }}> <ArrowLeft size={20} onClick={() => {navigate('/')}}/> 카테고리</h4>
            </div>
            <div className="RecruitmentList">
                {currentItems.map(function(a, i) {
                    return <RecruitmentItem item={a} key={i} />;
                })} 
            </div> 
            <div className="pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>이전</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>다음</button>
            </div>
            <div className="recruitment-create">
                <button onClick={() => {navigate('/stores')}}>모집글 작성하기</button>
            </div>
            <BottomNav />
        </FixedLayout>
    )
}

function RecruitmentItem(props) {
    return (
        <div className="RecruitmentItem">
            <p style={{
                fontSize: '18px',
                fontWeight: '600',
                padding: '5px 0',
            }}>{props.item.title}</p>
            <p>{props.item.location}</p>
            <p>{props.item.price}원</p>
            <p>{props.item.time}분</p>
        </div>
    );
}
export default RecruitmentList;