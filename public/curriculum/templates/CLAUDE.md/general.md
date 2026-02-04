# [프로젝트명]

<!-- TODO: 프로젝트 이름 수정 -->

## 프로젝트 소개

[한 줄 설명: 이 프로젝트가 뭘 하는지]

**목적**: [왜 이 프로젝트를 만들었는지]

<!-- TODO: 프로젝트 설명 작성 -->

## 빠른 시작

```bash
# 1. 저장소 클론
git clone [repo-url]
cd [project-name]

# 2. 의존성 설치
[npm install / pip install -r requirements.txt / ...]

# 3. 환경 설정
cp .env.example .env
# .env 파일 수정

# 4. 실행
[npm run dev / python main.py / ...]
```

## 기술 스택

<!-- TODO: 실제 스택에 맞게 수정 -->

| 분류 | 기술 |
|------|------|
| 언어 | [JavaScript / Python / ...] |
| 프레임워크 | [React / Django / ...] |
| 데이터베이스 | [PostgreSQL / MongoDB / ...] |
| 배포 | [Vercel / AWS / ...] |

## 환경변수

| 변수명 | 설명 | 필수 | 기본값 |
|--------|------|------|--------|
| `API_KEY` | API 인증 키 | ✅ | - |
| `DEBUG` | 디버그 모드 | ❌ | `false` |

<!-- TODO: 실제 환경변수에 맞게 수정 -->

## 폴더 구조

```
project/
├── src/                   # 소스 코드
├── tests/                 # 테스트
├── docs/                  # 문서
├── scripts/               # 스크립트
└── config/                # 설정 파일
```

<!-- TODO: 실제 구조에 맞게 수정 -->

## 코딩 컨벤션

### 일반 규칙

- 들여쓰기: 스페이스 2칸 (또는 4칸)
- 줄 끝 세미콜론: [있음 / 없음]
- 문자열: [작은따옴표 / 큰따옴표]

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `getUserData` |
| 클래스 | PascalCase | `UserService` |
| 상수 | UPPER_SNAKE | `MAX_RETRY` |
| 파일 | kebab-case | `user-service.js` |

## Git 규칙

### 브랜치

```
main          # 프로덕션
├── develop   # 개발 통합
├── feature/* # 기능 개발
├── fix/*     # 버그 수정
└── hotfix/*  # 긴급 수정
```

### 커밋 메시지

```
<type>(<scope>): <description>

feat(auth): Add login feature
fix(api): Fix null pointer exception
docs(readme): Update installation guide
```

## 자주 쓰는 명령어

<!-- TODO: 실제 명령어에 맞게 수정 -->

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 |
| `npm run build` | 빌드 |
| `npm run test` | 테스트 실행 |
| `npm run lint` | 린트 검사 |

## 배포

```bash
# 배포 명령어
[...]
```

## 문제 해결

### 자주 발생하는 문제

**Q: [문제 설명]**
```bash
# 해결 방법
[...]
```

## 중요한 결정들

<!-- 왜 이런 선택을 했는지 기록 -->

| 날짜 | 결정 | 이유 |
|------|------|------|
| YYYY-MM-DD | [결정 내용] | [이유] |

## 관련 링크

- [문서 링크]
- [관련 저장소]

---

## 변경 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| YYYY-MM-DD | 초기 작성 | @username |
