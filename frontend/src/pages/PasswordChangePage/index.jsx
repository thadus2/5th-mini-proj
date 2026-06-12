import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyPage/style.css';
import { PASSWORD_CHANGE_API } from '../../apis/api';
import { getCookie, deleteCookie } from '../../utils/cookie';
import Toast from '../../components/Books/Toast';

export default function PasswordChangePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordCheck: ''
    });

    const [toast, setToast] = useState({
        message: '',
        type: 'success'
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });

        setTimeout(() => {
            setToast({ message: '', type: 'success' });
        }, 2200);
    };

    const getAuthHeader = () => {
        const token = getCookie('accessToken');

        if (!token) return null;

        return {
            Authorization: `Bearer ${token}`
        };
    };

    const getErrorMessage = async (response, fallbackMessage) => {
        try {
            const text = await response.text();

            if (!text) return fallbackMessage;

            try {
                const json = JSON.parse(text);
                return json.message || json.error || fallbackMessage;
            } catch (error) {
                return text;
            }
        } catch (error) {
            return fallbackMessage;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.currentPassword.trim()) {
            showToast('현재 비밀번호를 입력해 주세요.', 'warning');
            return;
        }

        if (!form.newPassword.trim()) {
            showToast('새 비밀번호를 입력해 주세요.', 'warning');
            return;
        }

        if (form.newPassword !== form.newPasswordCheck) {
            showToast('새 비밀번호가 일치하지 않습니다.', 'warning');
            return;
        }

        const authHeader = getAuthHeader();

        if (!authHeader) {
            showToast('로그인이 필요한 기능입니다.', 'warning');
            navigate('/sign-in');
            return;
        }

        try {
            const response = await fetch(PASSWORD_CHANGE_API, {
                method: 'PATCH',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                })
            });

            if (response.status === 401 || response.status === 403) {
                deleteCookie('accessToken');
                showToast('로그인 정보가 만료되었습니다. 다시 로그인해 주세요.', 'error');

                setTimeout(() => {
                    navigate('/sign-in');
                }, 700);

                return;
            }

            if (!response.ok) {
                const message = await getErrorMessage(response, '비밀번호 변경에 실패했습니다.');
                showToast(message, 'error');
                return;
            }

            showToast('비밀번호가 성공적으로 변경되었습니다.', 'success');

            setTimeout(() => {
                navigate('/my-page');
            }, 700);
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            showToast('서버와 통신 중 오류가 발생했습니다.', 'error');
        }
    };

    return (
        <>
            <Toast message={toast.message} type={toast.type} />

            <div className="mypage-container">
                <section className="mypage-hero">
                    <div>
                        <p className="mypage-eyebrow">Security</p>
                        <h2>비밀번호 변경</h2>
                        <p>현재 비밀번호 확인 후 새 비밀번호로 변경할 수 있습니다.</p>
                    </div>

                    <button
                        type="button"
                        className="mypage-logout-btn"
                        onClick={() => navigate('/my-page')}
                    >
                        돌아가기
                    </button>
                </section>

                <section className="mypage-books-section">
                    <form className="mypage-edit-form" onSubmit={handleSubmit}>
                        <div className="mypage-input-group full">
                            <label>현재 비밀번호</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="현재 비밀번호"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>새 비밀번호</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="새 비밀번호"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>새 비밀번호 확인</label>
                            <input
                                type="password"
                                name="newPasswordCheck"
                                value={form.newPasswordCheck}
                                onChange={handleChange}
                                placeholder="새 비밀번호 확인"
                            />
                        </div>

                        <button type="submit" className="mypage-submit-btn">
                            비밀번호 변경
                        </button>
                    </form>
                </section>
            </div>
        </>
    );
}