import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './css/SuccessPage.css';
import FixedLayout from "../FixedLayout.jsx";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const paymentKey = searchParams.get('paymentKey');

    if (!orderId || !amount || !paymentKey) {
      setStatus('error');
      setErrorMsg('필수 결제 정보 누락');
      return;
    }

    const requestData = { orderId, amount, paymentKey };

    async function confirm() {
      try {
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
        console.log('결제 응답:', json);

        if (!response.ok) {
          setStatus('error');
          setErrorMsg(json.message || '결제 실패');
          return;
        }

        // 성공
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMsg('서버 오류');
      }
    }

    confirm();
  }, [searchParams]);

  return (
    <FixedLayout>
      <div className='result wrapper'>
        <div className='box_section'>
          {status === 'loading' && <p>결제 확인 중...</p>}

          {status === 'error' && (
            <>
              <h2>결제 실패</h2>
              <p>에러 메시지: {errorMsg}</p>
              <button onClick={() => navigate('/order')}>다시 결제로 돌아가기</button>
            </>
          )}

          {status === 'success' && (
            <>
              <h2>결제 성공</h2>
              <p>
                주문번호: <span>{searchParams.get('orderId')}</span>
              </p>
              <p>
                결제 금액:{' '}
                <span>{Number(searchParams.get('amount')).toLocaleString()}원</span>
              </p>

              <button
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#1f3993',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
                onClick={() => navigate('/order-history')}
              >
                주문 내역 보기
              </button>
            </>
          )}
        </div>
      </div>
    </FixedLayout>
  );
}
