import React, { useEffect, useState } from 'react';
import defaultImg from '../../../assets/images/default-background.png';
import FavoriteIcon from '../../../assets/images/favorite-icon.png';
import ViewIcon from '../../../assets/images/view-icon.png';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function BookDetail({ posts, onViewsPlus, onDelete, onLikesToggle }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { id } = useParams();

    const post = posts.find(p => String(p.id) === String(id))
    
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (post) {
        onViewsPlus(post.id);
        }
    }, [id]);

    const handleLikeClick = () => {
        const nextState = !isLiked;
        onLikesToggle(post.id, nextState);
        setIsLiked(nextState);
    };

  const handleClickDelete = async(bookId) => {
    if (window.confirm("정말 이 도서를 삭제하시겠습니까?")) {
          await onDelete(bookId);
          navigate('/books');  
        }
  }
  const handleAiGen = () => {
        navigate(`/books/${id}/ai-gen`);
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
            <div className='book-actions-button'>
                <button className="book-list-button" onClick={() => navigate('/books')}>
                    목록으로 돌아가기
                </button>
                <button className="book-edit-button" onClick={() => navigate(`/books/${id}/edit`)}>
                    <span>수정</span>
                </button>
                <span> | </span>
                <button className="book-delete-button" onClick={() => handleClickDelete(id)}>
                    <span>삭제</span>
                </button>
            </div>
            <div className="book-detail-layout">
                <div className="book-left-col">
                    <img
                        className="cover-image"
                        src={post.coverImageUrl ? post.coverImageUrl : defaultImg}
                        alt={post.title || '커버'}
                    />
                    <button className='book-detail-aigen-btn' onClick={handleAiGen}>AI 표지 만들기</button>
                </div>

                <div className="book-right-col">
                    <div className="book-header">
                        <h2 className="book-title">{post.title || '제목 없음'}</h2>

                        <p className="book-meta">
                            <strong>작가:</strong> {post.author || '작가 없음'}
                            <strong> 장르:</strong> {post.genre || '장르 없음'}

                            <button onClick={handleLikeClick}>
                                <img
                                    className="book-stat-icon"
                                    src={FavoriteIcon}
                                    alt="좋아요"                                    
                                />
                                {post.likes ?? 0}
                            </button>

                            <span>
                                <img
                                    className="book-stat-icon"
                                    src={ViewIcon}
                                    alt="조회수"
                                />
                                {post.views ?? 0}
                            </span>
                        </p>
                    </div>

                    <hr className="divider" />

                    <div className="book-section">
                        <h4>요약</h4>
                        <p className="book-summary">
                            {post.summary || '요약 정보가 없습니다.'}
                        </p>
                    </div>

                    <hr className="divider" />

                    <div className="book-section">
                        <h4>본문 내용</h4>
                        <p className="book-content">
                            {post.content || '본문 내용이 없습니다.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}