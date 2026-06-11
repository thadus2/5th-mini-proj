import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './style.css';
import BookForm from '../../components/Books/BookForm';
export default function BookEditPage({ posts, onEdit }) {
    
    const { bookId } = useParams();
    const navigate = useNavigate();
    const defaultBook = posts.find(p => p.bookId == bookId);

    return (
        <div className="book-create-page">
            <BookForm onEdit={onEdit} defaultBook={defaultBook}/>
        </div>
    );
}