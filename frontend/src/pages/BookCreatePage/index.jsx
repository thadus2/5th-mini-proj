import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css';
import BookForm from '../../components/Books/BookForm/index.jsx';
function BookCreatePage({ onAdd }) {
  const navigate = useNavigate();

  const handleFormSubmit = async (newBook) => {
    await onAdd(newBook);
  };

  return (
    <div className="book-create-page">
      <h2>✍️ 새 도서 등록하기</h2>
      <BookForm onAdd={handleFormSubmit} />
    </div>
  );
}

export default BookCreatePage;