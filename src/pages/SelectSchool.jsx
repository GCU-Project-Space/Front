import { React, useState } from 'react';
import { Button, Form } from 'react-bootstrap'; // Bootstrap Button 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import styled from 'styled-components'; // styled-components 추가
import FixedLayout from '../components/FixedLayout';

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

function SelectSchool() {
  const [selectedSchool, setSelectedSchool] = useState('');
  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
  };

  const navigate = useNavigate(); // useNavigate 훅 사용
  return (
    <FixedLayout>
    <div className="Login">
      <div className="Logo">
        <img src="/Logo.png" alt="Logo" />
        <img src="/SubLogo.png" alt="Catchphrase" />
      </div>
      <div className="Selection">
        <p padding ="20px">학교 선택하기</p>
        <Form.Select value={selectedSchool} onChange={handleSchoolChange}>
          <option value="">학교를 선택하세요</option>
          <option value="school1">가천대학교</option>
          <option value="school2">서울대학교</option>
          <option value="school3">연세대학교</option>
        </Form.Select>
      </div>
      <Button variant="primary" onClick={() => {navigate('/login')}}>
        학교 이메일로 시작하기
      </Button>
    </div>
    </FixedLayout>
  );
}

export default SelectSchool;