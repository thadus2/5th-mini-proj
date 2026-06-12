import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // 🌟 외부 CSS 파일 임포트 유지
import { SIGNUP_API } from '../../../apis/api';

export default function SignUpForm() {
    // 1. 백엔드 User 엔티티 규격에 맞춘 8개 상태(State) 정의
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nickName, setNickName] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // 선택 입력
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        // 필수 항목 유효성 검사 (phoneNumber는 null 허용이므로 검사 제외)
        if (
            !loginId.trim() || 
            !password.trim() || 
            !name.trim() || 
            !nickName.trim() || 
            !age.trim() || 
            !email.trim() || 
            !address.trim()
        ) {
            alert('필수 항목을 모두 입력해 주세요.');
            return;
        }

        try {
            const response = await fetch(`${SIGNUP_API}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    loginId, 
                    password, 
                    name, 
                    nickName, 
                    age: Number(age),
                    phoneNumber: phoneNumber.trim() || null,
                    email, 
                    address 
                }),
            });

            const message = await response.text();

            if (response.ok) {
                alert(`회원가입이 완료되었습니다!\n환영합니다 ${nickName}님! 🎉`);
                navigate('/sign-in');
            } else {
                alert(message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 통신 에러:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">회원가입</h2>
                <form onSubmit={handleSignUp} className="signup-form">
                    
                    <div className="signup-input-group">
                        <label className="signup-input-label">아이디</label>
                        <input
                            type="text"
                            placeholder="사용할 아이디를 입력하세요 (최대 16자)"
                            maxLength={16}
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">비밀번호</label>
                        <input
                            type="password"
                            placeholder="사용할 비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">이름</label>
                        <input
                            type="text"
                            placeholder="본인의 이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">닉네임</label>
                        <input
                            type="text"
                            placeholder="화면에 표시될 닉네임을 입력하세요"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">나이</label>
                        <input
                            type="number"
                            placeholder="나이를 입력하세요"
                            min="1"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">전화번호 (선택)</label>
                        <input
                            type="tel"
                            placeholder="010-XXXX-XXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">이메일</label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-input-label">주소</label>
                        <input
                            type="text"
                            placeholder="주소를 입력하세요"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="signup-input"
                        />
                    </div>

                    <button type="submit" className="signup-button">
                        회원가입 완료
                    </button>
                </form>
            </div>
        </div>
    );
}