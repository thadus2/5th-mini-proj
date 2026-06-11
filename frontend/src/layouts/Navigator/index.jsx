// Navigator.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import './style.css';

export default function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="navigator">
      <ul className="nav-menu">
        <li
          className={`nav-item ${location.pathname === '/books' ? 'active' : ''}`}
          onClick={() => navigate('/books')}
        >
          <BookOpen size={15} strokeWidth={2.2} />
          <span>도서 목록</span>
        </li>

        <li
          className={`nav-item ${location.pathname === '/create' ? 'active' : ''}`}
          onClick={() => navigate('/create')}
        >
          <Plus size={16} strokeWidth={2.4} />
          <span>도서 등록</span>
        </li>
      </ul>
    </nav>
  );
}