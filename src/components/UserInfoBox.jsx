import React, { useState } from 'react';

function UserInfoBox() {
  const [editedInfo, setEditedInfo] = useState({
    nickname: '사용자',
    phone: '010-XXXX-XXXX',
    email: '이메일 입력하기',
  });

  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const fields = [
    { label: '닉네임', key: 'nickname' },
    { label: '휴대전화', key: 'phone' },
    { label: '이메일', key: 'email' },
  ];

  const handleEditClick = (key) => {
    setEditField(key);
    setTempValue(editedInfo[key]);
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue('');
  };

  const handleSave = () => {
    setEditedInfo((prev) => ({
      ...prev,
      [editField]: tempValue,
    }));
    setEditField(null);
  };

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
          }}
        >
          {editField === key ? (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px' }}>{label}</div>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px' }}
              />
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={handleSave}>저장</button>
                <button onClick={handleCancel}>취소</button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleEditClick(key)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                cursor: 'pointer',
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
