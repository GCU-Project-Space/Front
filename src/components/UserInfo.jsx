import React, { useEffect, useState } from 'react';
import axios from 'axios';


function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://서버주소/api/v1/users/1')
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error('유저 정보 불러오기 실패:', err);
      });
  }, []);

  // 기본 값
  const defaultProfile = '/src/assets/user_image.png';  // 기본 이미지 
  const defaultName = '사용자';
  const defaultSchool = ' OOO 대학교'

  const profileImage = user?.profileImage || defaultProfile;
  const nickname = user?.nickname || defaultName;
  const schoolName = user?.schoolName || defaultSchool;

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
        {schoolName}
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
          src={profileImage}
          alt="user"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
        <div style={{ fontWeight: 'bold', fontSize: '40px', }}>
          {nickname}
        </div>
      </div>
    </div>
  );
}


export default UserInfo;
