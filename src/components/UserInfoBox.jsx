function UserInfoBox() {
    const userInfo = [
      { label: '닉네임', value: '심심한 호랑이' },
      { label: '휴대전화', value: '010-1234-5678' },
      { label: '이메일', value: 'horang12@gachon.ac.kr' },
    ];
  
    return (
      <div style={{
        border: '1px solid #1C1B1F',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        overflow: 'hidden',
      }}>
        {userInfo.map((item, idx) => (
          <div
            key={idx}
            onClick={() => console.log(`${item.label} 수정 클릭됨`)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '11px 20px',
              borderBottom: idx < userInfo.length - 1 ? '1px solid #ccc' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{item.label}</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.value}</span>
            </div>
            <span style={{ fontSize: '18px', color: 'black',fontWeight: '500' }}>{'>'}</span>
          </div>
        ))}
      </div>
    );
  }
  
  export default UserInfoBox;
  