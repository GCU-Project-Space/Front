import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mypage from './pages/Mypage';
import StoreList from './pages/StoreList';
import MenuSelect from './pages/MenuSelect';
import MenuOptionSelect from './pages/MenuOptionSelect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/stores" element={<StoreList />} />
      <Route path="/menu-select" element={<MenuSelect />} />
      <Route path="/menu-option" element={<MenuOptionSelect />} />
    </Routes>
  );
}

export default App;
