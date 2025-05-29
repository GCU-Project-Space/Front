// pages/Mypage.jsx
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import UserInfo from '../components/UserInfo';
import UserInfoBox from '../components/UserInfoBox';
import ActivityList from '../components/ActivityList';
import FixedLayout from '../components/FixedLayout';

function Mypage() {
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
        <h3 style={{ fontWeight: '700', marginTop: '0px' }}>개인정보</h3>
        <UserInfoBox />
        <h3 style={{ fontWeight: '700', marginTop: '20px', marginBottom: '12px' }}>활동정보</h3>
        <div style={{ marginBottom: '40px' }}>
          <ActivityList />
        </div>
      </main>
      <BottomNav />
    </FixedLayout>
  );
}

export default Mypage;
