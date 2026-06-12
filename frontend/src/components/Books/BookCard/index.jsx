import React from 'react';
import defaultImg from '../../../assets/images/default-background.png';
import './style.css';

export default function BookCard({
    bookId,
    title,
    author,
    publisher,
    genre,
    summary,
    likeCount,
    viewCount,
    coverImgUrl,
    onCardClick,
    isChecked,
    onSelectToggle,
}) {
    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(bookId);
        }
    };

    const handleCardKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <article
            className={`book-card ${isChecked ? 'selected' : ''}`}
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
            role="button"
            tabIndex={0}
        >
            <input
                type="checkbox"
                className="book-select-checkbox"
                checked={isChecked}
                aria-label="도서 선택"
                onChange={(e) => {
                    e.stopPropagation();
                    onSelectToggle(bookId);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            />

            <div className="image-wrapper">
                <span className="genre-badge">{genre || '장르 없음'}</span>

                <img
                    src={coverImgUrl ? coverImgUrl : defaultImg}
                    alt={title || '도서 표지'}
                />
            </div>

            <div className="content-box">
                <h3 className="title">{title || '제목 없음'}</h3>

                <div className="book-submeta">
                    <span className="author">{author || '작가 없음'}</span>
                    <span className="submeta-dot" />
                    <span className="publisher">{publisher || '출판사 정보 없음'}</span>
                </div>

                <p className="summary">{summary || '요약 정보가 없습니다.'}</p>

                <div className="card-footer">
                    <span className="stat like-stat">좋아요 {likeCount ?? 0}</span>
                    <span className="stat view-stat">조회 {viewCount ?? 0}</span>
                </div>
            </div>
        </article>
    );
}