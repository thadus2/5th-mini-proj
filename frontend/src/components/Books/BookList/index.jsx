import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../BookCard';
import defaultImg from '../../../assets/images/default-background.png';
import './style.css';

export default function BookList({ posts, selectedIds, onSelectToggle, viewMode = 'card' }) {
    const navigate = useNavigate();

    const [rotation, setRotation] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);

    const startXRef = useRef(null);
    const startRotationRef = useRef(0);
    const dragDistanceRef = useRef(0);
    const activeBookIdRef = useRef(null);

    const cardCount = posts.length;
    const angleStep = cardCount > 0 ? 360 / cardCount : 0;
    const radius = cardCount <= 4 ? 360 : cardCount <= 8 ? 480 : 620;

    const handleCardClick = (bookId) => {
        if (viewMode === 'circle') {
            return;
        }

        navigate(`/books/${bookId}`);
    };

    const handlePointerDown = (e) => {
        if (viewMode !== 'circle') return;

        const isNoDragArea = e.target.closest('.image-wrapper, .book-select-checkbox, .book-image-view-btn');

        if (isNoDragArea) {
            return;
        }

        const isDragArea = e.target.closest('.content-box');

        if (!isDragArea) {
            return;
        }

        const cardElement = e.target.closest('.book-card');

        activeBookIdRef.current = cardElement?.dataset.bookId || null;
        startXRef.current = e.clientX;
        startRotationRef.current = rotation;
        dragDistanceRef.current = 0;

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (viewMode !== 'circle') return;
        if (startXRef.current === null) return;

        const diffX = e.clientX - startXRef.current;

        dragDistanceRef.current = diffX;
        setRotation(startRotationRef.current + diffX * 0.28);
    };

    const handlePointerUp = (e) => {
        if (viewMode !== 'circle') return;

        const activeBookId = activeBookIdRef.current;
        const isClick = Math.abs(dragDistanceRef.current) <= 6;

        startXRef.current = null;
        activeBookIdRef.current = null;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        if (isClick && activeBookId) {
            navigate(`/books/${activeBookId}`);
        }

        setTimeout(() => {
            dragDistanceRef.current = 0;
        }, 0);
    };

    const handleImageView = (imageUrl, imageAlt) => {
        setPreviewImage({
            src: imageUrl || defaultImg,
            alt: imageAlt || '도서 표지'
        });
    };

    const handleClosePreview = () => {
        setPreviewImage(null);
    };

    if (!posts || posts.length === 0) {
        return (
            <div className="book-list-empty">
                등록된 도서가 없습니다.
            </div>
        );
    }

    return (
        <>
            {viewMode === 'circle' ? (
                <div
                    className="book-circle-scene"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div
                        className="book-circle-ring"
                        style={{
                            transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`
                        }}
                    >
                        {posts.map((post, index) => (
                            <div
                                key={post.bookId}
                                className="book-circle-item"
                                style={{
                                    transform: `rotateY(${index * angleStep}deg) translateZ(${radius}px)`
                                }}
                            >
                                <BookCard
                                    bookId={post.bookId}
                                    title={post.title}
                                    author={post.author}
                                    publisher={post.publisher}
                                    genre={post.genre}
                                    summary={post.summary}
                                    likeCount={post.likeCount}
                                    viewCount={post.viewCount}
                                    coverImgUrl={post.coverImgUrl}
                                    isChecked={selectedIds.includes(post.bookId)}
                                    onSelectToggle={onSelectToggle}
                                    onCardClick={handleCardClick}
                                    onImageView={handleImageView}
                                    enableTilt={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="book-list-container">
                    {posts.map((post) => (
                        <BookCard
                            key={post.bookId}
                            bookId={post.bookId}
                            title={post.title}
                            author={post.author}
                            publisher={post.publisher}
                            genre={post.genre}
                            summary={post.summary}
                            likeCount={post.likeCount}
                            viewCount={post.viewCount}
                            coverImgUrl={post.coverImgUrl}
                            isChecked={selectedIds.includes(post.bookId)}
                            onSelectToggle={onSelectToggle}
                            onCardClick={handleCardClick}
                            onImageView={handleImageView}
                            enableTilt={true}
                        />
                    ))}
                </div>
            )}

            {previewImage && (
                <div
                    className="book-image-modal"
                    role="button"
                    tabIndex={0}
                    onClick={handleClosePreview}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                            handleClosePreview();
                        }
                    }}
                >
                    <div
                        className="book-image-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="book-image-modal-close"
                            onClick={handleClosePreview}
                        >
                            닫기
                        </button>

                        <img src={previewImage.src} alt={previewImage.alt} />
                    </div>
                </div>
            )}
        </>
    );
}