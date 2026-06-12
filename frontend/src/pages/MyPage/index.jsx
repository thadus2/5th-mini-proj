import './style.css';

export default function MyPage() {
    const user = {
        loginId: 'user123',
        name: '홍길동',
        nickName: '책읽는사람',
        age: 25,
        email: 'user@example.com',
        phoneNumber: '010-1234-5678',
        address: '서울특별시'
    };

    const activity = {
        registeredBooks: 8,
        totalLikes: 24,
        totalViews: 156
    };

    const myBooks = [
        {
            bookId: 1,
            title: '나의 첫 번째 도서',
            author: '홍길동',
            genre: '소설/문학',
            likeCount: 12,
            viewCount: 80
        },
        {
            bookId: 2,
            title: 'React로 만드는 도서 서비스',
            author: '홍길동',
            genre: 'IT/과학',
            likeCount: 8,
            viewCount: 52
        },
        {
            bookId: 3,
            title: '하루 한 권 독서 기록',
            author: '홍길동',
            genre: '에세이/시',
            likeCount: 4,
            viewCount: 24
        }
    ];

    const handleLogout = () => {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '#/sign-in';
    };

    return (
        <div className="mypage-container">
            <section className="mypage-hero">
                <div>
                    <p className="mypage-eyebrow">My Library</p>
                    <h2>마이페이지</h2>
                    <p>
                        내 계정 정보와 도서 활동 내역을 한눈에 확인할 수 있습니다.
                    </p>
                </div>

                <button
                    type="button"
                    className="mypage-logout-btn"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </section>

            <section className="mypage-grid">
                <div className="mypage-profile-card">
                    <div className="profile-avatar">
                        {user.nickName.slice(0, 1)}
                    </div>

                    <div className="profile-main">
                        <p className="profile-label">Profile</p>
                        <h3>{user.nickName}</h3>
                        <p>{user.name}님의 도서 컬렉션 공간입니다.</p>
                    </div>

                    <div className="profile-info-list">
                        <div className="profile-info-item">
                            <span>아이디</span>
                            <strong>{user.loginId}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>이름</span>
                            <strong>{user.name}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>나이</span>
                            <strong>{user.age}세</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>이메일</span>
                            <strong>{user.email}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>전화번호</span>
                            <strong>{user.phoneNumber || '등록 없음'}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>주소</span>
                            <strong>{user.address}</strong>
                        </div>
                    </div>
                </div>

                <div className="mypage-summary-area">
                    <div className="summary-card">
                        <span>등록 도서</span>
                        <strong>{activity.registeredBooks}</strong>
                        <p>내가 등록한 도서 수</p>
                    </div>

                    <div className="summary-card">
                        <span>총 좋아요</span>
                        <strong>{activity.totalLikes}</strong>
                        <p>등록 도서가 받은 좋아요</p>
                    </div>

                    <div className="summary-card">
                        <span>총 조회수</span>
                        <strong>{activity.totalViews}</strong>
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
                    {myBooks.map((book) => (
                        <article key={book.bookId} className="mypage-book-card">
                            <div>
                                <p className="book-genre">{book.genre}</p>
                                <h4>{book.title}</h4>
                                <p className="book-author">{book.author}</p>
                            </div>

                            <div className="book-stats">
                                <span>좋아요 {book.likeCount}</span>
                                <span>조회수 {book.viewCount}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}