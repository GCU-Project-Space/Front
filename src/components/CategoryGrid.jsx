import { Button } from 'react-bootstrap';

const categories = [
  '패스트푸드', '한식', '분식', '치킨',
  '찜/탕', '일식', '고기', '돈까스/회',
  '피자', '카페/디저트', '샐러드', '중식'
];

function CategoryGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',  // 3열
      gap: '25px 25px',                       // 행/열 간격
      padding: '0 0px',                      // 좌우 패딩
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {categories.map((cat, idx) => (
        <Button
          variant="light"
          key={idx}
          style={{
            backgroundColor: '#eeeeee',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            height: '55px',                   // ✅ 버튼 높이
            fontWeight: '600',
            fontSize: '18px',
            padding: '4px 8px',               // ✅ 내부 여백 ↓
            lineHeight: '1.2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}

export default CategoryGrid;
