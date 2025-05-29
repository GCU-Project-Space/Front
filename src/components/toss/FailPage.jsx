import { useSearchParams } from 'react-router-dom';
import FixedLayout from "../FixedLayout.jsx";

export default function FailPage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code') || 'Unknown';
    const message = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.';

    return (
        <FixedLayout>
            <div className='result wrapper'>
                <div className='box_section'>
                    <h2>결제 실패</h2>
                     <p>{`에러 코드: ${code}`}</p>
                     <p>{`실패 사유: ${message}`}</p>
                </div>
            </div>
        </FixedLayout>
    );


};
