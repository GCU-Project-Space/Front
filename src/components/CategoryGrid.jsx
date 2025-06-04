import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const categories = [
  '패스트푸드', '한식', '분식', '치킨',
  '찜/탕', '일식', '고기', '돈까스/회',
  '피자', '카페/디저트', '샐러드', '중식'
];

const categories_eng = [
  "FAST_FOOD",
  "KOREAN",
  "SNACK",
  "CHICKEN",
  "SOUP",
  "JAPANESE",
  "MEAT",
  "PORK_CUTLET",
  "PIZZA",
  "CAFE",
  "SALAD",
  "CHINESE"
];

function CategoryGrid() {
  const navigate = useNavigate(); 

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '25px 25px',                       
      padding: '0 0px',                      
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {categories.map((cat, idx) => (
        <Button
          variant="light"
          key={idx}
          onClick={() => navigate(`/category?type=${encodeURIComponent(categories_eng[idx])}`)}
          style={{
            backgroundColor: '#eeeeee',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            height: '55px',                  
            fontWeight: '600',
            fontSize: '18px',
            padding: '4px 8px',               
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
