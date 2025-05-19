import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosArrowBack } from 'react-icons/io'; // For the back arrow icon
import { HiDotsVertical } from 'react-icons/hi'; // For the vertical dots icon
import { FaHome, FaUser } from 'react-icons/fa'; // For home and user icons in the navbar
import { MdOutlineArrowForward } from 'react-icons/md'; // For the forward arrow in the navbar
import { useNavigate } from 'react-router-dom'; // For navigation
import FixedLayout from '../components/FixedLayout';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

// Styled Components for layout and elements
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5; /* Light gray background */
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const StoreListHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
`;

const StoreListTitle = styled.h3`
  font-size: 18px;
  margin-left: 10px;
  flex-grow: 1; /* Pushes the dots to the right */
`;

const Deliपर्सLogo = styled.div`
  background-color: #f0f2f5;
  padding: 20px 15px;
  font-size: 28px;
  font-weight: bold;
  color: #000;
  text-align: center;
  background: linear-gradient(to right, #004d99, #007bff); /* Blue gradient for the logo background */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StoreInfoCard = styled.div`
  background-color: #e0e0e0; /* Light gray background */
  border-radius: 8px;
  padding: 15px;
  margin: 15px;
  color: #333;
`;

const StoreName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const CurrentAmount = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;

const DeliveryTime = styled.p`
  font-size: 14px;
  color: #555;
`;

const SectionTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 15px;
  color: #333;
`;

const Dropdown = styled.select`
  width: calc(100% - 30px); /* Full width minus padding */
  padding: 10px;
  margin: 0 15px 15px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fff;
`;

const Button = styled.button`
  background-color: #004d99; /* Darker blue */
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  width: calc(100% - 30px);
  margin: 15px;
  &:hover {
    background-color: #003366; /* Even darker blue on hover */
  }
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  padding: 10px 0;
  border-top: 1px solid #eee;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555;
  font-size: 12px;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
  color: #004d99; /* Blue color for icons */
`;


const DeliveryLocation = () => {
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
    const navigate = useNavigate();

  const handleCreateRecruitment = () => {
    alert('모집 생성 및 메뉴 선택 클릭!');
    // Here you would typically navigate or perform an API call
  };

  return (

    <FixedLayout>
      <Header>
        <HeaderTitle>모집글 생성</HeaderTitle>
      </Header>

      <StoreListHeader>
        <IoIosArrowBack size={24} color="#333" />
        <StoreListTitle>가게 목록</StoreListTitle>
        <HiDotsVertical size={24} color="#333" />
      </StoreListHeader>

      <StoreInfoCard>
        <StoreName>[BHC-가천대점]</StoreName>
        <CurrentAmount>현재 금액 <span style={{ fontWeight: 'bold' }}>17,000</span> / 29,000</CurrentAmount>
        <DeliveryTime>배달 예상 시간 40-50분</DeliveryTime>
      </StoreInfoCard>

      <SectionTitle>배달 위치</SectionTitle>
      <Dropdown
        value={deliveryLocation}
        onChange={(e) => setDeliveryLocation(e.target.value)}
      >
        <option value="">위치 선택</option>
        <option value="location1">가천대학교 비전타워</option>
        <option value="location2">가천대학교 글로벌센터</option>
        <option value="location3">가천대학교 운동장</option>
      </Dropdown>

      <SectionTitle>마감 시간</SectionTitle>
      <Dropdown
        value={deadlineTime}
        onChange={(e) => setDeadlineTime(e.target.value)}
      >
        <option value="">시간 선택</option>
        <option value="time1">30분</option>
        <option value="time2">35분</option>
        <option value="time3">40분</option>
        <option value="time4">45분</option>
        <option value="time5">50분</option>
        <option value="time6">55분</option>
        <option value="time7">60분</option>
      </Dropdown>

      <Button onClick={navigate('/menu-select')}>
      모집 생성 및 메뉴 선택
      </Button>

      <BottomNav/>
    </FixedLayout>
  );
};

export default DeliveryLocation;