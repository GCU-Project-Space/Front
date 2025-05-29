import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FixedLayout from "../components/FixedLayout";
import styled from "styled-components";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate("/");

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      email,
      password,
      nickname: userNickname,
      name: username,
      phone: phoneNumber,
      role,
    };

    try {
      const response = await fetch("http://54.66.149.225:8104/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log("성공! 이메일주소: " + data.email);
        navigate("/login");
      } else if (response.status === 400) {
        alert(`회원가입 실패: ${data.email}`);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <FixedLayout>
      <Container>
        <Logo src="/Logo.png" alt="Logo" />
        <Form onSubmit={handleSignup}>
          <Label>사용자명</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label>닉네임</Label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

          <Label>전화번호</Label>
          <Input type="text" value={userNickname} onChange={(e) => setUserNickname(e.target.value)} />

          <Label>이메일</Label>
          <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

          <Label>비밀번호</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Label>비밀번호 확인</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <Label>회원 유형</Label>
          <RadioGroup>
            <RadioItem>
              <input
                type="radio"
                id="customer"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />
              <label htmlFor="customer">고객</label>
            </RadioItem>
            <RadioItem>
              <input
                type="radio"
                id="seller"
                value="seller"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              <label htmlFor="seller">판매자</label>
            </RadioItem>
          </RadioGroup>

          <SubmitButton type="submit">회원가입</SubmitButton>

          <LoginText>
            이미 회원이신가요? <Link to="/login">로그인</Link>
          </LoginText>
        </Form>
      </Container>
    </FixedLayout>
  );
};

export default Register;

// Styled Components
const Container = styled.div`
  width: 100%;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; 
`;

const Logo = styled.img`
  width: 100%;
  max-width: 400px; 
  height: auto;
  margin-bottom: 32px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

const RadioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  label {
    font-size: 1.1rem;
  }
`;

const SubmitButton = styled.button`
  background-color: #1f3993;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const LoginText = styled.p`
  margin-top: 20px;
  font-size: 0.95rem;
  text-align: center;

  a {
    color: #1f3993;
    text-decoration: none;
    font-weight: 600;
    margin-left: 6px;
  }
`;
