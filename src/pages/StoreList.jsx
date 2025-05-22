// pages/StoreList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FixedLayout from "../components/FixedLayout";

const StoreList = () => {
  const navigate = useNavigate();

  const stores = [
    {
      name: "BHC-가천대점",
      address: "성남시 중원구 태평동",
      minOrder: "29,000",
      deliveryTime: "40~50분"
    },
    {
      name: "교촌치킨-복정점",
      address: "성남시 중원구 복정동",
      minOrder: "27,000",
      deliveryTime: "45~55분"
    },
    {
      name: "굽네치킨-성남점",
      address: "성남시 중원구 태평동",
      minOrder: "29,000",
      deliveryTime: "40~50분"
    },
    {
      name: "맘스터치-복정점",
      address: "성남시 중원구 복정동",
      minOrder: "29,000",
      deliveryTime: "40~50분"
    }
  ];

  return (
    <FixedLayout>
      <Header title="가게 리스트" />

      <div style={{ padding: '13px', fontSize: '16px', fontWeight: '500' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
          ← 글 목록
        </span>
      </div>

      <main style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
        {stores.map((store, idx) => (
          <div key={idx} style={{ marginBottom: '20px',cursor: 'pointer' }} onClick={() => navigate('/menu-select', { state: store })}>
            <hr style={{ border: 'none', borderTop: '1px solid #ccc',margin: '0px 0'}}
      />
            <h3 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 8px 0' }}>
              [{store.name}]
            </h3>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>{store.address}</p>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>최소 배달 금액 {store.minOrder}</p>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>배달 예상 시간 {store.deliveryTime}</p>
            
          </div>
        ))}
      </main>

      <BottomNav />
    </FixedLayout>
  );
};

export default StoreList;
