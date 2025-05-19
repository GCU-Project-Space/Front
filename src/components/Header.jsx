import { Container, Navbar } from 'react-bootstrap';
import logo from '../assets/delipus_logo.png';

function Header() {
  return (
    <Navbar
      style={{
        backgroundColor: '#D9D9D9', 
        height: '60px',           
        display: 'flex',
        alignItems: 'center',    
      }}
    >
      <Navbar.Brand style={{ padding: '8px 16px' }}>
        <img src={logo} alt="딜리퍼스 로고" style={{ height: '45px' }} />
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;
