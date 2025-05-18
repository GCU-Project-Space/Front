import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mypage from './pages/Mypage';
<<<<<<< Updated upstream
=======
import StoreList from './pages/StoreList';
import MenuSelect from './pages/MenuSelect';
>>>>>>> Stashed changes

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mypage" element={<Mypage />} />
<<<<<<< Updated upstream
=======
      <Route path="/stores" element={<StoreList />} />
      <Route path="/menu-select" element={<MenuSelect />} />

>>>>>>> Stashed changes
    </Routes>
  );
}

export default App;
