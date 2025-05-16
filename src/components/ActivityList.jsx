function ActivityList() {
    const items = ['주문 내역', '작성한 모집글', '참여한 모집글'];
  
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {items.map((label, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid #1C1B1F',
              borderRadius: '12px',
              padding: '11px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <span>{label}</span>
            <span style={{ fontSize: '18px', color: 'black',fontWeight: '500' }}>{'>'}</span>
          </div>
        ))}
      </div>
    );
  }
  
  export default ActivityList;
  