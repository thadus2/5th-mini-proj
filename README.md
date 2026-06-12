# 📚 AI Books
> **AI 표지 생성을 지원하는 도서관리시스템 서버 (KT 에이블스쿨 5차 미니프로젝트)**
> 
>본 프로젝트는 사용자가 도서 정보를 등록할 때 OpenAI를 활용해 AI 도서 표지를 자동으로 생성하고, 이를 관리하는 Spring Boot 기반의 백엔드 시스템입니다. Frontend(db.json 및 fetch 호출 패턴) 분석을 바탕으로 유연하고 예외 처리가 견고한 도서 데이터 API를 제공합니다.

---

## 🛠 1. 기술 스택 (Tech Stack)

### Frontend
* **Core & Routing:** React, React Router DOM (`useLocation`, `useNavigate`, `useParams`)
* **State & Hooks:** React Hooks (`useState`, `useEffect`, `useRef`)
* **Authentication:** Cookie 기반 전역 로그인 상태 관리 (AccessToken 활용)

### Backend
* **Framework & Security:** Java 17, Spring Boot 3.x, Spring Security, JWT (JwtTokenProvider), BCrypt 암호화
* **Database & ORM:** H2 Database (In-Memory), Spring Data JPA
* **AI Integration:** OpenAI API (GPT Image Generation Model)

### Build & Collaboration
* **Tools:** Gradle, GitHub

---

## 🚀 2. 실행 방법 (Getting Started)

### 2-1. 사전 준비 (Prerequisites)
* JDK 17 이상이 설치되어 있어야 합니다.

* OpenAI API를 사용하기 위한 API Key가 필요합니다.

### 2-2. 소스 다운로드 및 최신화
```bash
# React & Vite 프로젝트 폴더 생성(cmd창을 열고 진행)
>git clone https://github.com/thadus2/5th-mini-proj.git
>cd 5th-mini-proj
>cd frontend
5th-mini-proj\frontend>npm install
5th-mini-proj\frontend>npm run dev
```

```bash
# GitHub에 업데이트된 내용으로 갱신하는 코드
# 작업중이던 파일이 사라질 수 있으니 필요한 경우 사전에 백업해주세요
5th-mini-proj>git fetch --all
5th-mini-proj>git reset --hard origin/main
```

### 2-3. 환경 변수 설정 (application.yml)
`src/main/resources/application.yml` 파일에 데이터베이스 환경설정, CORS 연동, JPA 초기화 및 OpenAI 설정을 구성합니다.

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
  jpa:
    defer-datasource-initialization: true # 초기 데이터(data.sql) 인입 에러 방지

# OpenAI API 설정
openai:
  api:
    key: ${OPENAI_API_KEY:YOUR_OPENAI_API_KEY_HERE}

# CORS 설정 (React 프론트엔드 연동용)
cors:
  allowed-origins: "http://localhost:3000"
```

---

## 🔌 3. API 명세서 (API Specification)
* BASE_URL : `http://localhost:8080/api/v1`

* 인증 필요 API 요청 시 Header 규칙 : `Authorization: Bearer {AccessToken}`

### 3-1. 인증 및 회원 관리 (`/auth` 또는 `/user`)
| 기능 | Method | URL | Request Body / Header | Response / 비고 |
| :--- | :--- | :--- | :--- | :--- |
| **회원가입** | `POST` | `/auth/sign-up` | 회원 정보 JSON Object | `200 OK` |
| **로그인** | `POST` | `/auth/sign-in` | `{"loginId": "...", "password": "..."}` | `{"grantType": "Bearer", "accessToken": "..."}` |
| **내 정보 조회** | `GET` | `/auth/me` | **Header:** Bearer 토큰 필요 | UserInfoResponseDto (작성글, 좋아요 목록 포함) |
| **회원정보 수정** | `PUT` | `/user` | **Header:** Bearer 토큰<br>**Body:** 수정 데이터 | 수정된 회원 정보 Object |
| **비밀번호 변경** | `PATCH` | `/user/password` | **Body:** `currentPassword`, `newPassword` | 변경 완료 메시지 |

### 3-2. 도서 관리 및 인터랙션 (`/books`)
| 기능 | Method | URL | Path Variable / Body | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **도서 전체 조회** | `GET` | `/books` | **Query Parameter:** `keyword` (선택) | 전체 도서 및 검색 결과 조회 |
| **도서 상세 조회** | `GET` | `/books/{id}` | `id` (Path) | 도서 상세 데이터 반환 |
| **신규 도서 등록** | `POST` | `/books` | 도서 정보 JSON Object | 로그인 유저만 가능 |
| **도서 수정** | `PATCH` | `/books/{id}` | `id` (Path)<br>**Body:** 수정할 필드 데이터 | 본인 작성 글만 부분 수정 가능 |
| **도서 삭제** | `DELETE` | `/books/{id}` | `id` (Path) | 본인 작성 글만 삭제 가능 (`204 No Content`) |
| **좋아요 토글** | `POST` | `/books/{id}/like` | `id` (Path) | 실시간 `likeCount`, `isLiked` 반환 |
| **조회수 증가** | `PATCH` | `/books/{id}/views` | `id` (Path) | 상세 페이지 진입 시 중복 방지 반영 |
| **AI 표지 변경** | `PATCH` | `/books/{id}/cover` | `id` (Path)<br>**Body:** `{"coverImageUrl": "http://..."}` | 생성된 AI 도서 표지 URL 업데이트 |

---

## 👥 4. R&R 및 팀원 역할 분담
프로젝트의 효율적인 진행을 위해 프론트엔드 분석부터 백엔드 각 계층 구현 및 예외 처리까지 체계적으로 역할을 분담하여 프로젝트를 수행했습니다.

| 이름 | 역할 | 담당 업무 |
| :--- | :--- | :--- |
| **박승훈** | **백엔드 1 (조장)** | 프로젝트 리드, 백엔드 구조 총괄, 도서 정보 비즈니스 로직 및 AI 연동 코어 개발 |
| **강승혁** | **백엔드 2 / PPT** | Service 계층 골격 구현 및 비즈니스 예외 설계, PPT 제작, BookUpdateResponseDto 구현 |
| **김정하** | **백엔드 3 / 검토** | Controller 계층 골격 구현, API 라우팅 검토 및 최적화, BookCreateResponseDto 구현 |
| **최현호** | **백엔드 3 / 검토** | Controller 계층 골격 구현, API 라우팅 검토 및 최적화, BookCreateResponseDto 구현 |
| **이상준** | **PM / 발표자** | ERD 작성, API 정의서 도출, BookDetailResponseDto 구현, README.md 작성 |
| **박병준** | **통합·예외 / PPT** | WebConfig(CORS) 설정, 글로벌 예외 처리(Exception Handler) 구현, PPT 제작, BookFavoriteResponseDto 구현 |
| **김경은** | **통합·예외 / 서기** | application.yml 설정 관리, 공통 예외 응답 포맷 설계, 회의록 작성, BookFavoriteResponseDto 구현 |
| **박희상** | **AI·Front / 서기** | Frontend fetch 패턴 분석, API 엔드포인트 검증 및 AI 연동 테스트, 회의록 작성, BookDetailResponseDto 구현 |
| **이정재** | **AI·Front / PPT** | Frontend 통신 연동 지원, API 응답 데이터 매핑, PPT 제작, BookUpdateResponseDto 구현 |

---

## 🔍 5. 트러블슈팅 (Troubleshooting)

### 5-1. 내부 스택 트레이스 노출 문제 (`500 Internal Server Error`)

* **현상**: 존재하지 않는 도서 조회 시 `BookNotFoundException`이 발생하며 서버 내부의 긴 스택 트레이스가 클라이언트에 그대로 노출됨.

* **해결**: `@RestControllerAdvice`를 활용한 전역 예외 처리(Global Exception Handling)를 도입하여, 유효성 검증 실패 및 커스텀 예외 발생 시 정제된 JSON 포맷 응답을 반환하도록 개선.

### 5-2. 필수 데이터 공백 입력 시 서버 에러 발생

* **현상**: `viewCount`, `likeCount` 필드가 `@Column(nullable = false)`인 상태에서 공백 데이터 요청 시 클라이언트 에러(`400`)가 아닌 서버 데이터 정합성 에러(`500 DataIntegrityViolationException`)가 발생함.

* **해결**: 전역 예외 처리기에서 해당 에러를 인터셉트하여 `400 Bad Request`로 정상 분류하고 직관적인 에러 메시지를 응답하도록 수정.

### 5-3. PATCH 메서드의 전체 필드 요구 문제

* **현상**: 도서 정보 수정(`PATCH /books/{id}`) 시, 변경을 원하는 부분 데이터(Partial Update)만 송신하면 에러가 발생하고 모든 필드 값을 채워야만 정상 작동함.

* **해결**: 서비스 계층의 수정 로직을 보완하여 프론트엔드에서 보낸 필드만 선택적으로 변경되도록 동적 반영 로직 구축.

---

## 🏆 6. 주요 구현 결과 (Key Deliverables)

### 6-1. 쿠키 기반 전역 로그인 및 보안 인가 (Frontend & Backend 연동)

* `src/utils/cookie.js`를 통해 AccessToken 쿠키 생성/삭제 메커니즘을 구현했습니다.

* 헤더에서 주소 변동(`useLocation`)을 감시하여 [로그인] 버튼과 [마이페이지] 버튼이 동적으로 스위칭되도록 구현했습니다.

* 도서 상세 페이지 진입 시 본인이 작성한 글에만 [수정/삭제] 버튼이 활성화되도록 권한 제어 필터를 연동했습니다.

### 6-2. 보안 및 최적화를 위한 DTO 구조 세분화
Entity 속성의 무분별한 외부 노출을 제한하고 자원을 최적화하기 위해 데이터 전송 객체(DTO)를 완벽히 분리했습니다.

* `BookDetailResponseDto`: 도서 단건 및 목록 조회용 응답 포맷.

* `BookCreateResponseDto`: 등록 성공 시 핵심 식별 정보만 제한 반환.

* `BookFavoriteResponseDto`: '좋아요' 토글 시 전체 페이지 리로드 없이 화면 단에서 실시간 카운트(`likeCount`)와 활성화 상태(`isLiked`)만 독립적으로 변경되도록 비동기 렌더링 최적화 달성.

### 6-3. 테스트 환경 및 초기 데이터 구축 (E2E 효율화)
* 초기 데이터 자동 인입: `data.sql` 설정을 통해 '마션', '드래곤 라자' 등 6종의 도서 샘플 데이터를 서버 구동과 동시에 DB에 자동 인입시켜 Postman 및 화면 연동 테스트 효율을 극대화했습니다.

* 인프라 안정성: `jpa.defer-datasource-initialization` 설정을 적용하여 구동 시점의 스키마-데이터 정합성 충돌 문제를 해결했습니다.
---
