function UserInfo() {
  return (
    <div style={{
      width: '100%',
      padding: '0 16px',
      boxSizing: 'border-box',
      margin: '20px 0'
    }}>
      <div style={{
        backgroundColor: '#D9D9D9',
        color: '#0C198C',
        padding: '4px 12px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '20px',
        textAlign: 'center',
        marginBottom: '15px',
        width: 'fit-content',
        marginLeft: 0,
      }}>
        가천대학교
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px' 
        }}
      >
        <img
          src="/src/assets/user_image.png"
          alt="user"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '40px', }}>
          심심한 호랑이
        </div>
      </div>
    </div>
  );
}


export default UserInfo;
