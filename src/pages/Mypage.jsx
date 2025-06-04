// pages/Mypage.jsx
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import UserInfoBox from '../components/UserInfoBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Mypage() {
  const navigate = useNavigate();

    const handleLogout = () => {
    const confirmed = window.confirm("로그아웃하시겠습니까?");
    if (confirmed) {
      // localStorage.clear(); // 필요 시 로그인 정보 제거
      
      toast.success('로그아웃 되었습니다.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
      setTimeout(() => navigate('/'), 500); // 2초 후 홈으로 이동
    }
  };

  return (
    <FixedLayout>
      <Header />
      <div style={{ padding: '13px', fontSize: '16px', fontWeight: '500' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/home'}>
          ← 홈 화면
        </span>
      </div>
      <main style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
        <UserInfo />
        <h3 style={{ fontWeight: '700', marginTop: '0px', marginBottom: '20px' }}>개인정보</h3>
        <UserInfoBox />
        <h3 style={{ fontWeight: '700', marginTop: '40px', marginBottom: '20px' }}>활동정보</h3>
        <div style={{ marginBottom: '40px' }}
        onClick={() => navigate('/recruitment-detail')}>
            <div
            style={{
              border: '1px solid #1C1B1F',
              borderRadius: '12px',
              padding: '11px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <span>최근 주문</span>
            <span style={{ fontSize: '18px', color: 'black',fontWeight: '500' }} onClick={() => window.location.href = '/history'}>{'>'}</span>
          </div>
        </div>
        <div style={{ marginBottom: '80px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              background: '#eeeeee',
              color: 'black',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            로그아웃
          </button>
        </div>
      </main>
      <BottomNav />
    </FixedLayout>
  );
}

export default Mypage;
