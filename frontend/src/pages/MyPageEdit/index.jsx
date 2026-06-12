import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyPage/style.css';
import { USER_ME_API, USER_UPDATE_API } from '../../apis/api';
import { getCookie, deleteCookie } from '../../utils/cookie';
import Toast from '../../components/Books/Toast';

export default function MyPageEdit() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: '',
        name: '',
        nickName: '',
        age: '',
        email: '',
        phoneNumber: '',
        address: ''
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

    useEffect(() => {
        loadMyInfo();
    }, []);

    const loadMyInfo = async () => {
        const authHeader = getAuthHeader();

        if (!authHeader) {
            showToast('로그인이 필요한 페이지입니다.', 'warning');

            setTimeout(() => {
                navigate('/sign-in');
            }, 700);

            return;
        }

        try {
            const response = await fetch(USER_ME_API, {
                method: 'GET',
                headers: {
                    ...authHeader
                }
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
                showToast('회원 정보를 불러오지 못했습니다.', 'error');
                return;
            }

            const data = await response.json();

            setForm(prev => ({
                ...prev,
                name: data.name || '',
                nickName: data.nickName || '',
                age: data.age || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || ''
            }));
        } catch (error) {
            console.error('회원 정보 조회 실패:', error);
            showToast('서버와 통신 중 오류가 발생했습니다.', 'error');
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

        const authHeader = getAuthHeader();

        if (!authHeader) {
            showToast('로그인이 필요한 기능입니다.', 'warning');
            navigate('/sign-in');
            return;
        }

        try {
            const response = await fetch(USER_UPDATE_API, {
                method: 'PUT',
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    name: form.name,
                    nickName: form.nickName,
                    age: form.age === '' ? null : Number(form.age),
                    email: form.email,
                    phoneNumber: form.phoneNumber,
                    address: form.address
                })
            });

            if (!response.ok) {
                const message = await getErrorMessage(response, '회원 정보 수정에 실패했습니다.');
                showToast(message, 'error');
                return;
            }

            showToast('회원 정보가 수정되었습니다.', 'success');

            setTimeout(() => {
                navigate('/my-page');
            }, 700);
        } catch (error) {
            console.error('회원 정보 수정 실패:', error);
            showToast('서버와 통신 중 오류가 발생했습니다.', 'error');
        }
    };

    return (
        <>
            <Toast message={toast.message} type={toast.type} />

            <div className="mypage-container">
                <section className="mypage-hero">
                    <div>
                        <p className="mypage-eyebrow">Edit Profile</p>
                        <h2>회원정보 수정</h2>
                        <p>회원정보를 수정하려면 현재 비밀번호 확인이 필요합니다.</p>
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
                            <label>현재 비밀번호 확인 *</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={form.currentPassword}
                                onChange={handleChange}
                                placeholder="현재 비밀번호를 입력하세요"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>이름</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="이름"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>닉네임</label>
                            <input
                                name="nickName"
                                value={form.nickName}
                                onChange={handleChange}
                                placeholder="닉네임"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>나이</label>
                            <input
                                type="number"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="나이"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>이메일</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="이메일"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>전화번호</label>
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="전화번호"
                            />
                        </div>

                        <div className="mypage-input-group">
                            <label>주소</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="주소"
                            />
                        </div>

                        <button type="submit" className="mypage-submit-btn">
                            수정 완료
                        </button>
                    </form>
                </section>
            </div>
        </>
    );
}