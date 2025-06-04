import { useEffect, useState } from 'react';
import { userService } from '../api/service';


function UserInfo() {
  // 기본 값
  const defaultProfile = '/src/assets/user_image.png';  // 기본 이미지 
  const defaultName = '사용자';
  const defaultSchool = '서울대학교'

  const profileImage = defaultProfile;

  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState(defaultName);
  const [schoolName, setSchoolName] = useState(defaultSchool);

  const fetchData = async () => {
    const response = await userService.getUserInfo(sessionStorage.getItem("userId"));

    if (response.success === true) {
      console.log("사용자 정보 조회 성공");
      setUser(response.data);
    } else {
      alert(`사용자 정보 조회 실패: ${response.message}`);
    }
  };
  

  useEffect(() => {
    setNickname(sessionStorage.getItem("nickname"));
    setSchoolName(sessionStorage.getItem("school"));

  }, []);
  


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
