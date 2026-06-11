import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function MainPage() {
    return (
        <div className="main-page">
            <section className="main-hero">
                <p className="main-eyebrow">Professional AI Book Library</p>

                <h2>
                    AI Books에 오신 것을 환영합니다
                </h2>

                <p className="main-description">
                    AI 기반 도서 등록, 표지 생성, 목록 관리까지 하나의 공간에서 관리할 수 있습니다.
                </p>

                <div className="main-actions">
                    <Link to="/books" className="main-primary-btn">
                        도서 목록 보기
                    </Link>

                    <Link to="/create" className="main-secondary-btn">
                        도서 등록하기
                    </Link>
                </div>
            </section>
        </div>
    );
}