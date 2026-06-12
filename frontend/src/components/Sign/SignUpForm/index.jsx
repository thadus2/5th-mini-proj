import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { SIGNUP_API } from '../../../apis/api';
import Toast from '../../Books/Toast';

export default function SignUpForm() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nickName, setNickName] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [toast, setToast] = useState({
        message: '',
        type: 'success'
    });

    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });

        setTimeout(() => {
            setToast({ message: '', type: 'success' });
        }, 2200);
    };

    const getSignUpErrorMessage = async (response) => {
        try {
            const text = await response.text();

            if (!text) {
                return '회원가입에 실패했습니다.';
            }

            try {
                const json = JSON.parse(text);
                return json.message || json.error || text;
            } catch (error) {
                return text;
            }
        } catch (error) {
            return '회원가입에 실패했습니다.';
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (
            !loginId.trim() ||
            !password.trim() ||
            !name.trim() ||
            !nickName.trim() ||
            !age.trim() ||
            !email.trim() ||
            !address.trim()
        ) {
            showToast('필수 항목을 모두 입력해 주세요.', 'warning');
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

            if (response.ok) {
                showToast(`회원가입이 완료되었습니다!\n환영합니다 ${nickName}님! 🎉`, 'success');

                setTimeout(() => {
                    navigate('/sign-in');
                }, 700);

                return;
            }

            const errorMessage = await getSignUpErrorMessage(response);
            showToast(errorMessage || '회원가입에 실패했습니다.', 'error');
        } catch (error) {
            console.error('회원가입 통신 에러:', error);
            showToast('서버와 통신 중 오류가 발생했습니다.', 'error');
        }
    };

    return (
        <>
            <Toast message={toast.message} type={toast.type} />

            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-title-area">
                        <p className="signup-eyebrow">Create Account</p>
                        <h2 className="signup-title">회원가입</h2>
                        <p className="signup-description">
                            기본 정보를 입력하고 나만의 도서 컬렉션을 시작해 보세요.
                        </p>
                    </div>

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
                            <label className="signup-input-label">전화번호 선택</label>
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

                    <div className="signup-footer">
                        <span>이미 계정이 있으신가요?</span>
                        <button
                            type="button"
                            onClick={() => navigate('/sign-in')}
                            className="signin-link"
                        >
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}