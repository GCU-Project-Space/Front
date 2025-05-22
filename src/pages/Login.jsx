import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FixedLayout from "../components/FixedLayout";

function Login ()  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

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
    <div className="login-container">
        <img src="/Logo.png" alt="Logo" style = {{
          padding: "20px",
        }}/>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>로그인</h2>
        <label htmlFor="username">이메일</label><br/>
        <input
          type="text"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/><br/>

        <label htmlFor="password">비밀번호</label><br/>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/><br/>
        
         {loginCheck && (
        <label  style={{color: "red"}}>이메일 혹은 비밀번호가 틀렸습니다.</label>
        )}
        <button onClick={handleLogin}>로그인</button>

        <p className="signup-link">
          아직 회원이 아니신가요? <Link to="/register">회원가입</Link>
        </p>
      </form>
    </div>
    </FixedLayout>
  );
};

export default Login;