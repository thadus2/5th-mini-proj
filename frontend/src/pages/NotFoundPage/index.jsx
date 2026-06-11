import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function NotFoundPage() {
    return (
        <div className="not-found-page">
            <section className="not-found-card">
                <p className="not-found-eyebrow">Page Not Found</p>

                <h2>404</h2>

                <h3>페이지를 찾을 수 없습니다</h3>

                <p className="not-found-description">
                    입력하신 주소가 잘못되었거나, 요청하신 페이지가 이동 또는 삭제되었을 수 있습니다.
                    도서 목록이나 홈 화면으로 이동해 다시 확인해 주세요.
                </p>

                <div className="not-found-actions">
                    <Link to="/" className="not-found-home-btn">
                        홈으로 이동
                    </Link>

                    <Link to="/books" className="not-found-list-btn">
                        도서 목록 보기
                    </Link>
                </div>
            </section>
        </div>
    );
}