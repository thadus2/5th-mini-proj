import { useEffect, useState } from 'react';
import './App.css';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import BookList from './components/Books/BookList';
import BookDetail from './components/Books/BookDetail';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import BookCreatePage from './pages/BookCreatePage';
import BookEditPage from './pages/BookEditPage';
import AICoverGenPage from './pages/AICoverGenPage';
import MainPage from './pages/MainPage';
import { BOOK_API } from './apis/api';
import NotFoundPage from './pages/NotFoundPage';
import Toast from './components/Books/Toast';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import MyPageEdit from './pages/MyPageEdit';
import PasswordChangePage from './pages/PasswordChangePage';
import { getCookie } from './utils/cookie';

const PAGE_SIZE = 12;

export default function App() {
    const [posts, setPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [viewMode, setViewMode] = useState('card');
    const [currentPage, setCurrentPage] = useState(1);

    const [isGenreFilterOpen, setIsGenreFilterOpen] = useState(false);
    const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);

    const [toast, setToast] = useState({
        message: '',
        type: 'success'
    });

    const getAccessTokenFromCookie = () => {
        const cookies = document.cookie.split("; ");

        const accessTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("accessToken=")
        );

        return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
    };

    const genreFilterOptions = [
        { label: '전체 장르', value: '' },
        { label: '소설/문학', value: '소설/문학' },
        { label: '에세이/시', value: '에세이/시' },
        { label: '미스터리/SF', value: '미스터리/SF' },
        { label: '미스터리/드라마', value: '미스터리/드라마' },
        { label: 'IT/과학', value: 'IT/과학' },
        { label: '인문/사회', value: '인문/사회' },
        { label: '판타지', value: '판타지' },
        { label: '기타', value: '기타' }
    ];

    const sortOptions = [
        { label: '최신순', value: 'latest' },
        { label: '좋아요순', value: 'likes' },
        { label: '조회수순', value: 'views' }
    ];

    useEffect(() => {
        loadBookList();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, selectedGenre, sortBy]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });

        setTimeout(() => {
            setToast({ message: '', type: 'success' });
        }, 2200);
    };

    const getServerErrorMessage = (errorData, status) => {
        if (!errorData) {
            return `${status} 오류가 발생했습니다.`;
        }

        if (typeof errorData === 'string') {
            return errorData;
        }

        const fieldNameMap = {
            title: '도서 제목',
            author: '작성자',
            genre: '장르',
            content: '본문 내용',
            summary: '한 줄 요약',
            publisher: '출판사',
            coverImgUrl: '표지 이미지',
            likeCount: '좋아요 수',
            viewCount: '조회수'
        };

        const baseMessage =
            errorData.message ||
            errorData.error ||
            errorData.errorName ||
            errorData.title ||
            errorData.exception ||
            `${status} 오류가 발생했습니다.`;

        if (errorData.errors && typeof errorData.errors === 'object') {
            const detailMessage = Object.entries(errorData.errors)
                .map(([field, message]) => {
                    const fieldLabel = fieldNameMap[field] || field;
                    return `${fieldLabel}: ${message}`;
                })
                .join('\n');

            return `${baseMessage}\n${detailMessage}`;
        }

        return baseMessage;
    };

    const loadBookList = async () => {
        try {
            const response = await fetch(`${BOOK_API}`);
            const data = await response.json();

            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            setLoading(false);
            showToast('도서 목록을 불러오지 못했습니다.', 'error');
        }
    };

    const handleAddBook = async (newBook) => {
        const token = getAccessTokenFromCookie();

        try {
            const token = getCookie('accessToken');

            const res = await fetch(`${BOOK_API}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newBook)
            });

            let data = null;

            try {
                data = await res.json();
            } catch (error) {
                data = null;
            }

            if (!res.ok) {
                return {
                    success: false,
                    status: res.status,
                    message: data?.message || getServerErrorMessage(data, res.status),
                    error: data?.error,
                    errors: data?.errors
                };
            }

            setPosts([data, ...posts]);

            return {
                success: true,
                data
            };
        } catch (err) {
            console.error(err);

            return {
                success: false,
                message: '서버와 연결할 수 없습니다.'
            };
        }
    };
    const handleMultipleDelete = async () => {
        if (selectedIds.length === 0) {
            showToast('삭제할 도서를 먼저 선택해 주세요.', 'warning');
            return;
        }

        if (!window.confirm(`선택한 ${selectedIds.length}권의 도서를 정말 삭제하시겠습니까?`)) return;

        const token = getAccessTokenFromCookie();

        try {
            const results = await Promise.all(
                selectedIds.map(async (id) => {
                    const res = await fetch(`${BOOK_API}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!res.ok) {
                        let data = null;

                        try {
                            data = await res.json();
                        } catch (error) {
                            data = null;
                        }

                        throw new Error(getServerErrorMessage(data, res.status));
                    }

                    return id;
                })
            );

            setPosts(posts.filter(book => !selectedIds.includes(book.bookId)));
            setSelectedIds([]);

            showToast('선택한 도서가 삭제되었습니다.', 'success');

            await loadBookList();
        } catch (err) {
            console.error('삭제 실패:', err);
            showToast(err.message || '일부 도서 삭제에 실패했습니다.', 'error');
        }
    };
/*
    const handleMultipleDelete = async () => {
        if (selectedIds.length === 0) {
            showToast('삭제할 도서를 먼저 선택해 주세요.', 'warning');
            return;
        }

        if (!window.confirm(`선택한 ${selectedIds.length}권의 도서를 정말 삭제하시겠습니까?`)) return;

        try {
            await Promise.all(
                selectedIds.map(id =>
                    fetch(`${BOOK_API}/${id}`, { method: 'DELETE' })
                )
            );

            setPosts(posts.filter(book => !selectedIds.includes(book.bookId)));
            setSelectedIds([]);

            showToast('선택한 도서가 삭제되었습니다.', 'success');

            await loadBookList();
        } catch (err) {
            console.error('삭제 실패:', err);

            showToast('일부 도서 삭제에 실패했습니다.', 'error');
        }
    };*/
/*
    const handleEdit = async (id, edited) => {
        const token = getAccessTokenFromCookie();

        try {
            const res = await fetch(`${BOOK_API}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(edited)
            });

            let data = null;

            try {
                data = await res.json();
            } catch (error) {
                data = null;
            }

            if (!res.ok) {
                return {
                    success: false,
                    status: res.status,
                    message: getServerErrorMessage(data, res.status)
                };
            }

            setPosts(posts.map(p => p.bookId == id ? data : p));

            return {
                success: true,
                data
            };
        } catch (err) {
            console.error(err);

            return {
                success: false,
                message: '서버와 연결할 수 없습니다.'
            };
        }
    };*/
    const handleEdit = async (id, edited) => {
        const token = getAccessTokenFromCookie();

        try {
            const res = await fetch(`${BOOK_API}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(edited)
            });

            let data = null;

            try {
                data = await res.json();
            } catch (error) {
                data = null;
            }

            if (!res.ok) {
                return {
                    success: false,
                    status: res.status,
                    message: getServerErrorMessage(data, res.status)
                };
            }

            setPosts(posts.map(p => p.bookId == id ? data : p));

            return {
                success: true,
                data
            };
        } catch (err) {
            console.error(err);

            return {
                success: false,
                message: '서버와 연결할 수 없습니다.'
            };
        }
    };
    const handleLikesToggle = async (id) => {
        const likedKey = `liked-book-${id}`;
        const alreadyLiked = sessionStorage.getItem(likedKey) === 'true';
        const nextLiked = !alreadyLiked;

        try {
            const res = await fetch(`${BOOK_API}/${id}/likes?isLiked=${nextLiked}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                return {
                    success: false,
                    isLiked: alreadyLiked
                };
            }

            const update = await res.json();

            if (nextLiked) {
                sessionStorage.setItem(likedKey, 'true');
            } else {
                sessionStorage.removeItem(likedKey);
            }

            setPosts(prevPosts =>
                prevPosts.map(p => p.bookId == id ? { ...p, likeCount: update.likeCount } : p)
            );

            return {
                success: true,
                isLiked: nextLiked,
                data: update
            };
        } catch (err) {
            console.error(err);

            return {
                success: false,
                isLiked: alreadyLiked
            };
        }
    };

    const handleSelectToggle = (bookId) => {
        if (selectedIds.includes(bookId)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== bookId));
        } else {
            setSelectedIds([...selectedIds, bookId]);
        }
    };

    function BookRouteGuard({ children }) {
        const { bookId } = useParams();

        const foundBook = posts.find(book => String(book.bookId) === String(bookId));

        if (!foundBook) {
            return <NotFoundPage />;
        }

        return children;
    }

    if (loading) {
        return <p>로딩중 입니다...</p>;
    }

    const filteredPosts = posts
        .filter(post =>
            post.title && post.title.includes(searchKeyword)
        )
        .filter(post =>
            selectedGenre === '' || post.genre === selectedGenre
        )
        .sort((a, b) => {
            if (sortBy === 'likes') return (b.likeCount || 0) - (a.likeCount || 0);
            if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0);
            return (b.bookId || 0) - (a.bookId || 0);
        });

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const pageStartIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    const pageEndIndex = pageStartIndex + PAGE_SIZE;

    const paginatedPosts = filteredPosts.slice(pageStartIndex, pageEndIndex);

    const pageStartNumber = filteredPosts.length === 0 ? 0 : pageStartIndex + 1;
    const pageEndNumber = Math.min(pageEndIndex, filteredPosts.length);

    return (
        <HashRouter>
            <Toast message={toast.message} type={toast.type} />

            <div className="app-layout">
                <Header />

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<MainPage />} />

                        <Route path="/my-page" element={<MyPage posts={posts} />} />

                        <Route path="/my-page/edit" element={<MyPageEdit />} />

                        <Route path="/my-page/password" element={<PasswordChangePage />} />

                        <Route path="/books" element={
                            <div className="book-list-page">
                                <section className="book-list-hero">
                                    <div>
                                        <p className="book-list-eyebrow">도서 컬렉션</p>
                                        <h2>전체 도서</h2>
                                        <p>
                                            등록된 도서를 장르별로 확인하고, 최신순·좋아요순·조회수순으로 정렬할 수 있습니다.
                                        </p>
                                    </div>

                                    <div className="book-list-count">
                                        <span>등록 도서</span>
                                        <strong>{posts.length}권</strong>
                                    </div>
                                </section>

                                <div className="book-list-header">
                                    <div className="book-list-filters">
                                        <div className={`list-filter-select ${isGenreFilterOpen ? 'open' : ''}`}>
                                            <button
                                                type="button"
                                                className="list-filter-trigger"
                                                onClick={() => {
                                                    setIsGenreFilterOpen(prev => !prev);
                                                    setIsSortFilterOpen(false);
                                                }}
                                            >
                                                <span>
                                                    {genreFilterOptions.find(option => option.value === selectedGenre)?.label || '전체 장르'}
                                                </span>
                                                <span className="list-filter-arrow" />
                                            </button>

                                            {isGenreFilterOpen && (
                                                <div className="list-filter-menu">
                                                    {genreFilterOptions.map((option) => (
                                                        <button
                                                            type="button"
                                                            key={option.label}
                                                            className={`list-filter-option ${selectedGenre === option.value ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setSelectedGenre(option.value);
                                                                setIsGenreFilterOpen(false);
                                                            }}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className={`list-filter-select ${isSortFilterOpen ? 'open' : ''}`}>
                                            <button
                                                type="button"
                                                className="list-filter-trigger"
                                                onClick={() => {
                                                    setIsSortFilterOpen(prev => !prev);
                                                    setIsGenreFilterOpen(false);
                                                }}
                                            >
                                                <span>
                                                    {sortOptions.find(option => option.value === sortBy)?.label || '최신순'}
                                                </span>
                                                <span className="list-filter-arrow" />
                                            </button>

                                            {isSortFilterOpen && (
                                                <div className="list-filter-menu">
                                                    {sortOptions.map((option) => (
                                                        <button
                                                            type="button"
                                                            key={option.value}
                                                            className={`list-filter-option ${sortBy === option.value ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setSortBy(option.value);
                                                                setIsSortFilterOpen(false);
                                                            }}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <form
                                            className="book-list-search"
                                            onSubmit={(e) => e.preventDefault()}
                                        >
                                            <input
                                                type="text"
                                                placeholder="도서 검색"
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                            />
                                        </form>

                                        <div className="book-view-mode-group">
                                            <button
                                                type="button"
                                                className={`book-view-mode-btn ${viewMode === 'card' ? 'active' : ''}`}
                                                onClick={() => setViewMode('card')}
                                            >
                                                카드 보기
                                            </button>

                                            <button
                                                type="button"
                                                className={`book-view-mode-btn ${viewMode === 'circle' ? 'active' : ''}`}
                                                onClick={() => setViewMode('circle')}
                                            >
                                                360 보기
                                            </button>
                                        </div>

                                        <div className="book-page-control">
                                            <button
                                                type="button"
                                                className="book-page-btn"
                                                disabled={safeCurrentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            >
                                                이전
                                            </button>

                                            <span className="book-page-info">
                                                {safeCurrentPage} / {totalPages}
                                            </span>

                                            <button
                                                type="button"
                                                className="book-page-btn"
                                                disabled={safeCurrentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            >
                                                다음
                                            </button>

                                            <span className="book-page-count">
                                                {pageStartNumber}-{pageEndNumber} / {filteredPosts.length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="book-list-actions">

                                        <Link to="/create" className="book-register-btn">
                                            도서 등록
                                        </Link>
                                    </div>
                                </div>

                                <BookList
                                    posts={paginatedPosts}
                                    selectedIds={selectedIds}
                                    onSelectToggle={handleSelectToggle}
                                    viewMode={viewMode}
                                />
                            </div>
                        } />

                        <Route path="/books/:bookId" element={
                            <BookRouteGuard>
                                <BookDetail
                                    posts={posts}
                                    onLikesToggle={handleLikesToggle}
                                />
                            </BookRouteGuard>
                        } />

                        <Route
                            path="/create"
                            element={<BookCreatePage onAdd={handleAddBook} />}
                        />

                        <Route
                            path="/books/:bookId/edit"
                            element={
                                <BookRouteGuard>
                                    <BookEditPage
                                        onEdit={handleEdit}
                                        posts={posts}
                                    />
                                </BookRouteGuard>
                            }
                        />

                        <Route
                            path="/books/new/ai-gen"
                            element={
                                <AICoverGenPage
                                    posts={posts}
                                    onEdit={handleEdit}
                                />
                            }
                        />

                        <Route
                            path="/books/:bookId/ai-gen"
                            element={
                                <BookRouteGuard>
                                    <AICoverGenPage
                                        posts={posts}
                                        onEdit={handleEdit}
                                    />
                                </BookRouteGuard>
                            }
                        />

                        <Route path="/sign-in" element={<SignInPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </HashRouter>
    );
}