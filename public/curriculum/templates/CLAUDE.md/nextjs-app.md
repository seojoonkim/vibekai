# [프로젝트명]

<!-- TODO: 프로젝트 이름 수정 -->

## 프로젝트 소개

[한 줄 설명: 이 프로젝트가 뭘 하는지]

<!-- TODO: 프로젝트 설명 작성 -->

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태관리**: [Zustand / React Query / 기타]
- **DB**: [Supabase / PlanetScale / 기타]
- **배포**: [Vercel / AWS / 기타]

<!-- TODO: 실제 스택에 맞게 수정 -->

## 빠른 시작

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 수정 필요 (아래 환경변수 섹션 참고)

# 개발 서버 시작
npm run dev
```

## 환경변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | DB 연결 문자열 | `postgresql://...` |
| `NEXT_PUBLIC_API_URL` | API URL | `http://localhost:3000` |

<!-- TODO: 실제 환경변수에 맞게 수정 -->

## 폴더 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 라우트 그룹
│   ├── (main)/            # 메인 라우트 그룹
│   ├── api/               # API 라우트
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/            # 재사용 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   └── features/          # 기능별 컴포넌트
├── lib/                   # 유틸리티, 헬퍼
├── hooks/                 # 커스텀 훅
├── types/                 # TypeScript 타입
└── styles/                # 전역 스타일
```

## 코딩 컨벤션

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `UserProfile.tsx` |
| 훅 | camelCase + use | `useAuth.ts` |
| 유틸리티 | camelCase | `formatDate.ts` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS` |

### 컴포넌트 작성

```tsx
// 1. interface 먼저 정의
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

// 2. 함수형 컴포넌트
export function Button({ variant, children, onClick }: ButtonProps) {
  return (
    <button 
      className={cn(baseStyles, variants[variant])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### 파일 구조 (컴포넌트)

```
components/
└── UserProfile/
    ├── index.tsx          # 메인 컴포넌트
    ├── UserProfile.test.tsx
    └── UserProfile.stories.tsx  # (Storybook 사용 시)
```

## Git 규칙

### 브랜치

- `main`: 프로덕션
- `develop`: 개발 통합
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

### 커밋 메시지

Conventional Commits 사용:

```
feat(auth): Add Google OAuth login
fix(cart): Fix quantity update issue
docs(readme): Update installation guide
```

## 자주 쓰는 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | 테스트 실행 |
| `npm run typecheck` | 타입 검사 |

## 배포

```bash
# Vercel 배포 (추천)
vercel

# 또는 수동 빌드 후 배포
npm run build
```

## 주의사항

- [ ] `.env` 파일 커밋 금지
- [ ] `next.config.js` 수정 후 서버 재시작 필요
- [ ] Image 컴포넌트 사용 시 `domains` 설정 확인

## 문제 해결

### "Module not found" 에러

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### 타입 에러

```bash
npm run typecheck
# 에러 확인 후 수정
```

## 관련 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

<!-- 변경 이력 -->
## 변경 이력

| 날짜 | 내용 | 작성자 |
|------|------|--------|
| YYYY-MM-DD | 초기 작성 | @username |
