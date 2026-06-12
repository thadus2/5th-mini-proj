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
    onImageView,
    enableTilt = false,
}) {
    const imageSrc = coverImgUrl ? coverImgUrl : defaultImg;

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

    const handleMouseMove = (e) => {
        if (!enableTilt) return;

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.setProperty('--card-rotate-x', `${rotateX}deg`);
        card.style.setProperty('--card-rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = (e) => {
        if (!enableTilt) return;

        const card = e.currentTarget;

        card.style.setProperty('--card-rotate-x', '0deg');
        card.style.setProperty('--card-rotate-y', '0deg');
    };

    const handleImageClick = (e) => {
        e.stopPropagation();

        if (onImageView) {
            onImageView(imageSrc, title || '도서 표지');
        }
    };

    return (
        <article
            data-book-id={bookId}
            className={`book-card ${enableTilt ? 'tilt-enabled' : ''}`}
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
        >
            <div
                className="image-wrapper"
                role="button"
                tabIndex={0}
                onClick={handleImageClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleImageClick(e);
                    }
                }}
            >
                <span className="genre-badge">{genre || '장르 없음'}</span>

                <img
                    src={imageSrc}
                    alt={title || '도서 표지'}
                />

                <div className="book-image-view-overlay">
                    <span className="book-image-view-btn">보기</span>
                </div>
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