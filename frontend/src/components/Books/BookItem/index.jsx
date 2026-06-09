//BookItem.jsx className 적용 ver
import React from 'react';
import './style.css';
import defaultImg from '../../../assets/images/default-background.png'

export default function BookItem({id, title, author, genre, content, likes, views, summary, publish, coverImageUrl, createat, updatedat}) {
    
    return (
        <li className="book-item-card">
            <p className="book-id">ID: #{id}</p>
            <h3 className="book-title">📖 {title}</h3>
            <h4 className="book-author">저자: {author}</h4>
            
            <p className="book-meta"><strong>소개:</strong> {content}</p>
            <p className="book-meta"><strong>요약:</strong> {summary}</p>
            <p className="book-meta"><strong>출판사:</strong> {publish}</p>
            
            <div className="book-cover-area">
                {coverImageUrl === '' ? (
                    <img src={coverImageUrl} alt="도서 표지" style={{ width: '100%', borderRadius: '4px' }} />
                ) : (
                    <img src={defaultImg} />
                )}
            </div>
            
            <p className="book-id">등록일: {createat}</p>
            <p className="book-id">수정일: {updatedat}</p>
            
            <div className="book-actions">
                <button className="action-button">👍 {likes}</button>
                <button className="action-button">👀 {views}</button>
            </div>
        </li>
    );
}