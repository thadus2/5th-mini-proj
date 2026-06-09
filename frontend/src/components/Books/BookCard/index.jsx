import React from 'react';
import defaultImg from '../../../assets/images/default-background.png';
import './style.css';

export default function BookCard(
        {
            id,
            title,
            author,
            genre,
            summary,
            likes,
            views,
            coverImageUrl,
            onCardClick,
            isChecked,
            onSelectToggle,
        }
    ) {
    const handleClick = () => {
        if (onCardClick) {
            onCardClick(id);
        }
    };

    return (
        <button className="book-card" onClick={handleClick}>
            <input 
                type="checkbox" 
                className="book-select-checkbox"
                checked={isChecked}
                
                onChange={(e) => {
                    e.stopPropagation();
                    onSelectToggle(id);  
                }}
    
                onClick={(e) => {
                    e.stopPropagation(); 
                }}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: 10,
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                }}
            />

            <div className="image-wrapper">
                <span className="genre-badge">{genre || '장르 없음'}</span>

                <img
                    src={coverImageUrl ? coverImageUrl : defaultImg}
                    alt={title || '도서 표지'}
                />
            </div>

            <div className="content-box">
                <h3 className="title">{title || '제목 없음'}</h3>
                <p className="author">{author || '작가 없음'}</p>
                <p className="summary">{summary || '요약 정보가 없습니다.'}</p>

                <div className="card-footer">
                    <span className="stat">❤️ {likes ?? 0}</span>
                    <span className="stat">👀 {views ?? 0}</span>
                </div>
            </div>
        </button>
    );
}