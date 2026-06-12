import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import './style.css';

export default function AiGenForm({ posts, onEdit }) {
    const navigate = useNavigate();
    const { bookId } = useParams();
    const location = useLocation();

    const [isGenerating, setIsGenerating] = useState(false);
    const [generateFail, setGenerateFail] = useState(false);
    const [coverImgUrl, setCoverImgUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-image-1');
    const [selectedSize, setSelectedSize] = useState('1024x1536');
    const [selectedQuality, setSelectedQuality] = useState('medium');
    const [userPrompt, setUserPrompt] = useState('');

    const isFromForm = location.state?.fromForm;
    const tempFormData = location.state?.formData;

    const isEditingExistingBook = bookId && bookId !== 'new';

    const post = isFromForm
        ? tempFormData
        : (posts ? posts.find(p => p.bookId == bookId) : null);

    const getReturnPath = () => {
        if (isEditingExistingBook) {
            return `/books/${bookId}/edit`;
        }

        return '/create';
    };

    const handleCoverUpdate = async () => {
        try {
            const updatedData = {
                ...post,
                coverImgUrl: coverImgUrl
            };

            alert('생성된 이미지가 적용되었습니다. 작성 중이던 폼으로 복귀합니다.');

            navigate(getReturnPath(), {
                state: {
                    returnedFormData: updatedData
                }
            });

        } catch (err) {
            console.error(err);
            alert('표지 적용에 실패했습니다.');
        }
    };

    if (!post && bookId !== 'new') {
        return (
            <div className="ai-gen-wrapper">
                <div className="ai-form-title-area">
                    <p className="ai-form-eyebrow">AI 표지 생성</p>
                    <h2>도서 정보를 불러올 수 없습니다</h2>
                    <p>목록으로 돌아가 다시 시도해 주세요.</p>
                </div>

                <button
                    type="button"
                    className="ai-cancel-btn"
                    onClick={() => navigate('/books')}
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    const compressDataUrl = (dataUrl, maxWidth = 500, quality = 0.6) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, 1);
                const canvas = document.createElement('canvas');

                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };

            img.onerror = () => {
                reject(new Error('이미지 압축에 실패했습니다.'));
            };

            img.src = dataUrl;
        });
    };

    const handleGeneratePrompt = async () => {
        setIsGenerating(true);
        setGenerateFail(false);
        setCoverImgUrl('');

        try {
            if (!apiKey) {
                alert("OpenAI API Key를 정확히 입력해 주세요.");
                return;
            }

            if (!post) {
                alert("도서 정보를 먼저 입력해 주세요.");
                return;
            }

            const prompt = `
                You are a professional concept artist and cinematic book cover designer.

                Your task is to analyze the book information deeply and create a visually narrative-driven illustration that represents the story itself, not just generic fantasy artwork.

                [BOOK INFORMATION]

                Title:
                ${post.title}

                Author:
                ${post.author || 'Unknown'}

                Genre:
                ${post.genre || 'Unknown'}

                Story Summary:
                ${post.summary || post.content}

                [USER ADDITIONAL REQUEST]
                ${userPrompt || 'No additional request'}

                [INSTRUCTIONS]

                1. Carefully analyze the story summary and identify:
                - main character
                - important objects
                - emotional tone
                - world setting
                - symbolic visual elements
                - key atmosphere

                2. The generated image MUST visually reflect:
                - the actual story content
                - genre identity
                - emotional mood
                - important narrative elements

                3. If characters are mentioned in the summary:
                - depict them clearly
                - emphasize their appearance, emotion, clothing, and actions

                4. Avoid generic random fantasy artwork.
                The image should feel specifically made for THIS book.

                5. Composition Requirements:
                - vertical book-cover composition
                - cinematic lighting
                - highly detailed
                - immersive atmosphere
                - professional digital painting
                - visually striking focal point

                6. The artwork should feel like:
                - an official premium novel cover illustration
                - emotionally immersive
                - story-driven
                - visually unique

                Generate only the final image prompt.
            `;

            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: selectedModel,
                    prompt: prompt,
                    n: 1,
                    size: selectedSize,
                    quality: selectedQuality
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("DALL-E API Error 상세:", errorData);
                throw new Error("DALL-E 이미지 생성 호출 실패");
            }

            const resData = await response.json();
            const base64RawData = resData.data[0].b64_json;
            const dataUrl = `data:image/png;base64,${base64RawData}`;

            const compressedDataUrl = await compressDataUrl(dataUrl, 500, 0.6);

            setCoverImgUrl(compressedDataUrl);

        } catch (err) {
            console.error("이미지 생성 중 최종 에러 발생:", err);
            setGenerateFail(true);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ai-gen-wrapper">
            <div className="ai-form-title-area">
                <p className="ai-form-eyebrow">AI 표지 생성</p>
                <h2>도서 표지 이미지 생성</h2>
                <p>
                    도서 정보와 추가 요구사항을 바탕으로 책의 분위기에 어울리는 표지 이미지를 생성합니다.
                </p>
            </div>

            <div className="ai-notice-box">
                <strong>안내</strong>
                <span>이미지 생성 시 OpenAI API 사용 비용이 발생할 수 있습니다.</span>
            </div>

            <div className="ai-section">
                <label className="ai-label">API Key</label>
                <input
                    className="ai-input"
                    type="password"
                    placeholder="OpenAI API Key를 입력해 주세요."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </div>

            <div className="ai-options-row">
                <div className="ai-option-group">
                    <label className="ai-label">생성 모델</label>
                    <select
                        className="ai-select"
                        value={selectedModel}
                        onChange={(e) => {
                            const model = e.target.value;
                            setSelectedModel(model);

                            if (model === "gpt-image-1") {
                                setSelectedSize("1024x1536");
                                setSelectedQuality("medium");
                            }

                            if (model === "gpt-image-2") {
                                setSelectedSize("1024x1536");
                                setSelectedQuality("medium");
                            }
                        }}
                    >
                        <option value="gpt-image-1">GPT Image 1 - 빠르고 가벼움</option>
                        <option value="gpt-image-2">GPT Image 2 - 고성능이지만 느림</option>
                    </select>
                </div>

                <div className="ai-option-group">
                    <label className="ai-label">이미지 크기</label>
                    <select
                        className="ai-select"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                    >
                        {selectedModel === "gpt-image-1" && (
                            <>
                                <option value="1024x1024">1024x1024</option>
                                <option value="1536x1024">1536x1024</option>
                                <option value="1024x1536">1024x1536</option>
                            </>
                        )}

                        {selectedModel === "gpt-image-2" && (
                            <>
                                <option value="1024x1024">1024x1024</option>
                                <option value="1536x1024">1536x1024</option>
                                <option value="1024x1536">1024x1536</option>
                            </>
                        )}
                    </select>
                </div>

                <div className="ai-option-group">
                    <label className="ai-label">품질</label>
                    <select
                        className="ai-select"
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                    >
                        {selectedModel === "gpt-image-1" && (
                            <>
                                <option value="low">low</option>
                                <option value="medium">medium</option>
                                <option value="high">high</option>
                                <option value="auto">auto</option>
                            </>
                        )}

                        {selectedModel === "gpt-image-2" && (
                            <>
                                <option value="low">low</option>
                                <option value="medium">medium</option>
                                <option value="high">high</option>
                                <option value="auto">auto</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            <div className="ai-section">
                <label className="ai-label">추가 요구사항</label>
                <textarea
                    className="ai-textarea"
                    placeholder="예: 어두운 사이버펑크 분위기, 따뜻한 수채화 느낌, 인물 중심의 표지"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                />
            </div>

            <button
                className={`ai-generate-btn ${isGenerating ? 'loading' : ''}`}
                onClick={handleGeneratePrompt}
                disabled={isGenerating}
            >
                {isGenerating ? "이미지 생성 중" : "이미지 생성"}
            </button>

            <button
                type="button"
                className="ai-cancel-btn"
                onClick={() => {
                    const returnData = isFromForm ? tempFormData : post;

                    navigate(getReturnPath(), {
                        state: {
                            returnedFormData: returnData
                        }
                    });
                }}
                disabled={isGenerating}
            >
                생성 취소
            </button>

            <hr className="ai-divider" />

            {isGenerating && (
                <div className="ai-status-msg">
                    <h3>이미지를 생성하고 있습니다.</h3>
                    <p>도서 정보와 요청사항을 분석해 표지 이미지를 생성하는 중입니다.</p>
                </div>
            )}

            {!isGenerating && generateFail && (
                <div className="ai-status-error">
                    <h3>이미지 생성에 실패했습니다.</h3>
                    <p>API Key, 모델, 이미지 크기 설정을 확인한 뒤 다시 시도해 주세요.</p>
                </div>
            )}

            {coverImgUrl && (
                <div className="ai-result-container">
                    <div className="ai-result-title">
                        <p>생성 결과</p>
                        <h3>생성된 표지 이미지</h3>
                    </div>

                    <img
                        className="ai-result-image"
                        src={coverImgUrl}
                        alt="AI Generated Cover"
                    />

                    <button
                        type="button"
                        className="ai-save-btn"
                        onClick={handleCoverUpdate}
                    >
                        이미지 저장
                    </button>
                </div>
            )}
        </div>
    );
}