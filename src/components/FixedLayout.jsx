// components/FixedLayout.jsx
function FixedLayout({ children }) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '402px',  // iPhone 16 Pro 기준
          height: '800px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          paddingBottom: '60px',
          position: 'relative' 
        }}>
          {children}
        </div>
      </div>
    );
  }
  
  export default FixedLayout;
  