import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mypage from './pages/Mypage';
import SelectSchool from './pages/SelectSchool';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruitmentList from './pages/RecruitmentList';
import StoreList from './pages/StoreList';
import MenuSelect from './pages/MenuSelect';
import DeliveryLocation from './pages/DeliveryLocation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/school" element={<SelectSchool />} />
      <Route path="/login" element={<Login />} />
      <Route path="/category" element={<RecruitmentList />} />
      <Route path="/stores" element={<StoreList />} />
      <Route path="/menu-select" element={<MenuSelect />} />
      <Route path="/deli-location" element={<DeliveryLocation />} />
    </Routes>
  );
}

export default App;
