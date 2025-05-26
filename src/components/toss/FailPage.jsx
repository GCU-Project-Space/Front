import { useSearchParams } from 'react-router-dom';
import FixedLayout from "../FixedLayout.jsx";

export default function FailPage() {
    const [searchParams] = useSearchParams();

    return (
        <FixedLayout>
            <div className='result wrapper'>
                <div className='box_section'>
                    <h2>결제 실패</h2>
                    <p>{`에러 코드: ${searchParams.get('code')}`}</p>
                    <p>{`실패 사유: ${searchParams.get('message')}`}</p>
                </div>
            </div>
        </FixedLayout>
    );


};
