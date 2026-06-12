import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { USER_ME_API, MY_BOOKS_API } from '../../apis/api';
import { getCookie, deleteCookie } from '../../utils/cookie';
import Toast from '../../components/Books/Toast';

export default function MyPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

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
        loadMyPageData();
    }, []);

    const loadMyPageData = async () => {
        const authHeader = getAuthHeader();

        if (!authHeader) {
            showToast('로그인이 필요한 페이지입니다.', 'warning');

            setTimeout(() => {
                navigate('/sign-in');
            }, 700);

            return;
        }

        try {
            const userResponse = await fetch(USER_ME_API, {
                method: 'GET',
                headers: {
                    ...authHeader
                }
            });

            if (userResponse.status === 401 || userResponse.status === 403) {
                deleteCookie('accessToken');
                showToast('로그인 정보가 만료되었습니다. 다시 로그인해 주세요.', 'error');

                setTimeout(() => {
                    navigate('/sign-in');
                }, 700);

                return;
            }

            if (!userResponse.ok) {
                const message = await getErrorMessage(userResponse, '회원 정보를 불러오지 못했습니다.');
                showToast(message, 'error');
                setLoading(false);
                return;
            }

            const userData = await userResponse.json();

            const booksResponse = await fetch(MY_BOOKS_API, {
                method: 'GET',
                headers: {
                    ...authHeader
                }
            });

            if (booksResponse.status === 401 || booksResponse.status === 403) {
                deleteCookie('accessToken');
                showToast('로그인 정보가 만료되었습니다. 다시 로그인해 주세요.', 'error');

                setTimeout(() => {
                    navigate('/sign-in');
                }, 700);

                return;
            }

            if (!booksResponse.ok) {
                const message = await getErrorMessage(booksResponse, '내 도서 목록을 불러오지 못했습니다.');
                showToast(message, 'error');
                setUser(userData);
                setMyBooks([]);
                setLoading(false);
                return;
            }

            const booksData = await booksResponse.json();
                console.log(userData);
            setUser(userData);
            setMyBooks(booksData);
            setLoading(false);
        } catch (error) {
            console.error('마이페이지 데이터 조회 실패:', error);
            showToast('서버와 통신 중 오류가 발생했습니다.', 'error');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        deleteCookie('accessToken');
        showToast('로그아웃 되었습니다.', 'success');

        setTimeout(() => {
            navigate('/sign-in');
        }, 700);
    };

    const totalLikes = myBooks.reduce((sum, book) => sum + (book.likeCount || 0), 0);
    const totalViews = myBooks.reduce((sum, book) => sum + (book.viewCount || 0), 0);

    if (loading) {
        return (
            <>
                <Toast message={toast.message} type={toast.type} />

                <div className="mypage-container">
                    <div className="mypage-loading-card">
                        회원 정보를 불러오는 중입니다...
                    </div>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Toast message={toast.message} type={toast.type} />

                <div className="mypage-container">
                    <div className="mypage-loading-card">
                        회원 정보를 표시할 수 없습니다.
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Toast message={toast.message} type={toast.type} />

            <div className="mypage-container">
                <section className="mypage-hero">
                    <div>
                        <p className="mypage-eyebrow">My Library</p>
                        <h2>마이페이지</h2>
                        <p>
                            내 계정 정보와 도서 활동 내역을 한눈에 확인할 수 있습니다.
                        </p>
                    </div>

                    <div className="mypage-hero-actions">
                        <button
                            type="button"
                            className="mypage-action-btn"
                            onClick={() => navigate('/my-page/edit')}
                        >
                            회원정보 수정
                        </button>

                        <button
                            type="button"
                            className="mypage-action-btn"
                            onClick={() => navigate('/my-page/password')}
                        >
                            비밀번호 변경
                        </button>

                        <button
                            type="button"
                            className="mypage-logout-btn"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </div>
                </section>

                <section className="mypage-grid">
                    <div className="mypage-profile-card">
                        {user.userProfileImage ? 
                            <img 
                                className="profile-image"
                                src={user.userProfileImage} 
                            />
                        : <div className="profile-avatar">
                            {user.nickName ? user.nickName.slice(0, 1) : 'U'}
                        </div>
                        }

                        <div className="profile-main">
                            <p className="profile-label">Profile</p>
                            <h3>{user.nickName || '닉네임 없음'}</h3>
                            <p>{user.name || '이름 없음'}님의 도서 컬렉션 공간입니다.</p>
                        </div>

                        <div className="profile-info-list">
                            <div className="profile-info-item">
                                <span>아이디</span>
                                <strong>{user.loginId || '정보 없음'}</strong>
                            </div>

                            <div className="profile-info-item">
                                <span>이름</span>
                                <strong>{user.name || '정보 없음'}</strong>
                            </div>

                            <div className="profile-info-item">
                                <span>닉네임</span>
                                <strong>{user.nickName || '정보 없음'}</strong>
                            </div>

                            <div className="profile-info-item">
                                <span>나이</span>
                                <strong>{user.age ? `${user.age}세` : '정보 없음'}</strong>
                            </div>

                            <div className="profile-info-item">
                                <span>이메일</span>
                                <strong>{user.email || '정보 없음'}</strong>
                            </div>

                            <div className="profile-info-item">
                                <span>전화번호</span>
                                <strong>{user.phoneNumber || '등록 없음'}</strong>
                            </div>

                            <div className="profile-info-item">
                                <span>주소</span>
                                <strong>{user.address || '정보 없음'}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="mypage-summary-area">
                        <div className="summary-card">
                            <span>총 게시물</span>
                            <strong>{myBooks.length}</strong>
                            <p>내가 등록한 도서 수</p>
                        </div>

                        <div className="summary-card">
                            <span>총 좋아요</span>
                            <strong>{totalLikes}</strong>
                            <p>등록 도서가 받은 좋아요</p>
                        </div>

                        <div className="summary-card">
                            <span>총 조회수</span>
                            <strong>{totalViews}</strong>
                            <p>등록 도서의 누적 조회수</p>
                        </div>
                    </div>
                </section>

                <section className="mypage-books-section">
                    <div className="mypage-section-title">
                        <div>
                            <p className="mypage-eyebrow">My Books</p>
                            <h3>내가 등록한 도서</h3>
                        </div>
                        <span>{myBooks.length}권</span>
                    </div>

                    <div className="mypage-book-list">
                        {myBooks.length > 0 ? (
                            myBooks.map((book) => (
                                <article
                                    key={book.bookId}
                                    className="mypage-book-card"
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/books/${book.bookId}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            navigate(`/books/${book.bookId}`);
                                        }
                                    }}
                                >
                                    <div>
                                        <p className="book-genre">{book.genre || '장르 없음'}</p>
                                        <h4>{book.title || '제목 없음'}</h4>
                                        <p className="book-author">{book.author || '작가 없음'}</p>
                                    </div>

                                    <div className="book-stats">
                                        <span>좋아요 {book.likeCount ?? 0}</span>
                                        <span>조회수 {book.viewCount ?? 0}</span>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="mypage-account-note">
                                <p>아직 내가 등록한 도서가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}