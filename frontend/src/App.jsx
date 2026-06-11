import { useEffect, useState } from 'react'
import './App.css'
import Header from './layouts/Header'
import Footer from './layouts/Footer';
import BookList from './components/Books/BookList';
import BookForm from './components/Books/BookForm';
import BookDetail from './components/Books/BookDetail';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import BookCreatePage from './pages/BookCreatePage';
import BookEditPage from './pages/BookEditPage';
import AICoverGenPage from './pages/AICoverGenPage';
import MainPage from './pages/MainPage';

export default function App() {
    const [posts, setPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(''); // 선택된 장르 상태
    const [sortBy, setSortBy] = useState('latest');

    const BASE_URL = 'http://localhost:8080/api/v1';
    const BOOK_API = '/books';

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await fetch(`${BASE_URL}${BOOK_API}`);
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            setLoading(false);
        }
    };

    const handleAddBook = async (newBook) => {
        try {
            const res = await fetch(`${BASE_URL}${BOOK_API}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newBook)
            });
            const data = await res.json();
            setPosts([data, ...posts]);
            alert('도서 등록이 완료되었습니다.'); 
        } catch(err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}${BOOK_API}/${id}`, { method: 'DELETE' });
            // books ➡️ posts 로 수정 완료!
            await loadBooks();
            alert('도서 삭제가 완료되었습니다.');
            // 🚨 navigate 제거됨
            return true;
        } catch(err) {
            console.error(err);
            alert('도서 삭제에 실패했습니다.');
            return false;
        }
    };
    const handleMultipleDelete = async () => {
        if (selectedIds.length === 0) {
            alert("삭제할 도서를 먼저 선택해 주세요!");
            return;
        }
        if (!window.confirm(`선택한 ${selectedIds.length}권의 도서를 정말 삭제하시겠습니까?`)) return;

        try {
            await Promise.all(
                selectedIds.map(id => 
                    fetch(`${BASE_URL}${BOOK_API}/${id}`, { method: 'DELETE' })
                )
            );

            setPosts(posts.filter(book => !selectedIds.includes(book.id)));
            setSelectedIds([]);
            alert("선택한 도서가 삭제되었습니다.");
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("일부 도서 삭제에 실패했습니다.");
        }
    };
    const handleUpdate = async (id, updatedBook) => {
        try {
            const res = await fetch(
                `${BASE_URL}${BOOK_API}/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedBook)
                }
            );

            if (!res.ok) {
                throw new Error('수정 실패');
            }

            const data = await res.json();

            setPosts(
                posts.map(book =>
                    book.bookId == id ? data : book
                )
            );

            setMessage('도서 수정이 완료되었습니다.');
            navigate(`/books/${id}`);

        } catch(err) {
            console.error(err);

            // 수정 실패 UI
            setMessage('도서 수정에 실패했습니다.');
        }
    };

    const handleEdit = async (id, edited) => {
        try {
            const res = await fetch(`${BASE_URL}${BOOK_API}/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(edited)
            });
            const update = await res.json();
            setPosts(posts.map(p => p.bookId == id ? update : p));
            return true;
        } catch(err) {
            console.error(err);
            return false;
        }
    };


    const handleViewsPlus = async (id) => {
        try {
            const book = posts.find(p => p.bookId === id);
            const res = await fetch(`${BASE_URL}${BOOK_API}/${id}/views`, {
                method:'PATCH',
                // headers: {'Content-Type': 'application/json'},
            });

            setPosts(posts.map(p => 
                p.bookId === id ? { ...p, viewCount: (p.viewCount || 0) + 1}
                : p));
        } catch(err) {
            console.error(err);
        }
    };

const handleLikesToggle = async (id, isLiked) => {
        try {
            const book = posts.find(p => p.bookId == id);
            const res = await fetch(`${BASE_URL}${BOOK_API}/${id}/likes?isLiked=${isLiked}`, {
                method:'PATCH',
                headers: {'Content-Type': 'application/json'},
            });
            const update = await res.json();
            setPosts(posts.map(p => p.bookId == id ? update : p));
        } catch(err) {
            console.error(err);
        }
    };
    
    const handleSelectToggle = (bookId) => {
        if (selectedIds.includes(bookId)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== bookId));
        } else {
            setSelectedIds([...selectedIds, bookId]);
        }
    };

    if (loading)
        return (
            <p>
                로딩중 입니다...
            </p>
        );

    return(
        <HashRouter>
            <Header 
                onSearchKeyword={setSearchKeyword}
            />
            <Routes>
                <Route path='/' element={
                    <MainPage />
                } />
                <Route path="/books" element={
                    <>
                        <div className="book-list-header">
                            <div className="book-list-filters">
                                <select 
                                    className="filter-select"
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                >
                                    <option value="">전체 장르</option>
                                    <option value="소설/문학">소설/문학</option>
                                    <option value="에세이/시">에세이/시</option>
                                    <option value="미스터리/SF">미스터리/SF</option>
                                    <option value="미스터리/드라마">미스터리/드라마</option>
                                    <option value="IT/과학">IT/과학</option>
                                    <option value="인문/사회">인문/사회</option>
                                    <option value="판타지">판타지</option>
                                </select>

                                <select 
                                    className="filter-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="latest">최신순</option>
                                    <option value="likes">좋아요순 ❤️</option>
                                    <option value="views">조회수순 👀</option>
                                </select>
                            </div>
                            <div className="book-list-actions">
                                <button 
                                    className="book-delete-btn"
                                    onClick={handleMultipleDelete}
                                >
                                    삭제
                                </button>
                                <Link to="/create">
                                    <button className="book-register-btn">
                                        도서 등록
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <BookList 
                            posts={posts
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
                                })
                            } 
                            selectedIds={selectedIds}          
                            onSelectToggle={handleSelectToggle} 
                        />
                    </>
                } />
                <Route path="/books/:bookId" element={
                        <BookDetail 
                            posts={posts}
                            onViewsPlus={handleViewsPlus}
                            onDelete={handleDelete}
                            onLikesToggle={handleLikesToggle}
                        /> 
                } />
                <Route 
                    path="/create" 
                    element={<BookCreatePage onAdd={handleAddBook} 
                />} />
                <Route 
                    path='/books/:bookId/edit'
                    element={<BookEditPage 
                    onEdit={handleEdit} 
                    posts={posts}/>} 
                />
                <Route 
                    path='/books/:bookId/ai-gen'
                    element={<AICoverGenPage
                        posts={posts}
                        onEdit={handleEdit}
                    />}
                />
            </Routes>
            <Footer />
        </HashRouter>
    );
}
