// Header.jsx
import React from 'react';
import './style.css';
import Navigator from '../Navigator';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../assets/image/logo.png';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left" onClick={() => navigate('/')}>
          <img className="header-logo" src={LogoIcon} alt="AI Books Logo" />
          <h1>AI Books</h1>
        </div>

        <Navigator />

        <div className="header-right">
          <button type="button" className="header-login-btn">
            로그인
          </button>

          <button type="button" className="header-signup-btn">
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;