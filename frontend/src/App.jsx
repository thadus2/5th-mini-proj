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

    const BASE_URL = 'http://localhost:3000';
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
            setPosts(posts.filter(p => p.id !== id));
            alert('도서 삭제가 완료되었습니다.');
            // 🚨 navigate 제거됨
        } catch(err) {
            console.error(err);
            alert('도서 삭제에 실패했습니다.');
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

            // 서버 삭제 성공 후 화면(State)에서도 삭제 처리
            setPosts(posts.filter(book => !selectedIds.includes(book.id)));
            setSelectedIds([]); // 삭제 후 선택 초기화
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
                    book.id === id ? data : book
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
                method: 'PATCH', // 혹은 백엔드 스펙에 따라 PUT
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(edited)
            });
            const update = await res.json();
            // books ➡️ posts 로 수정 완료!
            setPosts(posts.map(p => p.id === id ? update : p));
        } catch(err) {
            console.error(err);
        }
    };
    const handleViewsPlus = async (id) => {
        try {
            // books ➡️ posts 로 수정 완료!
            const book = posts.find(p => p.id === id);
            const res = await fetch(`${BASE_URL}${BOOK_API}/${id}`, {
                method:'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({views: book.views + 1})
            });
            const update = await res.json();
            setPosts(posts.map(p => p.id === id ? update : p));
        } catch(err) {
            console.error(err);
        }
    };

const handleLikesToggle = async (id, isLiked) => {
        try {
            const book = posts.find(p => p.id === id);
            const res = await fetch(`${BASE_URL}${BOOK_API}/${id}`, {
                method:'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({likes: isLiked ? book.likes + 1 : book.likes - 1})
            });
            const update = await res.json();
            setPosts(posts.map(p => p.id === id ? update : p));
        } catch(err) {
            console.error(err);
        }
    };
    
    const handleSelectToggle = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
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
                                {/* 장르 셀렉터 */}
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

                                {/* 정렬 셀렉터 */}
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
                            // 🎯 [핵심] 검색어 필터 ➡️ 장르 필터 ➡️ 정렬 순으로 원본 데이터를 실시간 가공해서 자식에게 던집니다.
                            posts={posts
                                .filter(post => 
                                    post.title && post.title.includes(searchKeyword)
                                )
                                .filter(post => 
                                    selectedGenre === '' || post.genre === selectedGenre
                                )
                                .sort((a, b) => {
                                    if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
                                    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
                                    // 최신순(latest)은 고유 ID 역순 또는 생성일 기준 (여기서는 ID 문자열 매칭이 아닐 경우 단순 역순 정렬 예시)
                                    return String(b.id).localeCompare(String(a.id)); 
                                })
                            } 
                            selectedIds={selectedIds}          
                            onSelectToggle={handleSelectToggle} 
                        />
                    </>
                } />
                <Route path="/books/:id" element={
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
                    path='/books/:id/edit'
                    element={<BookEditPage 
                    onEdit={handleEdit} 
                    posts={posts}/>} 
                />
                <Route 
                    path='/books/:id/ai-gen'
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
