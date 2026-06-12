import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css';
import imageCompression from 'browser-image-compression';
import Toast from '../Toast';

export default function BookForm({ onAdd, defaultBook, onEdit }) {
    const navigator = useNavigate();
    const location = useLocation();
    const savedFormData = location.state?.returnedFormData;

    const [title, setTitle] = useState(savedFormData?.title || defaultBook?.title || '');
    const [author, setAuthor] = useState(savedFormData?.author || defaultBook?.author || '');
    const [genre, setGenre] = useState(savedFormData?.genre || defaultBook?.genre || '');
    const [content, setContent] = useState(savedFormData?.content || defaultBook?.content || '');
    const [summary, setSummary] = useState(savedFormData?.summary || defaultBook?.summary || '');
    const [publisher, setPublisher] = useState(savedFormData?.publisher || defaultBook?.publisher || '');
    const [coverImgUrl, setCoverImgUrl] = useState(savedFormData?.coverImgUrl || defaultBook?.coverImgUrl || '');
    const [likeCount, setLikes] = useState(savedFormData?.likeCount || defaultBook?.likeCount || 0);
    const [viewCount, setViews] = useState(savedFormData?.viewCount || defaultBook?.viewCount || 0);

    const [toast, setToast] = useState({
        message: '',
        type: 'success'
    });

    const [errors, setErrors] = useState({
        title: false,
        author: false,
        content: false
    });

    const [isGenreOpen, setIsGenreOpen] = useState(false);

    const genreOptions = [
        '소설/문학',
        '에세이/시',
        '미스터리/SF',
        '미스터리/드라마',
        'IT/과학',
        '인문/사회',
        '판타지',
        '기타'
    ];

    const showToast = (message, type = 'success') => {
        setToast({ message, type });

        setTimeout(() => {
            setToast({ message: '', type: 'success' });
        }, 2200);
    };

    const getSubmitErrorMessage = (result) => {
        if (!result) {
            return '도서 등록에 실패했습니다.';
        }

        const fieldNameMap = {
            title: '도서 제목',
            author: '작성자',
            genre: '장르',
            content: '본문 내용',
            summary: '한 줄 요약',
            publisher: '출판사',
            coverImgUrl: '표지 이미지',
            likeCount: '좋아요 수',
            viewCount: '조회수'
        };

        const baseMessage =
            result.message ||
            result.error ||
            result.errorName ||
            result.title ||
            result.exception ||
            '도서 등록에 실패했습니다.';

        if (result.errors && typeof result.errors === 'object') {
            const detailMessage = Object.entries(result.errors)
                .map(([field, message]) => {
                    const fieldLabel = fieldNameMap[field] || field;
                    return `${fieldLabel}: ${message}`;
                })
                .join('\n- ');

            return `${baseMessage} \n- ${detailMessage}`;
        }

        return baseMessage;
    };

    const handleAiGenClick = () => {
        const currentFormData = {
            title,
            author,
            genre,
            content,
            summary,
            publisher,
            coverImgUrl,
            likeCount,
            viewCount
        };

        const idParam = defaultBook?.bookId || 'new';

        navigator(`/books/${idParam}/ai-gen`, {
            state: {
                fromForm: true,
                formData: currentFormData,
                isEditMode: !!defaultBook
            }
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const options = {
            maxSizeMB: 0.05,
            maxWidthOrHeight: 500,
            useWebWorker: true
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();

            reader.onloadend = () => {
                setCoverImgUrl(reader.result);
                showToast('표지 이미지가 적용되었습니다.', 'success');
            };

            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error('이미지 압축 실패:', error);
            showToast('이미지 업로드 중 문제가 발생했습니다.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            title: !title.trim(),
            author: !author.trim(),
            content: !content.trim() || content.trim().length < 5
        };

        setErrors(newErrors);

        if (newErrors.title || newErrors.author || newErrors.content) {

            showToast('필수 입력 항목을 확인해 주세요.', 'warning');
            return;
        }

        const newBook = {
            title,
            author,
            genre,
            content,
            summary,
            publisher,
            coverImgUrl,
            likeCount,
            viewCount
        };

        if (!defaultBook) {
            const result = await onAdd(newBook);

            console.log('등록 결과:', result);

            if (!result?.success) {
                showToast(getSubmitErrorMessage(result), 'error');
                return;
            }

            setTitle('');
            setAuthor('');
            setGenre('');
            setContent('');
            setSummary('');
            setPublisher('');
            setCoverImgUrl('');

            showToast('도서가 등록되었습니다.', 'success');

            setTimeout(() => {
                navigator('/books');
            }, 700);
        } else {
            const result = await onEdit(defaultBook.bookId, newBook);

            console.log('수정 결과:', result);

            if (!result?.success) {
                showToast(result?.message || '서버 저장에 실패하였습니다.', 'error');
                return;
            }

            showToast('내용이 수정되었습니다.', 'success');

            setTimeout(() => {
                navigator(`/books/${defaultBook.bookId}`);
            }, 700);
        }
    };

    return (
        <>
            <Toast message={toast.message} type={toast.type} />

            <div className="form-container">
                <form onSubmit={handleSubmit} className="book-form">

                    <div className="form-title-area">
                        <p className="form-eyebrow">
                            {defaultBook ? 'Book Edit' : 'Book Registration'}
                        </p>
                        <h2>
                            {defaultBook ? '도서 정보 수정' : '도서 정보 등록'}
                        </h2>
                        <p>
                            도서의 기본 정보와 표지 이미지를 입력해 목록에 반영합니다.
                        </p>
                    </div>

                    <div className="image-upload-section">
                        <div className="image-preview-box">
                            {coverImgUrl ? (
                                <img src={coverImgUrl} alt="커버 미리보기" className="preview-img" />
                            ) : (
                                <div className="no-image">표지 이미지가 없습니다</div>
                            )}
                        </div>

                        <label htmlFor="file-upload" className="custom-file-upload">
                            표지 이미지 선택
                        </label>

                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <button
                            type="button"
                            className="custom-file-upload ai-gen-btn-style"
                            onClick={handleAiGenClick}
                        >
                            AI 표지 생성
                        </button>
                    </div>

                    <div className="form-inputs-container">
                        <div className="input-group">
                            <label>도서 제목 *</label>
                            <input
                                className={errors.title ? 'input-error' : ''}
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors({ ...errors, title: false });
                                }}
                                placeholder={errors.title ? '도서 제목은 필수 입력 항목입니다.' : '제목을 입력하세요'}
                            />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>작성자 *</label>
                                <input
                                    className={errors.author ? 'input-error' : ''}
                                    value={author}
                                    onChange={(e) => {
                                        setAuthor(e.target.value);
                                        if (errors.author) setErrors({ ...errors, author: false });
                                    }}
                                    placeholder={errors.author ? '작성자는 필수 입력 항목입니다.' : '저자 이름'}
                                />
                            </div>

                            <div className="input-group">
                                <label>장르</label>

                                <div className={`custom-genre-select ${isGenreOpen ? 'open' : ''}`}>
                                    <button
                                        type="button"
                                        className="custom-genre-trigger"
                                        onClick={() => setIsGenreOpen(prev => !prev)}
                                    >
                                        <span className={genre ? 'selected-value' : 'placeholder-value'}>
                                            {genre || '장르 선택'}
                                        </span>
                                        <span className="custom-genre-arrow" />
                                    </button>

                                    {isGenreOpen && (
                                        <div className="custom-genre-menu">
                                            <button
                                                type="button"
                                                className={`custom-genre-option ${genre === '' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setGenre('');
                                                    setIsGenreOpen(false);
                                                }}
                                            >
                                                장르 선택
                                            </button>

                                            {genreOptions.map((item) => (
                                                <button
                                                    type="button"
                                                    key={item}
                                                    className={`custom-genre-option ${genre === item ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setGenre(item);
                                                        setIsGenreOpen(false);
                                                    }}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>출판사</label>
                            <input
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                                placeholder="출판사 명"
                            />
                        </div>

                        <div className="input-group">
                            <label>본문 내용 * (5글자 이상)</label>
                            <textarea
                                className={errors.content ? 'input-error' : ''}
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    if (errors.content) setErrors({ ...errors, content: false });
                                }}
                                placeholder={errors.content ? '본문 내용은 필수 입력 항목입니다. (5글자 이상)' : '도서의 상세 내용을 적어주세요'}
                                rows="6"
                            />
                        </div>

                        <div className="input-group">
                            <label>한 줄 요약</label>
                            <input
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="핵심 내용을 한 줄로 요약해 주세요"
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            {defaultBook ? '도서 수정' : '도서 등록'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}