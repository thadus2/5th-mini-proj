import React from 'react';
import { deleteCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie('accessToken');
    alert('로그아웃 되었습니다.');
    navigate('/'); // 메인으로 이동
  };

  return (
    <div className="my-page-container">
      <h1>마이페이지</h1>
      {/* ... 마이페이지 상세 내용 ... */}

      <button
        type="button"
        className="header-logout-btn" // 헤더와 동일한 스타일 사용
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}