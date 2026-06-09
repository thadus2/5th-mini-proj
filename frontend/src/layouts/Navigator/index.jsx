//Navigator.jsx
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

export default function Navigator() {
  const location = useLocation();

  const navigator = useNavigate();

  return (
    <nav className="navigator">

      <ul className="nav-menu">

        <li 
            className={`nav-item ${location.pathname === '/books' ? 'active' : ''}`}
            onClick={() => navigator('/books')}
        >
          📚 도서 목록
        </li>
        <li 
            className={`nav-item ${location.pathname === '/create' ? 'active' : ''}`}
            onClick={() => navigator('/create')}
        >
          ➕ 도서 등록
        </li>
      </ul>
    </nav>
  );
}