import React, { useState, useEffect } from 'react';
import { getCookie } from '../../utils/cookie';
import './style.css';
import { useParams } from 'react-router-dom';

export default function Comment() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    
    const { bookId } = useParams();

    const [toast, setToast] = useState({ message: '', type: 'success' });

    useEffect(() => {
        fetchComments();
        
        const token = getCookie('accessToken');
        if (token) {
            try {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));

                setCurrentUserId(Number(decoded.sub)); 
            } catch (error) {
                console.error("토큰 파싱 에러:", error);
            }
        }
    }, [bookId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/books/${bookId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("댓글 로딩 실패:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const token = getCookie('accessToken');

        if (!token) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/books/${bookId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (response.ok) {
                setNewComment(''); 
                fetchComments(); 
                
                setToast({
                    message: '댓글이 성공적으로 등록되었습니다. 💬',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error("댓글 등록 에러:", error);
        }
    };

    const handleCommentDelete = async (commentId) => {
        const token = getCookie('accessToken');
        if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchComments();
                alert('댓글이 삭제되었습니다.');
            }
        } catch (error) {
            console.error("댓글 삭제 에러:", error);
        }
    };

    return (
        <div className="comment-section">
            <div className="section-title-row">
                <h4>댓글</h4>
                <span className="comment-count">{comments.length}</span>
            </div>
            
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    placeholder={currentUserId ? "따뜻한 댓글을 남겨주세요." : "로그인 후 댓글 작성이 가능합니다."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!currentUserId}
                />
                <button type="submit" disabled={!currentUserId || !newComment.trim()}>등록</button>
            </form>

            <div className="comment-list">
                {comments.length === 0 ? (
                    <p className="no-comment">첫 번째 댓글을 남겨보세요!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.commentId} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">{comment.nickname}</span>
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                            {currentUserId && Number(comment.userId) === Number(currentUserId) && (
                                <button 
                                    onClick={() => handleCommentDelete(comment.commentId)} 
                                    className="comment-delete-btn"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}