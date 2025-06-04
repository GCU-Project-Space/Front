import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Mypage from './pages/Mypage';

import MenuOptionSelect from './pages/MenuOptionSelect';
import MenuSelect from './pages/MenuSelect';
import StoreList from './pages/StoreList';

import FailPage from "./components/toss/FailPage.jsx";
import SuccessPage from "./components/toss/SuccessPage.jsx";
import DeliveryLocation from './pages/DeliveryLocation';
import Login from './pages/Login';
import OrderHistory from "./pages/OrderHistory.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import RecruitmentDetailPage from './pages/RecruitmentDetail.jsx';
import RecruitmentList from './pages/RecruitmentList';
import Register from './pages/Register';
import SelectSchool from './pages/SelectSchool';
import StoreManagementPage from './pages/StoreManagement.jsx';


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
            <Route path="/store-management" element={<StoreManagementPage/>}/>
            <Route path="/recruitment-detail" element={<RecruitmentDetailPage/>}/>
        </Routes>
    );
}

export default App;
