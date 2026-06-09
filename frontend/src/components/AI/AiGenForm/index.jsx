import React, { useState } from "react"; 
import { useNavigate, useParams } from "react-router-dom";
import './style.css'; // 👈 CSS 파일 임포트 추가!

export default function AiGenForm({ posts, onEdit }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isGenerating, setIsGenerating] = useState(false);
    const [generateFail, setGenerateFail] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-image-1');
    const [selectedSize, setSelectedSize] = useState('1024x1536');   
    const [selectedQuality, setSelectedQuality] = useState('medium');
    const [userPrompt, setUserPrompt] = useState('');

    const post = posts ? posts.find(p => String(p.id) === String(id)) : null;

    const handleCoverUpdate = async () => {
        try {
            const updatedData = {
                ...post,
                coverImageUrl: imageUrl
            };

            await onEdit(post.id, updatedData);
            alert('표지가 업데이트되었습니다.');
            navigate(`/books/${id}`);
        } catch(err) {
            console.error(err);
            alert('표지 업데이트에 실패했습니다.');
        }
    };

    if (!post) {
        return (
            <div className="book-detail-wrapper">
                <button className="book-detail-button" onClick={() => navigate('/books')}>
                    목록으로 돌아가기
                </button>
                <p>도서 정보를 불러올 수 없습니다.</p>
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
        setImageUrl('');

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
        try {
            if (!apiKey) {
                alert("OpenAI API Key를 정확히 입력해 주세요.");
                return;
            }

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

            setImageUrl(compressedDataUrl);

        } catch (err) {
            console.error("이미지 생성 중 최종 에러 발생:", err);
            setGenerateFail(true);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ai-gen-wrapper">
            {/* API 키 입력 */}
            <input 
                className="ai-input"
                type='password'
                placeholder='API Key를 입력해주세요.'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />

            {/* 💡 [수정됨] 3개의 옵션을 가로로 나란히 배치하기 위한 부모 컨테이너 */}
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

            {/* 사용자 프롬프트 입력 */}
            <textarea 
                className="ai-textarea"
                placeholder='사용자 추가 요구사항을 입력해주세요. (예: 어두운 사이버펑크 분위기)'
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
            />

            {/* 생성 버튼 */}
            <button 
                className={`ai-generate-btn ${isGenerating ? 'loading' : ''}`}
                onClick={handleGeneratePrompt} 
                disabled={isGenerating}
            >
                {isGenerating ? "🤖 이미지 생성 중..." : "✨ 이미지 생성하기"}
            </button>

            <hr className="ai-divider" />

            {/* 상태 메시지 */}
            {isGenerating && (
                <div className="ai-status-msg">
                    <h3>이미지를 열심히 생성하고 있습니다.. ⚙️</h3>
                </div>
            )}

            {!isGenerating && generateFail && (
                <div className="ai-status-error">
                    <h3>이미지 생성에 실패하였습니다. 다시 시도해주세요.</h3>
                </div>
            )}

            {/* 결과 이미지 영역 */}
            {imageUrl && (
                <div className="ai-result-container">
                    <h3>🖼️ 생성된 이미지</h3>
                    <img
                        className="ai-result-image"
                        src={imageUrl}
                        alt="AI Generated Cover"
                    />
                    <button className="ai-save-btn" onClick={() => handleCoverUpdate()}>
                        💾 이미지 저장하기
                    </button>
                </div>
            )}
        </div>
    );
};