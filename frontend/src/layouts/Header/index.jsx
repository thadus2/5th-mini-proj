// Header.jsx
import React, { useState } from 'react';
import { Search, CircleUserRound } from 'lucide-react';
import './style.css'; 
import Navigator from '../Navigator';
import { useNavigate } from 'react-router-dom';
import LogoIcon from '../assets/image/logo.png';

function Header({ onSearchKeyword }) {
  const [currentKeyword, setCurrentKeyword] = useState('');

  const navigate = useNavigate();

  const handleSearchKeyword = (e) => {
    e.preventDefault();
    onSearchKeyword(currentKeyword);
  }
  return (
    <header className="header">

      <div className="header-left" onClick={() => navigate('/')}>
        <img className='header-logo' src={LogoIcon} />
        <h1>AI Books</h1>
      </div>

      <Navigator />

      <div className="header-right">

        <div className="search-box">
          <span>🔍</span>

          <form onSubmit={handleSearchKeyword}> 
            <input 
              type='text'
              placeholder='검색'
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
            />
          </form>
        </div>

        <button className="profile-button">
          👤
        </button>

      </div>

    </header>
  );
}

export default Header