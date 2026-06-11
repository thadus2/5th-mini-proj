import React from 'react';
import './style.css';
import AiGenForm from '../../components/AI/AiGenForm';

export default function AICoverGenPage({ posts, onEdit }) {
  return (
    <div className="book-create-page">
      <AiGenForm onEdit={onEdit} posts={posts} />
    </div>
  );
}