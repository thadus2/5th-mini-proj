import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css';
import AiGenForm from '../../components/AI/AiGenForm';
export default function AICoverGenPage({ posts, onEdit }) {
  const navigate = useNavigate();

  return (
    <div className="book-create-page">
      <h2>AI 표지 생성하기</h2>
      <p>⚠️ AI 이미지 생성 시 OpenAI API 사용 비용이 발생할 수 있습니다.</p>
      <AiGenForm onEdit={onEdit} posts={posts} />
    </div>
  );
}