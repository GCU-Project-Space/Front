// GlobalProvider.js
import { createContext, useContext, useState } from 'react';

// Context 생성
const GlobalContext = createContext();

// Provider 컴포넌트
export const GlobalProvider = ({ children }) => {
  // 필요한 상태들을 여기에 추가
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 값을 객체로 묶어서 전달
  const value = {
    user,
    setUser,
    loading,
    setLoading
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook - 이걸로 상태에 접근
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal은 GlobalProvider 안에서만 사용 가능합니다');
  }
  return context;
};