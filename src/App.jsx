import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mypage from './pages/Mypage';
import StoreList from './pages/StoreList';
import MenuSelect from './pages/MenuSelect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/stores" element={<StoreList />} />
      <Route path="/menu-select" element={<MenuSelect />} />
    </Routes>
  );
}

export default App;
