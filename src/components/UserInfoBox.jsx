import React, { useState } from 'react';

function UserInfoBox() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    nickname: '심심한 호랑이',
    phone: '010-1234-5678',
    email: 'horang12@gachon.ac.kr'
  });

  const handleChange = (field, value) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // 실제 저장 로직 추가 가능 (예: axios.post)
    setIsEditing(false);
    console.log('저장된 정보:', editedInfo);
  };

  return (
    <div style={{
      border: '1px solid #1C1B1F',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      overflow: 'hidden',
    }}>
      {!isEditing ? (
        [
          { label: '닉네임', key: 'nickname', value: editedInfo.nickname },
          { label: '휴대전화', key: 'phone', value: editedInfo.phone },
          { label: '이메일', key: 'email', value: editedInfo.email },
        ].map((item, idx, arr) => (
          <div
            key={item.key}
            onClick={() => setIsEditing(true)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '11px 20px',
              borderBottom: idx < arr.length - 1 ? '1px solid #ccc' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{item.label}</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.value}</span>
            </div>
            <span style={{ fontSize: '18px', color: 'black', fontWeight: '500' }}>{'>'}</span>
          </div>
        ))
      ) : (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label>
            닉네임
            <input type="text" value={editedInfo.nickname} onChange={(e) => handleChange('nickname', e.target.value)} style={{ width: '100%' }} />
          </label>
          <label>
            휴대전화
            <input type="text" value={editedInfo.phone} onChange={(e) => handleChange('phone', e.target.value)} style={{ width: '100%' }} />
          </label>
          <label>
            이메일
            <input type="email" value={editedInfo.email} onChange={(e) => handleChange('email', e.target.value)} style={{ width: '100%' }} />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setIsEditing(false)}>취소</button>
            <button onClick={handleSave}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfoBox;
