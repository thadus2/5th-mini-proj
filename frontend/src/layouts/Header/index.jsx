// Header.jsx
import React, { useEffect, useState } from 'react';
import './style.css';
import Navigator from '../Navigator';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoIcon from '../assets/image/logo.png';
import { deleteCookie, getCookie } from '../../utils/cookie';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
        const token = getCookie('accessToken');
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        deleteCookie('accessToken');
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다.');
        navigate('/sign-in');
    };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left" onClick={() => navigate('/')}>
          <img className="header-logo" src={LogoIcon} alt="AI Books Logo" />
          <h1>AI Books</h1>
        </div>

        <Navigator />

        <div className="header-right">
          {isLoggedIn ? (
            <button type="button" className="header-logout-btn" onClick={() => navigate('/my-page')}>
              마이페이지
            </button>
          ) : (
            <button type="button" className="header-login-btn" onClick={() => navigate('/sign-in')}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}