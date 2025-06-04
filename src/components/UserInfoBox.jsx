import { useEffect, useState } from 'react';
import { userService } from '../api/service';

function UserInfoBox() {
  const [editedInfo, setEditedInfo] = useState({
    nickname: '사용자',
    phoneNumber: '010-XXXX-XXXX',
    email: '이메일 입력하기',
  });

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  const fields = [
    { label: '닉네임', key: 'nickname' },
    { label: '휴대전화', key: 'phoneNumber' },
    { label: '이메일', key: 'email' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserInfo(sessionStorage.getItem("userId"));

      if (response.success === true) {
        console.log("사용자 정보 조회 성공");
        setUser(response.data);
        setEditedInfo({
          nickname: response.data.nickname || '사용자',
          phoneNumber: response.data.phoneNumber || '010-XXXX-XXXX',
          email: response.data.email || '이메일 입력하기',
        });
      } else {
        console.error(`사용자 정보 조회 실패: ${response.message}`);
        alert(`사용자 정보 조회 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('사용자 정보 조회 중 오류:', error);
      alert('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (field, value) => {
    try {
      setSaving(true);
      const updateData = {
        [field]: value
      };
      
      const response = await userService.updateUserInfo(sessionStorage.getItem("userId"), updateData);
      
      if (response.isSuccess === true) {
        console.log("사용자 정보 수정 성공");
        return true;
      } else {
        console.error(`사용자 정보 수정 실패: ${response.message}`);
        alert(`사용자 정보 수정 실패: ${response.message}`);
        return false;
      }
    } catch (error) {
      console.error('사용자 정보 수정 중 오류:', error);
      alert('사용자 정보 수정 중 오류가 발생했습니다.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (key) => {
    setEditField(key);
    setTempValue(editedInfo[key]);
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue('');
  };

  const handleSave = async () => {
    if (tempValue.trim() === '') {
      alert('값을 입력해주세요.');
      return;
    }

    const success = await updateUserInfo(editField, tempValue);
    
    if (success) {
      setEditedInfo((prev) => ({
        ...prev,
        [editField]: tempValue,
      }));
      setEditField(null);
      setTempValue('');
    }
  };

  if (loading) {
    return (
      <div style={{
        border: '1px solid #1C1B1F',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div>사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #1C1B1F',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {fields.map(({ label, key }, idx) => (
        <div
          key={key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: idx < fields.length - 1 ? '1px solid #ccc' : 'none',
            opacity: saving && editField === key ? 0.6 : 1,
          }}
        >
          {editField === key ? (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px' }}>{label}</div>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '6px', 
                  fontSize: '14px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                disabled={saving}
              />
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#0C198C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ccc',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !saving && handleEditClick(key)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>{label}</span>
              <span style={{ fontSize: '14px', fontWeight: '500', marginRight: '10px', flex: 1, textAlign: 'right' }}>
                {editedInfo[key]}
              </span>
              <span style={{ fontSize: '18px', color: 'black', fontWeight: '500' }}>{'>'}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserInfoBox;