import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './style.css';
import BookForm from '../../components/Books/BookForm';
export default function BookEditPage({ posts, onEdit }) {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const defaultbook = posts.find(p => p.id === id);

    return (
        <div className="book-create-page">
            <h2>✍️ 도서 수정하기</h2>
            <BookForm onEdit={onEdit} defaultBook={defaultbook}/>
        </div>
    );
}