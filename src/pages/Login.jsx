import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FixedLayout from "../components/FixedLayout";
import styled from "styled-components";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    // 로그인 처리 로직을 구현합니다.
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    
    const response = await fetch(
      "로그인 서버 주소",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    const result = await response.json();

    if (response.status === 200) {
      setLoginCheck(false);
      // Store token in local storage
      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("email", result.email); // 여기서 userid를 저장합니다.
      sessionStorage.setItem("role", result.role); // 여기서 role를 저장합니다.
      sessionStorage.setItem("storeid", result.storeId); // 여기서 role를 저장합니다.
      console.log("로그인성공, 이메일주소:" + result.email);
      navigate("/"); // 로그인 성공시 홈으로 이동합니다.
    } else {
      setLoginCheck(true);
    }
  };

  return (
    <FixedLayout>
      <LoginContainer>
        <Logo src="/Logo.png" alt="Logo" />
        <Form onSubmit={handleLogin}>
          <Label>이메일</Label>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginCheck && (
            <ErrorMessage>이메일 혹은 비밀번호가 틀렸습니다.</ErrorMessage>
          )}
          <LoginButton type="submit">로그인</LoginButton>
          <SignupText>
            아직 회원이 아니신가요? <Link to="/register">회원가입</Link>
          </SignupText>
        </Form>
      </LoginContainer>
    </FixedLayout>
  );
}

export default Login;

// styled-components
const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
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
  flex: 1; // 남은 높이를 채우도록
`;


const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const LoginButton = styled.button`
  background-color: #1f3993;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const SignupText = styled.p`
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