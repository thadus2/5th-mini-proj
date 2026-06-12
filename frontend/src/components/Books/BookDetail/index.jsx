import React, { useEffect, useRef, useState } from 'react';
import defaultImg from '../../../assets/images/default-background.png';
import FavoriteIcon from '../../../assets/images/favorite-icon.png';
import ViewIcon from '../../../assets/images/view-icon.png';
import FavoritedIcon from '../../../assets/images/toggled-favorite-icon.png';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BOOK_API } from '../../../apis/api';
import Comment from '../../Comment';

export default function BookDetail({ onLikesToggle }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [post, setPost] = useState();

    //0612추가
    const getAccessTokenFromCookie = () => {
        const cookies = document.cookie.split("; ");

        const accessTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("accessToken=")
        );

        return accessTokenCookie ? accessTokenCookie.split("=")[1] : null;
    };

    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        const token = getAccessTokenFromCookie();
        setIsLogin(!!token);
    }, []);
    //0612추가여기까지

    const { bookId } = useParams();

    // const post = posts.find(p => p.bookId == bookId)

    const [isLiked, setIsLiked] = useState(false);

    const handleDelete = async (id) => {

        const token = getAccessTokenFromCookie();

        try {
            const res = await fetch(`${BOOK_API}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                alert('도서 삭제에 실패했습니다.');
                return false;
            }

            alert('도서 삭제가 완료되었습니다.');
            return true;
        } catch (err) {
            console.error(err);

            alert('도서 삭제에 실패했습니다.');
            return false;
        }
    };

    const isViewIncremented = useRef(false);

    useEffect(() => {

        let isMounted = true;

        const loadBookAndIncrementViews = async () => {
            try {
                const token = getAccessTokenFromCookie();
                const headers = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
                const response = await fetch(`${BOOK_API}/${bookId}`, { headers });
                const data = await response.json();

                if (!isMounted) return;
                setPost(data);

                if (!isViewIncremented.current) {
                    isViewIncremented.current = true;

                    const res = await fetch(`${BOOK_API}/${bookId}/views`, {
                        method: 'PATCH',
                    });

                    if (res.ok && isMounted) {
                        setPost(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                viewCount: (prev.viewCount || 0) + 1
                            };
                        });
                    }
                }
            } catch (error) {
                console.error("데이터 로딩 또는 조회수 증가 실패:", error);
            }
        };

        loadBookAndIncrementViews();

        return () => {
            isMounted = false;
        };
    }, [bookId]);

    const loadBook = async () => {
        try {
            const response = await fetch(`${BOOK_API}/${bookId}`);
            const data = await response.json();
            setPost(data);

            if (!isViewIncremented.current) {
                isViewIncremented.current = true;
                await handleViewsPlus(bookId);
            }
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    const handleLikeClick = async () => {
        if (!post) return;

        const token = getAccessTokenFromCookie();

        if (!token) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            setIsLogin(false);
            return;
        }

        try {
            const response = await fetch(`${BOOK_API}/${post.bookId}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                alert("좋아요 처리에 실패했습니다.");
                return;
            }

            const data = await response.json();

            setPost((prev) => ({
                ...prev,
                likeCount: data.likeCount,
                isLiked: data.isLiked,
            }));
        } catch (error) {
            console.error("좋아요 처리 실패:", error);
            alert("좋아요 처리 중 오류가 발생했습니다.");
        }
    };

  const handleClickDelete = async(bookId) => {
    if (window.confirm("정말 이 도서를 삭제하시겠습니까?")) {
          await handleDelete(bookId);
          navigate('/books');
        }
  }
  const handleAiGen = () => {
        navigate(`/books/${bookId}/ai-gen`);
  }

    if (!post) {
        return (
            <div className="book-detail-wrapper">
                <button className="book-detail-button" onClick={() => navigate('/books')}>
                    목록으로 돌아가기
                </button>
                <p>도서 정보를 불러올 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="book-detail-wrapper">
            <div className="book-main-card">
                <div className="book-actions-button">
                    <button className="book-list-button" onClick={() => navigate('/books')}>
                        목록으로 돌아가기
                    </button>

                    <div className="book-actions-right">
                        <button
                            className="book-edit-button"
                            onClick={() => navigate(`/books/${bookId}/edit`)}
                        >
                            수정
                        </button>

                        <button
                            className="book-delete-button"
                            onClick={() => handleClickDelete(bookId)}
                        >
                            삭제
                        </button>
                    </div>
                </div>

                <div className="book-detail-layout">
                    <div className="book-left-col">
                        <img
                            className="cover-image"
                            src={post.coverImgUrl ? post.coverImgUrl : defaultImg}
                            alt={post.title || '커버'}
                        />

                        <button className="book-detail-aigen-btn" onClick={handleAiGen}>
                            AI 표지 만들기
                        </button>
                    </div>

                    <div className="book-right-col">
                        <div className="book-header">
                            <h2 className="book-title">{post.title || '제목 없음'}</h2>

                            <div className="book-meta-row">
                                <span><strong>작가</strong>{post.author || '작가 없음'}</span>
                                <span><strong>출판사</strong>{post.publisher || '정보 없음'}</span>
                                <span><strong>장르</strong>{post.genre || '장르 없음'}</span>
                            </div>

                            <div className="book-stat-row">
                                {isLogin ? (                                    
                                    <button
                                        className={`book-stat-button like-button`}
                                        onClick={handleLikeClick}
                                    >
                                        <img
                                            className="book-stat-icon"
                                            src={post.isLiked ? FavoritedIcon : FavoriteIcon}
                                            alt="좋아요"
                                        />
                                        {post.likeCount ?? 0}
                                    </button>
                                ) : (
                                    <div className="book-stat-chip">
                                        <img
                                            className="book-stat-icon"
                                            src={FavoriteIcon}
                                            alt="좋아요 개수"
                                        />
                                        {post.likeCount ?? 0}
                                    </div>
                                )}

                                <span className="book-stat-chip">
                                    <img
                                        className="book-stat-icon"
                                        src={ViewIcon}
                                        alt="조회수"
                                    />
                                    {post.viewCount ?? 0}
                                </span>
                            </div>
                        </div>

                        <div className="book-summary-card">
                            <div className="section-title-row">
                                <h4>요약</h4>
                            </div>

                            <p className="book-summary">
                                {post.summary || '요약 정보가 없습니다.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="book-content-card">
                <div className="section-title-row">
                    <h4>본문 내용</h4>
                </div>

                <p className="book-content">
                    {post.content || '본문 내용이 없습니다.'}
                </p>
            </div>

            <Comment />
        </div>
    );
}