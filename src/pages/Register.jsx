import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { userService } from "../api/service";
import FixedLayout from "../components/FixedLayout";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [storeId, setStoreId] = useState();

  const navigate = useNavigate("/");

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const request = {
      email : email,
      password : password,
      nickname : userNickname,
      school : "가천대학교",
      phoneNumber : phoneNumber,
      schoolId : "000000000",
      userType : role,
      storeId : Number(storeId)
    }

    console.log(request);

    const response = await userService.signup(request)

    if (response.success === true) {
      console.log("회원가입 성공");
      console.log(response);
      navigate("/");
    } else {
      alert(`회원가입 실패 : ${response.message}`);
    }
  };

  return (
    <FixedLayout>
      <Container>
        <Logo src="/Logo.png" alt="Logo" />
        <Form onSubmit={handleSignup}>
          <Label>이메일</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label>비밀번호</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Label>비밀번호 확인</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <Label>닉네임</Label>
          <Input type="text" value={userNickname} onChange={(e) => setUserNickname(e.target.value)} />

          <Label>전화번호</Label>
          <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          
          <Label>회원 유형</Label>
          <RadioGroup>
            <RadioItem>
              <input
                type="radio"
                id="customer"
                value="USER"
                checked={role === "USER"}
                onChange={() => setRole("USER")}
              />
              <label htmlFor="customer">고객</label>
            </RadioItem>
            <RadioItem>
              <input
                type="radio"
                id="seller"
                value="STORE"
                checked={role === "OWNER"}
                onChange={() => setRole("OWNER")}
              />
              <label htmlFor="seller">판매자</label>
            </RadioItem>
          </RadioGroup>

          {
            role === "OWNER" ? 
            <div>
              <Label>사업자번호 </Label>
              <Input type="number" value={storeId} onChange={(e) => setStoreId(Number(e.target.value))} />
            </div>
          :
          <></>
          }
          

          <SubmitButton type="submit">회원가입</SubmitButton>

          <LoginText>
            이미 회원이신가요? <Link to="/">로그인</Link>
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
