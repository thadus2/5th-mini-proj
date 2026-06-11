import React from 'react';
import './style.css';

export default function Toast({ message, type = 'success' }) {
    if (!message) return null;

    const messageLines = String(message).split('\n');

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <strong>
                    {type === 'success' && '완료'}
                    {type === 'error' && '오류'}
                    {type === 'warning' && '안내'}
                </strong>

                <div className="toast-message">
                    {messageLines.map((line, index) => (
                        <span key={index}>{line}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}