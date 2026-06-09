import { useNavigate } from "react-router-dom";
import BookCard from "../BookCard/index.jsx";
import './style.css';

export default function BookList({ posts = [], onCardClick, selectedIds = [], onSelectToggle }) {
    const navigate = useNavigate();

    if (!posts || posts.length === 0) {
        return (
            <div className="book-list-container">
                <p>등록된 도서가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="book-list-container">
            {posts.map((book) => (
                <BookCard
                    key={book.id}
                    {...book}
                    onCardClick={() => navigate(`/books/${book.id}`)}
                    isChecked={selectedIds.includes(book.id)}
                    onSelectToggle={onSelectToggle}
                />
            ))}
        </div>
    );
}