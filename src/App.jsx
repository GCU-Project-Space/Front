import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mypage from './pages/Mypage';

import StoreList from './pages/StoreList';
import MenuSelect from './pages/MenuSelect';
import MenuOptionSelect from './pages/MenuOptionSelect';

import SelectSchool from './pages/SelectSchool';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruitmentList from './pages/RecruitmentList';
import DeliveryLocation from './pages/DeliveryLocation';
import FailPage from "./components/toss/FailPage.jsx";
import SuccessPage from "./components/toss/SuccessPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";


function App() {
    return (
        <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/mypage" element={<Mypage/>}/>
            <Route path="/history" element={<OrderHistory/>}/>
            <Route path="/stores" element={<StoreList/>}/>
            <Route path="/menu-select" element={<MenuSelect/>}/>
            <Route path="/menu-option" element={<MenuOptionSelect/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/mypage" element={<Mypage/>}/>
            <Route path="/school" element={<SelectSchool/>}/>
            <Route path="/" element={<Login/>}/>
            <Route path="/category" element={<RecruitmentList/>}/>
            <Route path="/stores" element={<StoreList/>}/>
            <Route path="/menu-select" element={<MenuSelect/>}/>
            <Route path="/deli-location" element={<DeliveryLocation/>}/>
            <Route path="/order" element={<OrderPage/>}/>
            <Route path="/toss/success" element={<SuccessPage/>}/>
            <Route path="/toss/fail" element={<FailPage/>}/>
        </Routes>
    );
}

export default App;
