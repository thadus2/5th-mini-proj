import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { SIGNIN_API } from '../../../apis/api';
import Toast from '../../Books/Toast';


export default function SignInForm() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const setTokenCookie = (name, value, maxAgeMs) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + maxAgeMs);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const now = new Date();
        const MAX_AGE_MS = 2 * 60 * 60 * 1000;
        
        if (!loginId.trim() || !password.trim()) {
            alert('아이디와 비밀번호를 모두 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch(`${SIGNIN_API}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loginId, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.accessToken) {
                    setTokenCookie('accessToken', data.accessToken, MAX_AGE_MS);
                }

                alert('로그인에 성공하였습니다. 환영합니다! 🎉');

                navigate('/');
                
            } else {
                const errorData = await response.json();
                alert(errorData.message || '로그인 정보가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('로그인 통신 에러:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <h2 className="signin-title">로그인</h2>
                <form onSubmit={handleLogin} className="signin-form">
                    <div className="input-group">
                        <label className="input-label">아이디</label>
                        <input
                            type="text"
                            placeholder="아이디를 입력하세요"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="signin-input"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">비밀번호</label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signin-input"
                        />
                    </div>
                    <button type="submit" className="signin-button">
                        로그인
                    </button>
                </form>
                <div className="signin-footer">
                    회원이 아니신가요? 
                    <span 
                        onClick={() => navigate('/sign-up') }
                        className="signup-link"
                    >회원가입
                    </span>
                </div>
            </div>
        </div>
    );
}