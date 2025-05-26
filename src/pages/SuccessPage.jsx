import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './css/SuccessPage.css';
import FixedLayout from "../FixedLayout.jsx";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const requestData = {
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
      paymentKey: searchParams.get('paymentKey'),
    };

    console.log(requestData);

    async function confirm() {
      const response = await fetch(
        'http://34.127.7.212:8101/v1/payments/confirm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      const json = await response.json();
      console.log('결과임' + json);
      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 구현하세요.
    }

    confirm();
  }, []);

  return (
      <FixedLayout>
        <div className='result wrapper'>
          <div className='box_section'>
            <h2>결제 성공</h2>
            <p>
              주문번호: <span>{searchParams.get('orderId')}</span>
            </p>
            <p>
              결제 금액:{' '}
              <span>{Number(searchParams.get('amount')).toLocaleString()}원</span>
            </p>
          </div>
        </div>
      </FixedLayout>
  );
}
