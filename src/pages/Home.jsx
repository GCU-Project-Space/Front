// pages/Home.jsx
import Header from '../components/Header';
import UserInfo from '../components/UserInfo';
import CategoryGrid from '../components/CategoryGrid';
import BottomNav from '../components/BottomNav';
import FixedLayout from '../components/FixedLayout';

function Home() {
  return (
    <FixedLayout>
      <Header />
      <main style={{ flex: 1, padding: '50px 16px 16px 16px' }}>
      <div style={{ marginBottom: '60px' }}>
        <UserInfo />
        </div>
        <CategoryGrid />
      </main>
      <BottomNav />
    </FixedLayout>
  );
}

export default Home;
