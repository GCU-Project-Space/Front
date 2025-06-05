import { Nav, Navbar } from 'react-bootstrap';
import { ArrowLeft, HouseDoor, Person } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function BottomNav() {
  const navigate = useNavigate();

  // storeId 체크 함수
  const goHome = () => {
    const storeId = sessionStorage.getItem('storeId');
    if (storeId >= 0) {
      console.log(storeId);
      navigate('/store-management');
    } else {
      navigate('/home');
    }
  };

  return (
    <Navbar
      fixed="bottom"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#D9D9D9',
        padding: '10px 0',
        width: '100%',
      }}
    >
      <Nav style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <Nav.Link onClick={() => navigate(-1)}>
          <ArrowLeft size={30} color="#0C198C" />
        </Nav.Link>
        <Nav.Link onClick={goHome}>
          <HouseDoor size={30} color="#0C198C" />
        </Nav.Link>
        <Nav.Link onClick={() => navigate('/mypage')}>
          <Person size={30} color="#0C198C" />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default BottomNav;
