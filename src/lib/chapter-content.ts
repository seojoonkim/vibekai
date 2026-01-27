// Sample chapter content for VibeDojo
// This can be replaced with actual content from a CMS or GitHub repo later

export const chapterContent: Record<string, string> = {
  "01": `
# 바이브코딩 소개

바이브코딩(Vibecoding)은 AI와 함께 코드를 작성하는 새로운 프로그래밍 패러다임입니다.

## 바이브코딩이란?

바이브코딩은 2025년 Andrej Karpathy가 처음 언급한 개념으로, AI 코드 어시스턴트와 자연어로 소통하면서 코드를 작성하는 방식을 의미합니다.

### 핵심 특징

1. **자연어 중심**: 코드 문법보다 의도를 자연어로 표현
2. **AI 협업**: AI가 코드를 생성하고, 개발자는 검토하고 수정
3. **빠른 프로토타이핑**: 아이디어를 빠르게 코드로 구현
4. **학습 곡선 단축**: 프로그래밍 경험이 없어도 시작 가능

## 왜 바이브코딩인가?

기존 프로그래밍 방식과 비교했을 때:

| 전통적 방식 | 바이브코딩 |
|------------|-----------|
| 문법 암기 필요 | 의도 표현에 집중 |
| 에러 디버깅 어려움 | AI가 에러 해결 도움 |
| 높은 진입 장벽 | 누구나 시작 가능 |
| 반복적인 boilerplate | AI가 자동 생성 |

## 시작하기 전에

바이브코딩을 시작하기 위해 필요한 것들:

- **AI 코드 어시스턴트**: Cursor, GitHub Copilot, Claude 등
- **기본 컴퓨터 지식**: 파일 시스템, 터미널 기초
- **열린 마음**: 새로운 방식에 대한 수용력

다음 챕터에서는 개발 환경을 설정하는 방법을 알아봅니다.
  `,

  "02": `
# 개발 환경 설정

바이브코딩을 위한 최적의 개발 환경을 구축해봅시다.

## 필수 도구 설치

### 1. Cursor 설치

Cursor는 바이브코딩에 최적화된 AI-first 코드 에디터입니다.

\`\`\`bash
# macOS
brew install --cask cursor

# Windows
# https://cursor.sh 에서 다운로드
\`\`\`

### 2. Node.js 설치

JavaScript/TypeScript 개발을 위한 런타임:

\`\`\`bash
# Node.js 설치 확인
node --version

# npm 설치 확인
npm --version
\`\`\`

### 3. Git 설치

버전 관리를 위한 필수 도구:

\`\`\`bash
git --version
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
\`\`\`

## Cursor 설정

### AI 모델 선택

1. Cursor 설정(Cmd/Ctrl + ,) 열기
2. "Models" 탭 선택
3. 다음 모델 중 선택:
   - **Claude 3.5 Sonnet**: 균형 잡힌 성능 (추천)
   - **GPT-4**: 복잡한 로직에 강함
   - **Claude 3 Opus**: 최고 품질 (느림)

### .cursorrules 파일

프로젝트 루트에 \`.cursorrules\` 파일을 만들어 AI 동작을 커스터마이징:

\`\`\`
You are an expert in TypeScript and React.
Always use functional components.
Prefer arrow functions.
Use Korean for comments.
\`\`\`

## 첫 프로젝트 생성

\`\`\`bash
# 새 Next.js 프로젝트 생성
npx create-next-app@latest my-vibe-project

# 프로젝트 폴더로 이동
cd my-vibe-project

# Cursor로 열기
cursor .
\`\`\`

다음 챕터에서는 AI 코드 어시스턴트의 동작 원리를 알아봅니다.
  `,

  "03": `
# AI 코드 어시스턴트 이해하기

AI 어시스턴트가 어떻게 작동하는지 이해하면 더 효과적으로 활용할 수 있습니다.

## LLM의 기본 원리

### 토큰화

AI는 텍스트를 **토큰** 단위로 처리합니다:

\`\`\`
"Hello World" → ["Hello", " World"]
"function add(a, b)" → ["function", " add", "(", "a", ",", " b", ")"]
\`\`\`

### 컨텍스트 윈도우

AI가 한 번에 처리할 수 있는 텍스트 양:

| 모델 | 컨텍스트 크기 |
|------|--------------|
| GPT-4 | 128K tokens |
| Claude 3.5 | 200K tokens |
| Claude 3 Opus | 200K tokens |

## 주요 AI 어시스턴트 비교

### Cursor

- **장점**: AI-first 설계, 빠른 응답, Composer 기능
- **단점**: 유료, 일부 기능 제한

### GitHub Copilot

- **장점**: GitHub 통합, 안정적
- **단점**: 컨텍스트 이해 제한적

### Claude (API)

- **장점**: 긴 컨텍스트, 정확한 이해
- **단점**: API 직접 사용 필요

## 효과적인 사용법

### 1. 명확한 의도 전달

\`\`\`
❌ "버튼 만들어"
✅ "클릭하면 카운트가 1씩 증가하는 버튼 컴포넌트를 만들어.
    현재 카운트를 표시하고, 스타일은 Tailwind CSS 사용"
\`\`\`

### 2. 컨텍스트 제공

\`\`\`
❌ "이 함수 수정해"
✅ "이 함수는 사용자 데이터를 가져오는데,
    에러 처리가 없어서 네트워크 오류 시 크래시가 발생해.
    try-catch로 에러 처리 추가해줘"
\`\`\`

### 3. 단계적 요청

복잡한 작업은 작은 단계로 나눠서 요청하세요.

다음 챕터에서는 첫 바이브코딩 프로젝트를 직접 만들어봅니다!
  `,

  "04": `
# 파일 읽고 쓰기

Claude Code에서 파일을 읽고, 생성하고, 수정하는 방법을 배워봅시다.

## 파일 읽기

Claude Code에서 파일을 읽는 것은 매우 간단합니다. 파일 경로를 대화에서 언급하기만 하면 됩니다.

### 기본 방법

\`\`\`
"src/app/page.tsx 파일을 읽어줘"
"package.json 내용을 확인해줘"
\`\`\`

특별한 명령어 없이 자연어로 파일 경로를 언급하면 Claude가 자동으로 해당 파일을 읽고 분석합니다.

### 여러 파일 읽기

\`\`\`
"src/components 폴더의 모든 컴포넌트 파일을 확인해줘"
"App.tsx와 index.css를 함께 읽어줘"
\`\`\`

## 파일 생성하기

새로운 파일을 만들 때는 다음 정보를 제공하세요:

1. **파일 경로와 이름**: 어디에 어떤 이름으로 만들지
2. **파일의 목적과 내용**: 무엇을 하는 파일인지
3. **사용할 프로그래밍 언어**: TypeScript, JavaScript 등

### 예시

\`\`\`
"src/utils/helpers.ts 파일을 만들어줘.
날짜 포맷팅 함수와 문자열 검증 함수를 포함해줘."
\`\`\`

**파일 생성 날짜**는 시스템이 자동으로 기록하므로 별도로 지정할 필요가 없습니다.

## 파일 수정하기

### 단일 파일 수정

\`\`\`
"App.tsx에서 useState를 추가하고 카운터 기능을 넣어줘"
\`\`\`

Claude는 변경사항을 **diff 형식**으로 보여줍니다:

\`\`\`diff
- const name = "Hello";
+ const name = "Hello World";
\`\`\`

이를 통해 무엇이 변경되는지 명확하게 확인한 후 승인할 수 있습니다.

### 여러 파일 동시 수정

여러 파일을 한 번에 수정할 때는 변경할 파일들과 수정 내용을 함께 설명하세요:

\`\`\`
"Header.tsx와 Footer.tsx의 배경색을
동일한 테마 색상으로 통일해줘"
\`\`\`

Claude가 관련된 모든 파일을 일관성 있게 수정합니다.

## 대용량 파일 다루기

대용량 파일을 다룰 때는 **필요한 부분만 지정**해서 읽으세요:

\`\`\`
"App.tsx에서 handleSubmit 함수만 확인해줘"
"package.json의 dependencies 부분만 보여줘"
"100번 라인부터 150번 라인까지만 읽어줘"
\`\`\`

전체 파일을 읽으면 컨텍스트 한도를 초과할 수 있습니다. 필요한 부분(특정 함수, 라인 범위 등)만 지정하면 효율적입니다.

## 파일 작업 팁

1. **명확한 경로**: 상대 경로나 절대 경로를 명확히 지정
2. **구체적인 설명**: 무엇을 변경하고 싶은지 자세히 설명
3. **변경 확인**: diff를 보고 의도한 대로 수정되는지 확인
4. **단계적 수정**: 큰 변경은 작은 단계로 나눠서 진행

다음 챕터에서는 터미널 명령어 실행 방법을 배웁니다.
  `,

  "05": `
# 터미널 명령어

Claude Code를 통해 터미널 명령어를 실행하는 방법을 배워봅시다.

## 터미널 명령어 실행하기

Claude Code에서 터미널 명령어를 실행하는 것은 간단합니다. 자연어로 실행할 명령어를 요청하면 됩니다.

### 기본 사용법

\`\`\`
"npm install 실행해줘"
"git status 확인해줘"
"프로젝트 빌드해줘"
\`\`\`

별도의 터미널 앱을 열 필요 없이, Claude에게 자연어로 요청하면 해당 명령어를 터미널에서 실행합니다.

## 실행 가능한 명령어

Claude Code는 대부분의 개발 관련 명령어를 실행할 수 있습니다:

- **패키지 관리**: npm install, yarn add, pnpm install
- **Git 작업**: git status, git add, git commit
- **빌드/실행**: npm run build, npm start, python script.py
- **파일 탐색**: ls -la, pwd, cat filename

### 보안 제한

시스템 종료, 파일 전체 삭제 등 **위험한 명령어는 보안상 제한**됩니다.

## 명령어 실행 프로세스

Claude Code는 명령어를 실행하기 전에 다음과 같이 동작합니다:

1. **명령어 표시**: 실행할 명령어를 보여줌
2. **확인 요청**: 사용자의 승인을 기다림
3. **실행**: 승인 후 명령어 실행
4. **결과 표시**: 실행 결과와 출력을 보여줌

이를 통해 의도하지 않은 명령어가 실행되는 것을 방지할 수 있습니다.

## 여러 명령어 순차 실행

여러 명령어를 순서대로 실행하고 싶다면 실행 순서와 함께 요청하세요:

\`\`\`
"먼저 npm install 하고,
그 다음 npm run build 실행해줘"
\`\`\`

\`\`\`
"의존성 설치 후 개발 서버를 시작해줘"
\`\`\`

Claude가 명령어를 순차적으로 실행합니다.

## 에러 처리

명령어 실행 중 에러가 발생하면 Claude Code는:

1. **에러 내용 분석**: 에러 메시지를 읽고 원인 파악
2. **해결책 제안**: 문제 해결 방법 제시
3. **수정된 명령어 제안**: 필요시 올바른 명령어 제안

### 예시

\`\`\`
에러: "npm: command not found"

Claude의 응답:
"npm이 설치되어 있지 않은 것 같습니다.
Node.js를 먼저 설치해야 합니다.
https://nodejs.org 에서 다운로드할 수 있습니다."
\`\`\`

## 디렉토리 작업

### 디렉토리 구조와 경로

- **절대 경로**: /Users/username/projects/myapp
- **상대 경로**: ./src/components, ../utils

### 파일 및 폴더 작업

\`\`\`bash
# 폴더 생성
mkdir new-folder

# 파일 이동
mv old-location.txt new-location.txt

# 파일 복사
cp source.txt destination.txt

# 파일 삭제
rm file.txt
\`\`\`

Claude에게 파일 작업을 요청할 수 있습니다:

\`\`\`
"src/components 폴더를 만들어줘"
"config.json을 backup 폴더로 복사해줘"
\`\`\`

## 실용 팁

1. **명확한 요청**: 어떤 명령어를 실행할지 명확히 설명
2. **에러 공유**: 에러가 발생하면 전체 메시지를 Claude에게 보여주기
3. **순서 지정**: 여러 명령어는 실행 순서를 명시
4. **확인 습관**: 중요한 작업 전에는 명령어를 다시 확인

다음 챕터에서는 프로젝트 구조를 이해하는 방법을 배웁니다.
  `,

  "06": `
# 프로젝트 구조 이해

Claude Code가 프로젝트 구조를 어떻게 파악하고, 효과적으로 프로젝트를 분석하는 방법을 배워봅시다.

## Claude Code의 프로젝트 분석

Claude Code는 프로젝트의 파일 구조, 설정 파일, 패키지 정보 등을 자동으로 분석하여 프로젝트 구조를 파악합니다.

### 자동 분석 항목

- **package.json**: 프로젝트 의존성과 스크립트
- **tsconfig.json / jsconfig.json**: TypeScript/JavaScript 설정
- **폴더 구조**: src, components, pages 등의 디렉토리 구조
- **.gitignore**: 제외된 파일 패턴
- **README.md**: 프로젝트 설명

특별히 요청하지 않아도 Claude가 이러한 파일들을 참고하여 프로젝트를 이해합니다.

## 새 프로젝트 시작하기

새로운 프로젝트를 시작할 때는 Claude에게 프로젝트 개요와 목표를 먼저 설명하세요:

\`\`\`
"Next.js 14 프로젝트를 시작하려고 해.
블로그 사이트를 만들 건데,
- Markdown 기반 포스트
- 카테고리별 분류
- 검색 기능
이렇게 구성하고 싶어."
\`\`\`

Claude가 프로젝트 목적과 기술 스택을 이해하고 적절한 구조를 제안합니다.

## 일반적인 프로젝트 구조

### Next.js 프로젝트

\`\`\`
my-project/
├── src/
│   ├── app/          # App Router 페이지
│   ├── components/   # 재사용 컴포넌트
│   └── lib/          # 유틸리티 함수
├── public/           # 정적 파일
├── package.json      # 의존성 관리
└── tsconfig.json     # TypeScript 설정
\`\`\`

### React 프로젝트

\`\`\`
my-app/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── App.tsx
├── public/
└── package.json
\`\`\`

## 프로젝트 규칙 유지하기

특정 패턴이나 구조를 유지하려면 **.cursorrules** 또는 **CLAUDE.md** 파일에 규칙을 명시하세요:

\`\`\`markdown
# CLAUDE.md

## 프로젝트 규칙

- 모든 컴포넌트는 src/components에 위치
- 파일명은 kebab-case 사용 (예: user-profile.tsx)
- 서버 컴포넌트는 기본, 클라이언트는 'use client' 명시
- Tailwind CSS로 스타일링
\`\`\`

이렇게 설정하면 Claude가 일관된 스타일을 유지합니다.

## 모노레포(Monorepo) 다루기

모노레포 프로젝트에서는 작업할 **특정 패키지나 앱을 명확히 지정**해야 합니다:

\`\`\`
"packages/web-app의 Header 컴포넌트를 수정해줘"
"apps/mobile에 새로운 스크린을 추가해줘"
\`\`\`

각 패키지가 독립적으로 개발되므로, 어느 부분을 작업할지 명시하는 것이 중요합니다.

## 의존성 확인하기

프로젝트의 의존성을 확인하려면:

\`\`\`
"package.json 파일을 분석해줘"
"현재 설치된 라이브러리 목록을 보여줘"
"이 프로젝트가 사용하는 주요 기술 스택은 뭐야?"
\`\`\`

Claude가 package.json, requirements.txt 등을 분석하여 의존성 정보를 제공합니다.

## 프로젝트 분석 요청하기

\`\`\`
"이 프로젝트의 전체 구조를 설명해줘"
"어떤 페이지들이 있는지 확인해줘"
"API 라우트는 어디에 정의되어 있어?"
\`\`\`

Claude가 프로젝트를 분석하고 구조를 설명해줍니다.

다음 챕터에서는 컨텍스트와 메모리 관리에 대해 배웁니다.
  `,

  "07": `
# 컨텍스트와 메모리

Claude Code의 컨텍스트 윈도우와 효율적인 메모리 관리 방법을 알아봅시다.

## 컨텍스트 윈도우란?

**컨텍스트 윈도우**는 Claude가 한 번에 고려할 수 있는 정보의 최대 양을 의미합니다.

여기에는 다음이 포함됩니다:
- 대화 내용 (이전 메시지들)
- 읽은 파일 내용
- 프로젝트 구조 정보
- 생성한 코드

컨텍스트 윈도우는 제한이 있으므로, 효율적으로 관리해야 합니다.

## 컨텍스트 윈도우 크기

Claude의 컨텍스트 윈도우는 약 **200,000 토큰**입니다. 이는 대략:
- 영문 단어 약 150,000개
- 코드 라인 약 40,000줄
- 일반 책 약 2권 분량

충분히 크지만, 대규모 프로젝트에서는 관리가 필요합니다.

## 효율적인 컨텍스트 관리

### 1. 핵심 내용 요약하기

긴 대화가 진행되면 주기적으로 핵심 내용을 요약하세요:

\`\`\`
"지금까지 우리가 작업한 내용을 요약해줘"
"현재 프로젝트 상태를 간단히 정리해줘"
\`\`\`

요약을 통해 중요한 맥락을 유지하면서 컨텍스트를 효율적으로 사용할 수 있습니다.

### 2. 필요한 파일만 참조하기

\`\`\`
❌ "모든 파일을 읽어줘"
✅ "App.tsx와 관련된 컴포넌트 파일들만 확인해줘"
\`\`\`

### 3. @파일 멘션 활용

특정 파일을 명시적으로 참조:

\`\`\`
"@src/components/Header.tsx 이 파일의 props를 확인해줘"
\`\`\`

## CLAUDE.md 파일

프로젝트 루트에 **CLAUDE.md** 파일을 만들어 프로젝트 정보와 규칙을 저장하세요.

### CLAUDE.md 예시

\`\`\`markdown
# My Project

## 개요
블로그 플랫폼 - Next.js 14 + Supabase

## 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database)

## 코딩 규칙
- 함수형 컴포넌트 사용
- async/await로 비동기 처리
- 에러는 try-catch로 처리
- 한국어 주석 사용

## 주요 명령어
- 개발 서버: npm run dev
- 빌드: npm run build
- 테스트: npm test
\`\`\`

Claude가 대화 시작 시 이 파일을 참조합니다.

## 새 대화 시작하기

새 대화를 시작하면 이전 대화의 컨텍스트는 **기본적으로 초기화**됩니다.

필요한 정보를 유지하려면:
1. **CLAUDE.md**에 중요 정보 기록
2. 프로젝트 파일로 정보 보존
3. 새 대화에서 필요한 파일 다시 참조

## 컨텍스트 한도 관리

컨텍스트 한도에 가까워지면:

### 방법 1: 요약 후 계속
\`\`\`
"지금까지 작업 내용을 요약하고,
핵심 정보만 유지하면서 계속 진행하자"
\`\`\`

### 방법 2: 새 대화 시작
중요한 내용을 CLAUDE.md나 코드로 저장하고 새 대화 시작

### 방법 3: 특정 파일에만 집중
불필요한 파일 참조를 줄이고 현재 작업에 필요한 파일만 다루기

다음 챕터에서는 효과적인 프롬프팅 기법을 배웁니다.
  `,

  "08": `
# 효과적인 프롬프팅

좋은 프롬프트는 좋은 코드의 시작입니다. 명확하고 효과적인 요청을 작성하는 방법을 배워봅시다.

## 효과적인 프롬프트의 핵심 요소

1. **명확한 목표 설명** - 무엇을 만들고 싶은지
2. **필요한 컨텍스트 제공** - 현재 상황과 배경
3. **예상 결과 설명** - 어떻게 동작해야 하는지
4. **제약 조건 명시** - 지켜야 할 규칙이나 제한사항

❌ **나쁜 예**: "버튼 만들어"
✅ **좋은 예**: "클릭하면 카운트가 1씩 증가하는 버튼 컴포넌트를 만들어줘. 현재 카운트를 표시하고, Tailwind CSS로 스타일링해줘."

## 복잡한 작업 요청하기

복잡한 작업은 **작은 단계로 나누어** 요청하세요.

### 나쁜 예 (한 번에 모든 것)
\`\`\`
"소셜 미디어 앱을 만들어줘"
\`\`\`

### 좋은 예 (단계별)
\`\`\`
Step 1: "사용자 프로필 컴포넌트를 만들어줘. 이름, 아바타, 소개글을 표시해."

Step 2: "프로필 수정 기능을 추가해줘. 모달 형태로 열리게."

Step 3: "프로필 이미지 업로드 기능을 넣어줘. Supabase Storage 사용."
\`\`\`

각 단계를 확인하며 진행하면 문제가 생겨도 빠르게 수정할 수 있습니다.

## 구체적인 요청 작성하기

### 버그 수정 요청

❌ **모호한 요청**: "이 코드 고쳐줘"

✅ **구체적인 요청**:
\`\`\`
"이 함수는 사용자 데이터를 가져오는데,
네트워크 오류 시 앱이 크래시돼.
try-catch로 에러 처리를 추가하고,
에러 발생 시 기본값을 반환하도록 수정해줘."
\`\`\`

### 기능 추가 요청

\`\`\`
"사용자 목록에 검색 기능을 추가해줘.

요구사항:
- 실시간 검색 (타이핑할 때마다)
- 이름과 이메일로 검색
- 대소문자 구분 안 함
- 검색어가 없으면 전체 목록 표시
\`\`\`

## 코드 스타일 일관성 유지

기존 프로젝트의 코딩 스타일을 따르도록 명시하세요:

\`\`\`
"이 프로젝트의 기존 코딩 스타일을 따라서
새로운 함수를 작성해줘."
\`\`\`

또는 .cursorrules에 스타일 가이드를 정의:

\`\`\`
# .cursorrules

- 항상 함수형 컴포넌트 사용
- Arrow function 선호
- 한국어 주석
- Tailwind CSS로 스타일링
\`\`\`

## 컨텍스트 제공하기

### 나쁜 예
\`\`\`
"이 함수 수정해"
\`\`\`

### 좋은 예
\`\`\`
"이 fetchUserData 함수는 API에서 사용자 정보를 가져와.
현재 문제:
- 에러 처리가 없어서 실패 시 앱이 멈춤
- 로딩 상태를 표시하지 않음

수정 요청:
- try-catch 추가
- 로딩 상태 반환
- 에러 발생 시 null 반환
\`\`\`

## 결과가 만족스럽지 않을 때

구체적인 피드백과 함께 수정 요청:

\`\`\`
"좋은데, 몇 가지 수정해줘:
1. 버튼 색상을 파란색으로 변경
2. 클릭 시 애니메이션 추가
3. 로딩 중에는 버튼 비활성화"
\`\`\`

어떤 부분이 문제인지, 어떻게 수정되면 좋을지 명확히 설명하세요.

## 프롬프트 템플릿

### 새 기능 개발
\`\`\`
[기능명]을 구현해줘.

현재 상황:
- [배경 설명]

요구사항:
- [기능 1]
- [기능 2]

제약사항:
- [기술 스택]
- [지켜야 할 규칙]
\`\`\`

### 버그 수정
\`\`\`
[증상] 문제가 발생해.

재현 방법:
1. [단계 1]
2. [단계 2]

예상 동작: [원하는 동작]
실제 동작: [현재 동작]

에러 메시지:
[에러 내용]
\`\`\`

다음 챕터에서는 코드베이스를 탐색하는 방법을 배웁니다.
  `,

  "09": `
# 코드 탐색하기

Claude Code를 활용해 대규모 코드베이스를 효율적으로 탐색하는 방법을 배워봅시다.

## 코드베이스 탐색의 중요성

대규모 프로젝트에서는 수백, 수천 개의 파일이 있을 수 있습니다. Claude Code를 사용하면 코드를 빠르게 찾고 이해할 수 있습니다.

## 특정 기능 찾기

기능을 설명하면 Claude가 관련 코드를 찾아줍니다:

\`\`\`
"사용자 인증 관련 코드가 어디에 있어?"
"결제 처리 로직을 찾아줘"
"이미지 업로드 기능은 어떻게 구현되어 있어?"
\`\`\`

파일명이나 정확한 위치를 몰라도, 기능을 설명하면 Claude가 프로젝트를 탐색해서 관련 파일을 찾아줍니다.

## 코드 동작 이해하기

특정 함수나 모듈의 동작을 이해하고 싶을 때:

\`\`\`
"이 fetchUserProfile 함수가 어떻게 동작하는지 설명해줘"
"AuthContext는 어떤 역할을 해?"
"이 useCart 훅의 로직을 단계별로 설명해줘"
\`\`\`

Claude가 코드를 분석하고 상세한 설명을 제공합니다.

## 함수 호출 관계 파악

### 어디서 호출되는지 찾기

\`\`\`
"이 calculateTotal 함수는 어디서 사용돼?"
"sendEmail 함수를 호출하는 모든 곳을 찾아줘"
\`\`\`

### 어떤 함수를 호출하는지 찾기

\`\`\`
"이 processOrder 함수가 내부적으로 어떤 다른 함수들을 호출해?"
"이 컴포넌트가 사용하는 API 함수들을 나열해줘"
\`\`\`

## 의존성 분석

\`\`\`
"이 모듈이 의존하고 있는 다른 파일들을 보여줘"
"Payment 컴포넌트와 연결된 모든 파일을 찾아줘"
\`\`\`

Claude가 import/export 관계를 분석하여 의존성 구조를 보여줍니다.

## 레거시 코드 분석

오래된 코드나 다른 사람이 작성한 코드를 이해할 때:

\`\`\`
"이 코드의 전체 구조를 설명해줘"
"이 파일에서 개선할 수 있는 부분이 있어?"
"이 코드가 사용하는 패턴은 뭐야?"
"주석이 없는데 각 함수가 뭘 하는지 설명해줘"
\`\`\`

### 리팩토링 대상 찾기

\`\`\`
"중복된 코드가 있는지 찾아줘"
"성능 병목이 될 수 있는 부분이 있어?"
"보안 취약점이 있는지 확인해줘"
\`\`\`

## 잠재적 버그 찾기

\`\`\`
"이 코드에서 버그가 발생할 수 있는 부분이 있어?"
"에러 처리가 누락된 곳을 찾아줘"
"null 체크가 필요한 부분이 있어?"
\`\`\`

Claude가 코드를 분석하여 잠재적 문제점을 지적합니다.

## 컴포넌트 구조 파악

React 프로젝트에서:

\`\`\`
"이 컴포넌트가 받는 props는 뭐야?"
"이 컴포넌트의 자식 컴포넌트들을 나열해줘"
"컴포넌트 계층 구조를 설명해줘"
\`\`\`

## API 엔드포인트 찾기

\`\`\`
"사용자 정보를 가져오는 API는 어디에 정의되어 있어?"
"POST /api/orders 엔드포인트의 핸들러를 찾아줘"
"모든 API 라우트를 나열해줘"
\`\`\`

## 탐색 팁

1. **구체적으로 질문**: "인증"보다는 "로그인 처리 로직"
2. **단계적 접근**: 전체 구조 파악 → 세부 기능 탐색
3. **설명 요청**: 코드를 읽는 것보다 설명을 듣는 게 빠를 수 있음
4. **패턴 학습**: 프로젝트의 일반적인 패턴을 이해하면 다른 부분도 쉽게 파악

다음 챕터에서는 코드를 효과적으로 편집하는 방법을 배웁니다.
  `,

  "10": `
# 코드 편집하기

Claude Code로 코드를 수정하고, 리팩토링하고, 개선하는 방법을 배워봅시다.

## 코드 수정 요청하기

### 명확한 리팩토링 목표 설정

리팩토링을 요청할 때는 **목적과 원하는 결과**를 명시하세요:

\`\`\`
"이 함수를 리팩토링해줘.
목적:
- 가독성 향상
- 중복 코드 제거
- async/await 패턴 적용"
\`\`\`

단순히 "코드 개선해줘"보다 훨씬 좋은 결과를 얻을 수 있습니다.

## 기존 코드에 새 기능 추가

기존 코드와의 **일관성을 유지**하면서 새 기능을 추가하세요:

\`\`\`
"UserProfile 컴포넌트에 이메일 수정 기능을 추가해줘.
기존 스타일과 패턴을 유지하면서,
이름 수정과 동일한 방식으로 구현해줘."
\`\`\`

기존 코드의 스타일, 패턴, 구조를 따르면 유지보수가 쉬워집니다.

## Diff 형식 이해하기

Claude는 변경사항을 **diff 형식**으로 보여줍니다:

\`\`\`diff
  function calculateTotal(items) {
-   let total = 0;
-   for (let i = 0; i < items.length; i++) {
-     total += items[i].price;
-   }
+   const total = items.reduce((sum, item) => sum + item.price, 0);
    return total;
  }
\`\`\`

- `-` (빨간색): 삭제되는 코드
- `+` (초록색): 추가되는 코드
- 변경되지 않는 부분도 컨텍스트로 표시

이를 통해 정확히 무엇이 변경되는지 확인한 후 승인할 수 있습니다.

## 여러 파일에 걸친 수정

관련된 모든 파일과 수정 내용을 함께 설명하세요:

\`\`\`
"사용자 아바타 기능을 추가해줘.

수정할 파일:
1. UserProfile.tsx - 아바타 표시
2. EditProfile.tsx - 아바타 업로드 UI
3. api/upload.ts - 이미지 업로드 API
4. types/user.ts - User 타입에 avatarUrl 추가"
\`\`\`

Claude가 모든 파일을 일관성 있게 수정합니다.

## 코드 수정 피드백

수정안이 마음에 들지 않으면 구체적인 피드백을 주세요:

\`\`\`
"좋은데 몇 가지 수정해줘:
1. 변수명을 더 명확하게 (data → userData)
2. 에러 처리를 try-catch 대신 .catch()로
3. 주석을 한국어로"
\`\`\`

어떤 부분을 어떻게 수정하고 싶은지 명확히 설명하면 더 나은 결과를 얻을 수 있습니다.

## 리팩토링 패턴

### 중복 코드 제거

\`\`\`
"이 세 개의 컴포넌트에 동일한 로직이 반복돼.
공통 유틸리티 함수로 추출해줘."
\`\`\`

### 성능 최적화

\`\`\`
"이 컴포넌트가 불필요하게 리렌더링돼.
React.memo와 useMemo를 사용해서 최적화해줘."
\`\`\`

### 타입 안전성 향상

\`\`\`
"any 타입을 사용하는 부분을 구체적인 타입으로 변경해줘."
\`\`\`

## 점진적 수정

큰 변경은 작은 단계로 나눠서:

\`\`\`
Step 1: "먼저 타입 정의부터 수정해줘"
Step 2: "타입에 맞게 함수 시그니처를 변경해줘"
Step 3: "이제 함수 내부 로직을 수정해줘"
\`\`\`

각 단계를 확인하며 진행하면 문제가 생겨도 쉽게 추적할 수 있습니다.

## 에러 처리 추가

\`\`\`
"이 API 호출 함수에 에러 처리를 추가해줘.
- 네트워크 에러
- 타임아웃
- 400/500 응답 에러
각각 다르게 처리하고, 사용자에게 적절한 메시지 표시"
\`\`\`

## 테스트 코드 작성

\`\`\`
"이 함수에 대한 단위 테스트를 작성해줘.
- 정상 케이스
- 엣지 케이스
- 에러 케이스
모두 포함해서"
\`\`\`

## 주의사항

1. **백업**: 중요한 변경 전에는 Git 커밋 또는 백업
2. **검토**: diff를 꼼꼼히 확인 후 승인
3. **테스트**: 변경 후 기능이 정상 동작하는지 확인
4. **문서화**: 중요한 변경사항은 주석이나 문서에 기록

다음 챕터에서는 Git 기초를 배웁니다.
  `,

  "11": `
# Git 기초

Claude Code와 함께 Git을 사용하는 방법을 배워봅시다.

## Git이란?

**Git**은 코드 변경 이력을 관리하는 버전 관리 시스템입니다.

주요 기능:
- 코드 변경 이력 추적
- 이전 버전으로 되돌리기
- 여러 버전을 동시에 개발 (브랜치)
- 팀원과 협업

## 커밋하기

### 커밋 요청

\`\`\`
"변경사항을 커밋해줘"
"'사용자 프로필 기능 추가' 메시지로 커밋해줘"
\`\`\`

Claude가 git add와 git commit을 실행합니다.

### 좋은 커밋 메시지

좋은 커밋 메시지의 특징:
- **간결하고 명확**: 무엇을 변경했는지 한 눈에 파악
- **이유 설명**: 왜 변경했는지
- **현재형 동사**: "추가함" 대신 "추가"

✅ 좋은 예:
\`\`\`
feat: 사용자 프로필 이미지 업로드 기능 추가
fix: 로그인 시 토큰 만료 처리 버그 수정
refactor: API 호출 로직을 별도 유틸리티로 분리
\`\`\`

❌ 나쁜 예:
\`\`\`
"업데이트"
"수정함"
"커밋"
\`\`\`

### 관련 이슈 번호 포함

\`\`\`
"Closes #123 - 검색 기능 구현"
\`\`\`

## 브랜치 작업

### 브랜치 생성 및 전환

\`\`\`
"feature/user-auth 브랜치를 만들고 전환해줘"
"새로운 기능 개발을 위한 브랜치를 만들어줘"
\`\`\`

Claude가 `git branch`와 `git checkout` (또는 `git switch`)을 실행합니다.

### 브랜치 전략

일반적인 브랜치 이름 패턴:
- `feature/기능명`: 새 기능 개발
- `fix/버그명`: 버그 수정
- `refactor/대상`: 리팩토링
- `docs/내용`: 문서 작업

## 변경사항 확인

\`\`\`
"현재 변경된 파일들을 확인해줘"
"git status를 실행해줘"
\`\`\`

어떤 파일이 수정되었는지, staged되었는지 확인할 수 있습니다.

## 변경 내용 보기

\`\`\`
"지금까지 변경한 내용을 보여줘"
"git diff를 실행해줘"
\`\`\`

## 충돌(Conflict) 해결

브랜치를 merge할 때 충돌이 발생하면:

\`\`\`
"merge 충돌이 발생했어. 어떻게 해결하면 돼?"
\`\`\`

Claude가 충돌 내용을 분석하고:
1. 충돌이 발생한 파일 확인
2. 충돌 부분 설명
3. 해결 옵션 제안

최종 결정은 사용자가 하고, Claude가 실행합니다.

## Git 히스토리 확인

\`\`\`
"최근 커밋 히스토리를 보여줘"
"지난 10개의 커밋을 확인해줘"
"이 파일의 변경 이력을 보여줘"
\`\`\`

`git log` 결과를 보기 쉽게 정리해서 보여줍니다.

## GitHub 연동

### 원격 저장소 설정

\`\`\`
"GitHub 저장소와 연결해줘"
"git remote add origin [URL]"
\`\`\`

### Push

\`\`\`
"원격 저장소에 푸시해줘"
"main 브랜치를 origin에 푸시해줘"
\`\`\`

### Pull

\`\`\`
"원격 저장소에서 최신 코드를 받아와줘"
"git pull 실행해줘"
\`\`\`

## Pull Request 생성

\`\`\`
"이 브랜치로 Pull Request를 만들어줘"
\`\`\`

Claude가 GitHub CLI(`gh`)를 사용하여 PR을 생성합니다.

## 실용 팁

1. **자주 커밋**: 작은 단위로 자주 커밋하는 게 좋음
2. **의미 있는 메시지**: 나중에 이력을 볼 때 이해하기 쉽게
3. **브랜치 활용**: 새 기능은 별도 브랜치에서 개발
4. **충돌 최소화**: 자주 pull해서 최신 상태 유지

다음 Part에서는 실전 프로젝트를 시작합니다!
  `,

  "12": `
# 프로젝트 메모리

프로젝트 정보를 체계적으로 관리하여 Claude가 더 효과적으로 도움을 주도록 설정하는 방법을 배워봅시다.

## 프로젝트 메모리란?

**프로젝트 메모리**는 프로젝트 관련 정보를 저장하여 Claude가 항상 참조할 수 있도록 하는 시스템입니다.

주요 파일:
- **CLAUDE.md**: 프로젝트 개요, 규칙, 명령어
- **.cursorrules**: AI 동작 규칙과 스타일 가이드

## CLAUDE.md 파일 작성하기

프로젝트 루트에 CLAUDE.md 파일을 생성하세요.

### 포함하면 좋은 정보

\`\`\`markdown
# [프로젝트 이름]

## 프로젝트 개요
[프로젝트가 무엇을 하는지, 목적은 무엇인지]

## 기술 스택
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Hosting: Vercel

## 폴더 구조
\\\`\\\`\\\`
src/
├── app/          # Next.js App Router 페이지
├── components/   # 재사용 컴포넌트
├── lib/          # 유틸리티 함수
└── types/        # TypeScript 타입 정의
\\\`\\\`\\\`

## 코딩 컨벤션
- 함수형 컴포넌트 사용
- async/await로 비동기 처리
- 한국어 주석
- Tailwind CSS로 스타일링
- 파일명은 kebab-case (user-profile.tsx)

## 주요 명령어
- 개발 서버: \\\`npm run dev\\\`
- 빌드: \\\`npm run build\\\`
- 타입 체크: \\\`npm run type-check\\\`
- 린트: \\\`npm run lint\\\`

## 환경 변수
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- DATABASE_URL

## 중요 참고사항
- 모든 API 호출은 lib/api.ts를 통해 진행
- 에러는 ErrorBoundary로 처리
- 이미지는 Next.js Image 컴포넌트 사용
\`\`\`

### 포함하면 안 되는 정보

❌ **절대 포함하지 말 것**:
- 비밀번호
- API 키
- 개인 식별 정보
- 민감한 비즈니스 로직

이러한 정보는 환경 변수(.env)로 관리하고 .gitignore에 추가하세요.

## .cursorrules 파일 작성하기

프로젝트 루트에 .cursorrules 파일을 생성하세요.

### 예시

\`\`\`
You are an expert in TypeScript, Next.js 14, and React.

Code Style:
- Always use functional components
- Prefer arrow functions
- Use async/await for asynchronous operations
- Write comments in Korean

Project Rules:
- Use Tailwind CSS for styling
- All components in src/components
- Use "use client" only when necessary
- Implement proper error handling with try-catch

Conventions:
- File names: kebab-case
- Component names: PascalCase
- Function names: camelCase
- Constants: UPPER_SNAKE_CASE
\`\`\`

## 프로젝트 메모리 구조화

### 카테고리별로 정리

\`\`\`markdown
## 아키텍처
[시스템 구조 설명]

## 데이터 모델
[주요 데이터 타입과 관계]

## API 엔드포인트
[사용 가능한 API 목록]

## 컴포넌트 가이드
[주요 컴포넌트 사용법]
\`\`\`

명확하게 카테고리를 나누면 Claude가 필요한 정보를 빠르게 찾을 수 있습니다.

## 팀 프로젝트에서의 장점

프로젝트 메모리 파일을 Git에 포함하면:

1. **일관성**: 팀원 모두가 동일한 규칙으로 AI 지원 받음
2. **온보딩**: 신규 팀원이 프로젝트를 빠르게 이해
3. **표준화**: 코드 스타일과 패턴이 자동으로 유지됨
4. **문서화**: 프로젝트 문서 역할도 겸함

## 프로젝트 메모리 업데이트

### 업데이트가 필요한 시점

- 기술 스택이 변경될 때
- 새로운 코딩 규칙이 도입될 때
- 프로젝트 구조가 변경될 때
- 중요한 아키텍처 결정이 있을 때

\`\`\`
"CLAUDE.md 파일을 업데이트해줘.
최근 추가한 인증 시스템 정보를 추가하고,
기술 스택에 Zustand를 넣어줘."
\`\`\`

## 실용 팁

1. **간결하게**: 너무 길면 오히려 비효율적
2. **최신 상태 유지**: 프로젝트 변경 시 함께 업데이트
3. **팀과 공유**: 팀원들과 협의하여 작성
4. **예시 포함**: 추상적인 규칙보다는 구체적인 예시

다음 챕터에서는 웹사이트 개발을 시작합니다.
  `,

  "13": `
# 웹사이트 개발

Claude Code와 함께 실제 웹사이트를 만들어봅시다.

## 웹사이트 개발 시작하기

### 1. 목적과 기능 정의

웹사이트를 만들기 전에 먼저 Claude에게 목적과 주요 기능을 설명하세요:

\`\`\`
"개인 포트폴리오 웹사이트를 만들려고 해.

주요 기능:
- 프로젝트 소개 페이지
- About Me 섹션
- 연락처 폼
- 블로그 (Markdown 기반)

타겟: 채용 담당자와 클라이언트
스타일: 미니멀하고 전문적인 느낌"
\`\`\`

Claude가 적절한 구조와 기술을 제안합니다.

## 프로젝트 생성

### Next.js 프로젝트

\`\`\`
"Next.js 14 프로젝트를 생성해줘.
TypeScript와 Tailwind CSS를 사용하고,
App Router로 설정해줘."
\`\`\`

Claude가 `create-next-app` 명령어를 실행하고 초기 설정을 도와줍니다.

### 프로젝트 설정

\`\`\`
"ESLint와 Prettier를 설정해줘"
"환경 변수 파일(.env.local)을 생성해줘"
\`\`\`

## 컴포넌트 기반 개발

### 재사용 가능한 컴포넌트 만들기

\`\`\`
"재사용 가능한 Button 컴포넌트를 만들어줘.
- variant (primary, secondary, outline)
- size (sm, md, lg)
- disabled 상태 지원
- Tailwind CSS로 스타일링"
\`\`\`

컴포넌트를 작게 나누면:
- **재사용성 향상**: 여러 곳에서 사용 가능
- **유지보수 용이**: 한 곳만 수정하면 전체 반영
- **테스트 용이**: 독립적으로 테스트 가능

### 컴포넌트 구성

\`\`\`
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
└── features/
    ├── ProjectCard.tsx
    └── ContactForm.tsx
\`\`\`

## 페이지 구조 만들기

\`\`\`
"다음 페이지들을 만들어줘:
1. 홈페이지 (/)
2. 프로젝트 목록 (/projects)
3. 프로젝트 상세 (/projects/[id])
4. About 페이지 (/about)
5. 연락처 (/contact)"
\`\`\`

## 반응형 디자인

\`\`\`
"이 섹션을 반응형으로 만들어줘.
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 3열"
\`\`\`

Tailwind CSS의 반응형 클래스를 사용:

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 컨텐츠 */}
</div>
\`\`\`

## Tailwind CSS 활용

### 장점

- **유틸리티 클래스**: 별도 CSS 파일 불필요
- **빠른 개발**: 클래스 이름만으로 스타일링
- **일관성**: 정해진 디자인 시스템 사용
- **반응형**: 간단한 prefix로 반응형 구현

### 예시

\`\`\`tsx
<button className="
  bg-blue-500 hover:bg-blue-600
  text-white font-bold
  py-2 px-4 rounded
  transition duration-200
">
  클릭
</button>
\`\`\`

## 이미지 최적화

Next.js Image 컴포넌트 사용:

\`\`\`
"이미지 갤러리를 만들어줘.
Next.js Image 컴포넌트를 사용하고,
lazy loading을 적용해줘."
\`\`\`

\`\`\`tsx
import Image from 'next/image';

<Image
  src="/project.jpg"
  alt="프로젝트 이미지"
  width={800}
  height={600}
  priority={false}
/>
\`\`\`

## 폼 만들기

\`\`\`
"연락처 폼을 만들어줘.
- 이름, 이메일, 메시지 입력
- 유효성 검증
- 제출 시 로딩 상태 표시
- 성공/실패 메시지"
\`\`\`

## 애니메이션 추가

\`\`\`
"페이지 전환 시 fade-in 애니메이션을 추가해줘"
"스크롤 시 요소가 나타나는 효과를 넣어줘"
\`\`\`

## 개발 서버 실행

\`\`\`
"개발 서버를 실행해줘"
\`\`\`

http://localhost:3000 에서 실시간으로 변경사항 확인

## 실용 팁

1. **모바일 우선**: 모바일 디자인부터 시작
2. **접근성**: 시맨틱 HTML, alt 텍스트 사용
3. **성능**: 이미지 최적화, lazy loading
4. **SEO**: 메타 태그, sitemap 추가

다음 챕터에서는 웹사이트를 배포하는 방법을 배웁니다.
  `,

  "14": `
# 배포하기

완성한 웹사이트를 실제로 인터넷에 배포하는 방법을 배워봅시다.

## 배포 준비하기

### 빌드 에러 확인

배포 전에 먼저 로컬에서 빌드가 성공하는지 확인하세요:

\`\`\`
"프로젝트를 빌드해줘"
\`\`\`

`npm run build` 명령어가 실행되고, 에러가 있다면 Claude가 분석하고 해결책을 제안합니다.

### 환경 변수 설정

\`\`\`
"배포에 필요한 환경 변수 목록을 정리해줘"
\`\`\`

환경 변수는 다음과 같이 분리:
- 개발: `.env.local`
- 프로덕션: 배포 플랫폼의 환경 변수 설정

❌ **절대 코드에 직접 작성하지 말 것**:
- API 키
- 데이터베이스 URL
- 비밀 토큰

✅ **올바른 방법**:
\`\`\`typescript
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const dbUrl = process.env.DATABASE_URL;
\`\`\`

## Vercel에 배포하기

### Vercel이란?

Next.js를 만든 회사의 호스팅 플랫폼으로, Next.js 프로젝트 배포에 최적화되어 있습니다.

### 배포 방법

#### 1. Git 저장소 연동

\`\`\`
"GitHub 저장소를 만들고 코드를 푸시해줘"
\`\`\`

#### 2. Vercel 연동

1. Vercel 웹사이트 접속 (vercel.com)
2. "Import Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정
5. Deploy 클릭

### 자동 배포

Git에 코드를 푸시하면:
1. **자동 빌드**: Vercel이 자동으로 빌드
2. **미리보기**: PR마다 미리보기 URL 생성
3. **프로덕션 배포**: main 브랜치 머지 시 자동 배포

\`\`\`
main 브랜치에 푸시 → 자동으로 프로덕션 배포
feature 브랜치 PR → 미리보기 URL 생성
\`\`\`

## 배포 후 확인사항

### 1. 프로덕션 테스트

\`\`\`
✅ 모든 페이지 접속 확인
✅ 폼 제출 테스트
✅ 이미지 로딩 확인
✅ API 호출 정상 작동
✅ 모바일에서 테스트
\`\`\`

### 2. 성능 확인

\`\`\`
"Lighthouse 점수를 확인해줘"
\`\`\`

성능, 접근성, SEO 점수를 개선할 부분이 있는지 확인합니다.

## 종속성 확인

\`\`\`
"package.json의 dependencies를 확인해줘.
사용하지 않는 패키지가 있으면 알려줘."
\`\`\`

불필요한 의존성을 제거하면 빌드 크기가 줄어듭니다.

## 배포 후 문제 해결

### 에러 로그 확인

Vercel 대시보드에서 에러 로그를 확인하고:

\`\`\`
"이 에러 로그를 분석해줘:
[에러 내용 붙여넣기]"
\`\`\`

Claude가 에러 원인과 해결책을 제안합니다.

### 롤백

문제가 생기면 이전 버전으로 롤백:
- Vercel 대시보드에서 이전 배포 선택
- "Promote to Production" 클릭

## CI/CD란?

**CI** (Continuous Integration): 코드를 자주 통합하고 자동 테스트
**CD** (Continuous Deployment): 자동으로 배포

Vercel은 기본적으로 CI/CD를 제공:
\`\`\`
코드 푸시 → 자동 빌드 → 테스트 → 배포
\`\`\`

## 커스텀 도메인 연결

\`\`\`
1. 도메인 구매 (예: mysite.com)
2. Vercel 프로젝트 설정에서 도메인 추가
3. DNS 설정 (Vercel이 가이드 제공)
4. SSL 인증서 자동 발급
\`\`\`

## 실용 팁

1. **작은 단위로 배포**: 큰 변경보다 작은 변경을 자주
2. **미리보기 활용**: PR마다 미리보기로 확인
3. **모니터링**: 배포 후 에러 모니터링 설정
4. **백업**: 중요한 데이터는 별도 백업

다음 챕터에서는 데이터를 저장하는 방법을 배웁니다.
  `,

  "15": `
# 데이터 저장

웹 애플리케이션에서 데이터를 저장하고 관리하는 방법을 배워봅시다.

## 데이터 저장 방법 비교

### localStorage

- **위치**: 사용자 브라우저
- **용도**: 간단한 설정, 임시 데이터
- **특징**: 5MB 제한, 같은 브라우저에서만 접근

\`\`\`typescript
// 저장
localStorage.setItem('theme', 'dark');

// 읽기
const theme = localStorage.getItem('theme');
\`\`\`

### 데이터베이스

- **위치**: 서버
- **용도**: 영구 저장, 여러 사용자 데이터
- **특징**: 용량 제한 없음, 어디서나 접근 가능

## Supabase 시작하기

**Supabase**는 Firebase의 오픈소스 대안으로:
- PostgreSQL 데이터베이스
- 인증 (Authentication)
- 실시간 구독 (Realtime)
- 파일 저장소 (Storage)
- API 자동 생성

모두 제공하는 백엔드 서비스입니다.

### Supabase 프로젝트 생성

1. supabase.com 접속
2. 새 프로젝트 생성
3. 데이터베이스 비밀번호 설정
4. API 키 확인 (Settings > API)

## 데이터베이스 스키마 설계

\`\`\`
"블로그 포스트를 저장할 데이터베이스 스키마를 설계해줘.

필요한 필드:
- 제목
- 내용
- 작성자
- 작성일
- 카테고리
- 공개 여부"
\`\`\`

Claude가 적절한 테이블 구조를 제안:

\`\`\`sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  category TEXT,
  is_published BOOLEAN DEFAULT false
);
\`\`\`

## Row Level Security (RLS)

**RLS**는 사용자별로 데이터 접근 권한을 제어합니다.

예시:
- 자신이 작성한 포스트만 수정 가능
- 공개된 포스트만 조회 가능
- 관리자는 모든 데이터 접근 가능

\`\`\`
"posts 테이블에 RLS를 설정해줘.
- 누구나 공개 포스트 읽기 가능
- 작성자만 자신의 포스트 수정 가능"
\`\`\`

## CRUD 작업

**CRUD**는 데이터의 기본 작업:
- **C**reate: 생성
- **R**ead: 읽기
- **U**pdate: 수정
- **D**elete: 삭제

### Create (생성)

\`\`\`
"Supabase에 새 포스트를 생성하는 함수를 만들어줘"
\`\`\`

\`\`\`typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: '첫 포스트',
    content: '안녕하세요',
    author_id: userId
  });
\`\`\`

### Read (읽기)

\`\`\`
"모든 공개 포스트를 가져오는 함수를 만들어줘"
\`\`\`

\`\`\`typescript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });
\`\`\`

### Update (수정)

\`\`\`
"포스트를 수정하는 함수를 만들어줘"
\`\`\`

\`\`\`typescript
const { data, error } = await supabase
  .from('posts')
  .update({ title: '수정된 제목' })
  .eq('id', postId);
\`\`\`

### Delete (삭제)

\`\`\`
"포스트를 삭제하는 함수를 만들어줘"
\`\`\`

\`\`\`typescript
const { data, error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
\`\`\`

## 실시간 구독

\`\`\`
"새 포스트가 추가되면 자동으로 목록을 업데이트하도록 해줘"
\`\`\`

\`\`\`typescript
supabase
  .channel('posts')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'posts'
  }, (payload) => {
    console.log('새 포스트:', payload.new);
  })
  .subscribe();
\`\`\`

## 데이터베이스 vs localStorage

| 항목 | localStorage | 데이터베이스 |
|------|--------------|--------------|
| 위치 | 브라우저 | 서버 |
| 용량 | ~5MB | 무제한 |
| 공유 | 같은 브라우저만 | 모든 기기 |
| 속도 | 매우 빠름 | 네트워크 필요 |
| 보안 | 낮음 | 높음 (RLS) |
| 용도 | 설정, 캐시 | 영구 데이터 |

## 실용 팁

1. **에러 처리**: 모든 DB 작업에 try-catch 추가
2. **타입 안전성**: TypeScript 타입 정의
3. **인덱스**: 자주 검색하는 컬럼에 인덱스 추가
4. **백업**: 중요한 데이터는 정기적으로 백업

다음 챕터에서는 미니 게임을 만들어봅니다.
  `,

  "16": `
# 미니 게임

웹 브라우저에서 동작하는 간단한 게임을 만들어봅시다.

## 웹 게임 기술

### 주요 기술

- **HTML Canvas**: 그래픽 렌더링
- **JavaScript**: 게임 로직
- **CSS 애니메이션**: UI 효과
- **React**: 상태 관리 (선택사항)

**Assembly**는 저수준 언어로 웹 게임에는 일반적으로 사용되지 않습니다. 웹 게임은 주로 HTML Canvas, JavaScript, CSS로 개발합니다.

## 게임 루프 (Game Loop)

게임의 핵심은 **게임 루프**입니다.

\`\`\`
반복:
  1. 입력 처리 (키보드, 마우스)
  2. 게임 상태 업데이트 (위치, 점수 등)
  3. 화면 렌더링
\`\`\`

\`\`\`typescript
function gameLoop() {
  updateGameState();
  renderGame();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
\`\`\`

### requestAnimationFrame의 장점

- 브라우저 최적화된 타이밍 (보통 60 FPS)
- 탭이 백그라운드일 때 자동 일시정지
- 부드러운 애니메이션

## 간단한 게임 만들기

\`\`\`
"간단한 뱀 게임을 만들어줘.

기능:
- 방향키로 뱀 조종
- 먹이를 먹으면 점수 증가
- 벽이나 자기 몸에 부딪히면 게임 오버
- 점수 표시"
\`\`\`

## 키보드 입력 처리

keydown과 keyup 이벤트로 키보드 입력을 감지:

\`\`\`typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        setDirection('up');
        break;
      case 'ArrowDown':
        setDirection('down');
        break;
      case 'ArrowLeft':
        setDirection('left');
        break;
      case 'ArrowRight':
        setDirection('right');
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
\`\`\`

## 충돌 감지 (Collision Detection)

두 객체가 겹치는지 확인하는 기본 방법:

\`\`\`typescript
function isColliding(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}
\`\`\`

두 객체의 **위치(x, y)와 크기(width, height)**를 비교하여 겹치는지 확인합니다.

## Canvas 기초

\`\`\`typescript
const canvas = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const ctx = canvas.current?.getContext('2d');
  if (!ctx) return;

  // 배경 그리기
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.current!.width, canvas.current!.height);

  // 사각형 그리기
  ctx.fillStyle = '#0f0';
  ctx.fillRect(x, y, 20, 20);

  // 원 그리기
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
}, [x, y]);
\`\`\`

## React로 게임 상태 관리

\`\`\`
"React 상태로 게임을 관리해줘.
- 플레이어 위치
- 적 위치 배열
- 점수
- 게임 오버 상태"
\`\`\`

\`\`\`typescript
const [player, setPlayer] = useState({ x: 100, y: 100 });
const [enemies, setEnemies] = useState([]);
const [score, setScore] = useState(0);
const [gameOver, setGameOver] = useState(false);
\`\`\`

## 간단한 물리 엔진

\`\`\`typescript
// 중력 적용
const gravity = 0.5;
let velocityY = 0;

function update() {
  velocityY += gravity;
  player.y += velocityY;

  // 땅에 닿으면
  if (player.y >= groundLevel) {
    player.y = groundLevel;
    velocityY = 0;
  }
}
\`\`\`

## 애니메이션과 효과

\`\`\`
"플레이어가 적과 충돌하면 깜빡이는 효과를 추가해줘"
"점수가 올라갈 때 숫자가 튀어오르는 애니메이션을 넣어줘"
\`\`\`

CSS 애니메이션:

\`\`\`css
.bounce {
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
\`\`\`

## 게임 예시

### 간단한 게임들

1. **타이핑 게임**: 떨어지는 단어를 빠르게 타이핑
2. **클리커 게임**: 클릭할 때마다 점수 증가
3. **퍼즐 게임**: 블록 맞추기
4. **피하기 게임**: 떨어지는 장애물 피하기

\`\`\`
"클리커 게임을 만들어줘.
- 버튼 클릭 시 카운트 증가
- 초당 자동 증가 업그레이드 구매 가능
- 애니메이션 효과"
\`\`\`

## 실용 팁

1. **작게 시작**: 복잡한 게임보다 간단한 게임부터
2. **상태 관리**: React의 useState로 게임 상태 관리
3. **성능 최적화**: 불필요한 리렌더링 방지
4. **재미 요소**: 사운드, 애니메이션, 피드백 추가

다음 Part에서는 CLI 도구, 챗봇 등 더 복잡한 프로젝트를 만들어봅니다!
  `,

  "17": `
# CLI 도구 만들기

터미널에서 실행되는 커맨드라인 도구를 만들어봅시다.

## CLI란?

**CLI (Command Line Interface)**는 텍스트 기반으로 동작하는 프로그램입니다.

### GUI vs CLI

| GUI | CLI |
|-----|-----|
| 그래픽 인터페이스 | 텍스트 기반 |
| 마우스 클릭 | 명령어 입력 |
| 시각적 | 효율적 |
| 쉬운 시작 | 자동화 용이 |

### CLI의 장점

- **자동화 용이**: 스크립트로 반복 작업 자동화
- **빠른 실행**: 명령어 한 줄로 실행
- **원격 작업**: SSH로 원격 서버에서 실행
- **스크립팅**: 여러 명령을 조합하여 복잡한 작업

## Node.js CLI 시작하기

\`\`\`
"Node.js CLI 도구 프로젝트를 만들어줘.
간단한 할일 관리 CLI를 만들 거야."
\`\`\`

### package.json 설정

\`\`\`json
{
  "name": "todo-cli",
  "version": "1.0.0",
  "bin": {
    "todo": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
\`\`\`

**bin 필드**는 CLI 명령어와 실행 파일을 연결합니다. `todo`라는 명령어로 `index.js` 파일이 실행됩니다.

## 명령줄 인자 받기

**process.argv**로 명령줄 인자를 받습니다:

\`\`\`typescript
// node index.js add "할일 내용"
// process.argv = ['node', 'index.js', 'add', '할일 내용']

const command = process.argv[2];
const arg = process.argv[3];

switch(command) {
  case 'add':
    addTodo(arg);
    break;
  case 'list':
    listTodos();
    break;
  case 'done':
    completeTodo(arg);
    break;
}
\`\`\`

## 인자 파싱 라이브러리

복잡한 옵션은 라이브러리 사용:

\`\`\`
"commander 라이브러리로 CLI 인자를 파싱해줘"
\`\`\`

\`\`\`typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('todo')
  .description('할일 관리 CLI')
  .version('1.0.0');

program
  .command('add <task>')
  .description('새 할일 추가')
  .action((task) => {
    console.log(\`추가: \${task}\`);
  });

program
  .command('list')
  .option('-a, --all', '완료된 항목도 표시')
  .action((options) => {
    listTodos(options.all);
  });

program.parse();
\`\`\`

## 색상 있는 출력

**chalk** 라이브러리로 색상 추가:

\`\`\`
"chalk으로 성공은 초록색, 에러는 빨간색으로 표시해줘"
\`\`\`

\`\`\`typescript
import chalk from 'chalk';

console.log(chalk.green('✓ 할일이 추가되었습니다!'));
console.log(chalk.red('✗ 에러가 발생했습니다.'));
console.log(chalk.blue('ℹ 3개의 할일이 있습니다.'));
\`\`\`

## 사용자 입력 받기

\`\`\`
"사용자에게 확인 질문을 하는 기능을 추가해줘"
\`\`\`

\`\`\`typescript
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'delete',
    message: '정말 삭제하시겠습니까?',
    default: false
  }
]);

if (answers.delete) {
  deleteTodo();
}
\`\`\`

## 전역 설치

### npm link로 로컬 테스트

\`\`\`
"npm link로 이 CLI를 전역에서 사용할 수 있게 해줘"
\`\`\`

\`\`\`bash
npm link
\`\`\`

이제 어디서든 `todo` 명령어 사용 가능!

### npm publish

\`\`\`
"이 패키지를 npm에 배포하는 방법을 알려줘"
\`\`\`

\`\`\`bash
npm login
npm publish
\`\`\`

다른 사람들이 `npm install -g todo-cli`로 설치할 수 있습니다.

## 데이터 저장

\`\`\`
"할일 목록을 JSON 파일로 저장하고 불러오는 기능을 만들어줘"
\`\`\`

\`\`\`typescript
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const dataPath = path.join(os.homedir(), '.todo-cli', 'data.json');

async function saveTodos(todos) {
  await fs.writeFile(dataPath, JSON.stringify(todos, null, 2));
}

async function loadTodos() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
\`\`\`

## 실용적인 CLI 예시

### 1. 파일 변환 도구
\`\`\`bash
convert image.png --to jpg --quality 80
\`\`\`

### 2. 프로젝트 템플릿 생성기
\`\`\`bash
create-app my-project --template react-ts
\`\`\`

### 3. 배포 도구
\`\`\`bash
deploy --env production --region us-east-1
\`\`\`

## 에러 처리

\`\`\`typescript
try {
  await performAction();
  console.log(chalk.green('✓ 성공!'));
} catch (error) {
  console.error(chalk.red('✗ 에러:'), error.message);
  process.exit(1);
}
\`\`\`

## 도움말 자동 생성

Commander가 자동으로 도움말 생성:

\`\`\`bash
todo --help
\`\`\`

\`\`\`
Usage: todo [options] [command]

할일 관리 CLI

Options:
  -V, --version   버전 표시
  -h, --help      도움말 표시

Commands:
  add <task>      새 할일 추가
  list [options]  할일 목록 표시
  done <id>       할일 완료 표시
\`\`\`

다음 챕터에서는 AI 챗봇을 만들어봅니다.
  `,

  "18": `
# 챗봇 만들기

AI API를 사용하여 대화형 챗봇을 만들어봅시다.

## AI 챗봇이란?

AI 모델을 활용하여 사용자와 자연스럽게 대화하는 프로그램입니다.

## AI API 선택

### 주요 AI API

- **Claude API** (Anthropic)
- **OpenAI API** (ChatGPT)
- **Gemini API** (Google)

Claude API나 OpenAI API 같은 AI 서비스를 활용하면 별도의 AI 모델 학습 없이 챗봇을 만들 수 있습니다.

## API 키 관리

\`\`\`
"API 키를 환경 변수로 안전하게 관리하는 방법을 알려줘"
\`\`\`

### .env 파일

\`\`\`
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
\`\`\`

### .gitignore에 추가

\`\`\`
.env
.env.local
\`\`\`

❌ **절대 하지 말 것**:
- 코드에 API 키 직접 작성
- 공개 저장소에 .env 업로드
- README에 API 키 기록

✅ **올바른 방법**:
\`\`\`typescript
const apiKey = process.env.ANTHROPIC_API_KEY;
\`\`\`

## 기본 챗봇 만들기

\`\`\`
"Claude API를 사용해서 간단한 챗봇을 만들어줘.
사용자 메시지를 받아서 응답하는 함수를 만들어줘."
\`\`\`

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chat(userMessage: string) {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: userMessage
    }]
  });

  return response.content[0].text;
}
\`\`\`

## 스트리밍 응답

**스트리밍**을 사용하면 응답을 실시간으로 받아 표시할 수 있습니다.

\`\`\`
"스트리밍으로 응답을 실시간으로 표시하는 챗봇을 만들어줘"
\`\`\`

\`\`\`typescript
const stream = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  stream: true,
  messages: [{
    role: 'user',
    content: userMessage
  }]
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
\`\`\`

사용자 경험이 크게 향상됩니다 - 전체 응답을 기다리지 않고 실시간으로 텍스트가 나타납니다.

## 대화 기록 유지

이전 대화 내용을 함께 전송하면 AI가 맥락을 이해하고 일관된 대화를 이어갈 수 있습니다.

\`\`\`
"이전 대화 내용을 기억하는 챗봇을 만들어줘"
\`\`\`

\`\`\`typescript
const conversationHistory: Array<{role: string, content: string}> = [];

async function chat(userMessage: string) {
  // 사용자 메시지 추가
  conversationHistory.push({
    role: 'user',
    content: userMessage
  });

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: conversationHistory
  });

  const assistantMessage = response.content[0].text;

  // AI 응답 추가
  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage
  });

  return assistantMessage;
}
\`\`\`

## 시스템 프롬프트

**시스템 프롬프트**로 AI의 역할과 행동 방식을 정의합니다.

\`\`\`
"친절한 고객 서비스 챗봇 역할을 하도록 시스템 프롬프트를 설정해줘"
\`\`\`

\`\`\`typescript
const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: `당신은 친절한 고객 서비스 챗봇입니다.
- 항상 존댓말을 사용하세요
- 공감하며 응답하세요
- 해결책을 제시하세요
- 긍정적인 태도를 유지하세요`,
  messages: conversationHistory
});
\`\`\`

시스템 프롬프트로:
- AI의 페르소나 설정
- 응답 스타일 정의
- 제약 사항 명시
- 특수 기능 활성화

## 웹 챗봇 만들기

\`\`\`
"Next.js로 웹 챗봇 UI를 만들어줘.
- 메시지 입력창
- 대화 히스토리 표시
- 스트리밍 응답
- 로딩 상태"
\`\`\`

### API 라우트

\`\`\`typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message, history } = await req.json();

  const stream = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    stream: true,
    messages: [...history, { role: 'user', content: message }]
  });

  return new Response(/* 스트림 응답 */);
}
\`\`\`

## Discord/Slack 봇

\`\`\`
"Discord 봇으로 만들어줘.
메시지를 받아서 AI 응답을 보내는 기능"
\`\`\`

Discord나 Slack API와 봇 계정을 설정하고, 메시지 수신 및 응답 로직을 구현할 수 있습니다.

## 고급 기능

### 1. 함수 호출 (Function Calling)
\`\`\`
"날씨를 물어보면 실제 날씨 API를 호출하도록 만들어줘"
\`\`\`

### 2. 파일 분석
\`\`\`
"업로드한 이미지를 분석하는 기능을 추가해줘"
\`\`\`

### 3. 음성 대화
\`\`\`
"음성을 텍스트로 변환하고, 응답을 음성으로 출력해줘"
\`\`\`

## 비용 관리

- API 호출마다 비용 발생
- 토큰 수로 비용 계산
- max_tokens로 최대 응답 길이 제한
- 사용량 모니터링

다음 챕터에서는 백엔드 API를 만들어봅니다.
  `,

  "19": `
# 백엔드 기초

서버 사이드 개발과 API 구축의 기초를 배워봅시다.

## 백엔드란?

**백엔드**는 사용자에게 보이지 않는 서버 측 로직입니다.

### 프론트엔드 vs 백엔드

| 프론트엔드 | 백엔드 |
|-----------|--------|
| 사용자 인터페이스 | 비즈니스 로직 |
| 브라우저에서 실행 | 서버에서 실행 |
| HTML, CSS, JS | 다양한 언어 |
| 보이는 부분 | 숨겨진 부분 |

## REST API 기초

**REST API**는 HTTP 메서드를 사용하는 API 설계 방식입니다.

### HTTP 메서드

| 메서드 | 용도 | 예시 |
|--------|------|------|
| GET | 데이터 조회 | 사용자 목록 가져오기 |
| POST | 데이터 생성 | 새 사용자 등록 |
| PUT/PATCH | 데이터 수정 | 사용자 정보 업데이트 |
| DELETE | 데이터 삭제 | 사용자 삭제 |

### 예시

\`\`\`
GET    /api/users      - 모든 사용자 조회
GET    /api/users/123  - ID 123 사용자 조회
POST   /api/users      - 새 사용자 생성
PUT    /api/users/123  - ID 123 사용자 수정
DELETE /api/users/123  - ID 123 사용자 삭제
\`\`\`

## Next.js API Routes

Next.js는 별도의 백엔드 서버 없이 **API Routes**로 API를 만들 수 있습니다.

\`\`\`
"Next.js API Route로 사용자 목록을 반환하는 API를 만들어줘"
\`\`\`

### GET 요청

\`\`\`typescript
// app/api/users/route.ts
export async function GET() {
  const users = await db.getUsers();

  return Response.json({ users });
}
\`\`\`

### POST 요청

\`\`\`typescript
// app/api/users/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = body;

  // 유효성 검증
  if (!name || !email) {
    return Response.json(
      { error: '이름과 이메일은 필수입니다' },
      { status: 400 }
    );
  }

  const user = await db.createUser({ name, email });

  return Response.json({ user }, { status: 201 });
}
\`\`\`

## 에러 처리

\`\`\`
"API 에러를 적절하게 처리하는 코드를 작성해줘"
\`\`\`

\`\`\`typescript
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json({ data });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: '데이터를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
\`\`\`

### HTTP 상태 코드

- **200**: 성공
- **201**: 생성 성공
- **400**: 잘못된 요청
- **401**: 인증 필요
- **403**: 권한 없음
- **404**: 찾을 수 없음
- **500**: 서버 오류

## CORS란?

**CORS** (Cross-Origin Resource Sharing)는 보안을 위해 다른 도메인에서의 요청을 기본적으로 차단합니다.

### 문제 상황

\`\`\`
https://mysite.com → https://api.example.com
❌ CORS 에러 발생
\`\`\`

### 해결 방법

서버에서 허용 설정:

\`\`\`typescript
export async function GET(request: Request) {
  const response = Response.json({ data: 'hello' });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST');

  return response;
}
\`\`\`

Next.js에서는 `next.config.js`로 설정 가능:

\`\`\`javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
\`\`\`

## 인증과 인가

### 인증 (Authentication) vs 인가 (Authorization)

- **인증**: "누구인가?" - 신원 확인
- **인가**: "무엇을 할 수 있는가?" - 권한 확인

### 예시

\`\`\`
로그인 (인증) → 사용자 확인
게시글 삭제 시도 (인가) → 권한 확인 (본인의 글인가?)
\`\`\`

## JWT (JSON Web Token)

**JWT**는 사용자 인증 정보를 담은 토큰으로, 서버와 클라이언트 간 안전하게 정보를 주고받습니다.

\`\`\`
"JWT로 로그인 API를 만들어줘"
\`\`\`

\`\`\`typescript
import jwt from 'jsonwebtoken';

// 로그인 - 토큰 발급
export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await verifyCredentials(email, password);

  if (!user) {
    return Response.json({ error: '인증 실패' }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return Response.json({ token });
}

// 인증 필요한 API
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return Response.json({ error: '토큰 없음' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded.userId로 사용자 확인
  } catch {
    return Response.json({ error: '유효하지 않은 토큰' }, { status: 401 });
  }
}
\`\`\`

## API 문서화

\`\`\`
"API 엔드포인트를 문서화해줘"
\`\`\`

\`\`\`markdown
## GET /api/users

사용자 목록 조회

**Query Parameters:**
- page: 페이지 번호 (기본값: 1)
- limit: 페이지당 항목 수 (기본값: 10)

**Response:**
\\\`\\\`\\\`json
{
  "users": [
    { "id": 1, "name": "홍길동", "email": "hong@example.com" }
  ],
  "total": 100
}
\\\`\\\`\\\`
\`\`\`

다음 챕터에서는 풀스택 앱을 완성해봅니다.
  `,

  "20": `
# 풀스택 앱 완성하기

프론트엔드, 백엔드, 데이터베이스를 모두 아우르는 완전한 풀스택 애플리케이션을 만들어봅시다.

## 풀스택 개발자란?

**풀스택 개발자**는 프론트엔드부터 백엔드, 데이터베이스, 배포까지 전체 스택을 다루는 개발자입니다.

### 다루는 영역

- ✅ **프론트엔드**: React, UI/UX
- ✅ **백엔드**: API, 비즈니스 로직
- ✅ **데이터베이스**: 데이터 모델링, 쿼리
- ✅ **배포**: 호스팅, CI/CD
- ❌ **하드웨어 제조**: 포함되지 않음

## 프로젝트 예시: 블로그 플랫폼

\`\`\`
"풀스택 블로그 플랫폼을 만들어줘.

기능:
- 사용자 인증 (로그인/회원가입)
- 포스트 작성/수정/삭제
- 댓글 기능
- 좋아요 기능
- 마크다운 에디터

기술 스택:
- Next.js 14
- Supabase (DB + Auth)
- Tailwind CSS"
\`\`\`

## 프로젝트 완성 체크리스트

### 1. 기능 테스트

\`\`\`
✅ 모든 주요 기능이 정상 작동하는가?
✅ 엣지 케이스가 처리되는가?
✅ 에러 시나리오를 테스트했는가?
✅ 다양한 브라우저에서 동작하는가?
\`\`\`

### 2. 보안 점검

\`\`\`
✅ API 키가 코드에 노출되지 않았는가?
✅ 사용자 입력 검증이 되는가?
✅ SQL Injection 방어가 되는가?
✅ XSS 공격 방어가 되는가?
✅ 민감한 데이터가 암호화되는가?
\`\`\`

### 3. 성능 최적화

\`\`\`
"앱 성능을 개선해줘.
- 이미지 최적화
- 코드 스플리팅
- 캐싱 전략
- 불필요한 리렌더링 방지"
\`\`\`

### 4. 에러 처리

\`\`\`
✅ 네트워크 에러 처리
✅ 폼 유효성 검증
✅ 사용자 친화적 에러 메시지
✅ 로그 시스템
\`\`\`

## 사용자 피드백 수집

사용자 피드백을 통해 실제 사용 패턴을 파악하고, 문제점을 발견하여 제품을 개선할 수 있습니다.

### 피드백 수집 방법

1. **앱 내 피드백 폼**
\`\`\`
"피드백 제출 모달을 만들어줘"
\`\`\`

2. **사용자 행동 추적**
- 어떤 기능을 많이 사용하는지
- 어디서 이탈하는지
- 에러가 자주 발생하는 곳

3. **베타 테스터 모집**
실제 사용자 몇 명에게 먼저 테스트

## 성능 모니터링

**Analytics 및 에러 추적 서비스**를 사용하면 사용자 행동, 에러, 성능을 모니터링할 수 있습니다.

### 추천 도구

- **Google Analytics**: 사용자 행동 분석
- **Sentry**: 에러 추적
- **Vercel Analytics**: 성능 모니터링
- **PostHog**: 제품 분석

\`\`\`
"Sentry를 설정해서 프로덕션 에러를 추적하도록 해줘"
\`\`\`

## 유지보수

프로젝트 출시 후에도 **버그 수정, 보안 패치, 기능 개선** 등 지속적인 유지보수가 필요합니다.

### 유지보수 계획

1. **정기 업데이트**
   - 의존성 업데이트
   - 보안 패치 적용

2. **버그 트래킹**
   - 이슈 관리 시스템 (GitHub Issues)
   - 우선순위 설정

3. **기능 개선**
   - 사용자 요청 수렴
   - A/B 테스트

4. **성능 최적화**
   - 병목 구간 개선
   - 데이터베이스 쿼리 최적화

## 문서화

\`\`\`
"프로젝트 README를 작성해줘.
- 프로젝트 소개
- 설치 방법
- 실행 방법
- 환경 변수
- 기여 가이드"
\`\`\`

## 코드 품질 유지

\`\`\`
✅ ESLint로 코드 스타일 통일
✅ Prettier로 포맷팅
✅ TypeScript로 타입 안전성
✅ 테스트 코드 작성
✅ 코드 리뷰
\`\`\`

## 백업 전략

\`\`\`
✅ 데이터베이스 자동 백업
✅ 코드 버전 관리 (Git)
✅ 설정 파일 백업
✅ 복구 절차 문서화
\`\`\`

## 다음 단계

풀스택 앱을 완성했다면:

1. **포트폴리오에 추가**: 실제 작동하는 링크와 함께
2. **오픈소스 공개**: GitHub에 공개하여 피드백 받기
3. **블로그 작성**: 개발 과정과 배운 점 정리
4. **다음 프로젝트**: 더 복잡한 기능에 도전

다음 Part에서는 고급 기능과 전문가 수준의 도구 활용법을 배웁니다!
  `,

  "21": `
# 아키텍처 이해

소프트웨어 아키텍처의 개념과 대규모 애플리케이션 구조를 이해해봅시다.

## 소프트웨어 아키텍처란?

**소프트웨어 아키텍처**는 시스템의 전체 구조, 구성 요소, 그들 간의 관계와 상호작용 방식을 정의합니다.

건물의 설계도처럼, 소프트웨어의 청사진 역할을 합니다.

## 아키텍처의 중요성

- **확장성**: 사용자 증가에 대응
- **유지보수성**: 코드 변경이 쉬움
- **재사용성**: 컴포넌트 재활용
- **테스트 용이성**: 독립적 테스트 가능
- **팀 협업**: 역할 분담 명확

## 모놀리식 vs 마이크로서비스

### 모놀리식 (Monolithic)

모든 기능이 하나의 애플리케이션에:

\`\`\`
[단일 애플리케이션]
├── 사용자 관리
├── 상품 관리
├── 주문 처리
└── 결제 처리
\`\`\`

**장점**:
- 개발 초기 빠른 시작
- 간단한 배포
- 통합 테스트 용이

**단점**:
- 부분 수정이 전체에 영향
- 특정 기능만 확장 어려움
- 코드베이스 커지면 관리 어려움

### 마이크로서비스 (Microservices)

각 기능이 독립적인 서비스로:

\`\`\`
[사용자 서비스] [상품 서비스] [주문 서비스] [결제 서비스]
     ↓              ↓              ↓              ↓
  독립 DB        독립 DB        독립 DB        독립 DB
\`\`\`

**장점**:
- ✅ **독립적 배포**: 한 서비스 수정이 다른 서비스에 영향 없음
- ✅ **서비스별 확장**: 트래픽 많은 서비스만 확장
- ✅ **기술 스택 다양화**: 서비스마다 다른 언어/DB 사용 가능
- ✅ **장애 격리**: 한 서비스 문제가 전체에 영향 없음

**단점**:
- 복잡한 인프라
- 네트워크 통신 오버헤드
- 분산 트랜잭션 관리 어려움

❌ **모놀리식의 특징이 아님**: "모든 코드가 한 저장소"는 모놀리식 특징

## 레이어드 아키텍처

\`\`\`
[Presentation Layer]  ← UI, 컴포넌트
        ↓
[Business Logic Layer]  ← 비즈니스 규칙
        ↓
[Data Access Layer]  ← 데이터베이스 접근
        ↓
[Database]
\`\`\`

각 레이어가 명확히 분리되어 유지보수가 쉬워집니다.

## Claude Code로 아키텍처 분석

\`\`\`
"이 프로젝트의 아키텍처를 분석해줘.
- 폴더 구조
- 모듈 간 의존성
- 데이터 흐름
- 개선할 점"
\`\`\`

Claude가 프로젝트 구조와 모듈 간 의존성, 데이터 흐름 등을 분석합니다.

## 디자인 패턴

### Singleton Pattern
\`\`\`typescript
class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
\`\`\`

### Factory Pattern
\`\`\`typescript
class UserFactory {
  createUser(type: string) {
    switch(type) {
      case 'admin': return new AdminUser();
      case 'regular': return new RegularUser();
    }
  }
}
\`\`\`

## SOLID 원칙

**SOLID**는 객체 지향 프로그래밍에서 좋은 설계를 위한 5가지 원칙입니다:

- **S**ingle Responsibility: 단일 책임 - 한 클래스는 하나의 책임만
- **O**pen/Closed: 개방-폐쇄 - 확장에는 열려있고 수정에는 닫혀있음
- **L**iskov Substitution: 리스코프 치환 - 하위 타입은 상위 타입을 대체 가능
- **I**nterface Segregation: 인터페이스 분리 - 필요한 인터페이스만 의존
- **D**ependency Inversion: 의존성 역전 - 구체화가 아닌 추상화에 의존

## 좋은 아키텍처의 특징

✅ **확장성**: 기능 추가가 쉬움
✅ **유지보수성**: 코드 수정이 용이
✅ **재사용성**: 컴포넌트 재활용 가능
✅ **테스트 용이성**: 독립적 테스트
❌ **복잡성 극대화**: 나쁜 아키텍처의 특징

좋은 아키텍처는 복잡성을 관리하고 줄이는 방향입니다.

## 아키텍처 다이어그램

\`\`\`
"이 시스템의 아키텍처 다이어그램을 설명해줘"
\`\`\`

Claude가 시스템 구성 요소와 관계를 설명하여 전체 구조를 파악할 수 있습니다.

다음 챕터에서는 Claude Code의 고급 설정을 배웁니다.
  `,

  "22": `
# 설정 심화

Claude Code의 고급 설정과 프로젝트별 커스터마이징 방법을 배워봅시다.

## 설정 파일 우선순위

Claude Code는 여러 레벨의 설정이 있습니다:

**우선순위 (높음 → 낮음)**:
1. **로컬 설정** (프로젝트 .clauderc)
2. **프로젝트 설정** (.cursorrules, CLAUDE.md)
3. **전역 설정** (~/.claude/config)

가장 가까운 범위의 설정이 우선 적용됩니다.

## 사용자 정의 명령어

자주 사용하는 작업을 **사용자 정의 명령어**로 저장하면 빠르게 재사용할 수 있습니다.

### .cursorrules 예시

\`\`\`yaml
commands:
  setup:
    description: "프로젝트 초기 설정"
    steps:
      - npm install
      - cp .env.example .env.local
      - npm run db:setup

  test-all:
    description: "모든 테스트 실행"
    steps:
      - npm run type-check
      - npm run lint
      - npm test
      - npm run e2e
\`\`\`

사용:
\`\`\`
"setup 명령어 실행해줘"
\`\`\`

## AI 모델 선택

### 작업에 따른 모델 선택

| 작업 | 추천 모델 | 이유 |
|------|-----------|------|
| 간단한 수정 | Claude 3 Haiku | 빠르고 저렴 |
| 일반 개발 | Claude 3.5 Sonnet | 균형잡힌 성능 |
| 복잡한 분석 | Claude 3 Opus | 최고 품질 |

**고려 사항**:
- ✅ 작업 복잡도와 응답 속도
- ❌ 알파벳 순서나 이름 길이는 중요하지 않음

## 파일 제외 설정

**.claudeignore** 또는 설정에서 특정 파일/폴더를 분석에서 제외:

\`\`\`
# .claudeignore
node_modules/
.next/
dist/
build/
*.log
.env*
\`\`\`

이렇게 하면 불필요한 파일을 Claude가 읽지 않아 컨텍스트를 절약할 수 있습니다.

## 프로젝트별 설정

각 프로젝트마다 다른 설정 적용:

### 프로젝트 A (.cursorrules)
\`\`\`
Language: Python
Framework: Django
Style: PEP 8
\`\`\`

### 프로젝트 B (.cursorrules)
\`\`\`
Language: TypeScript
Framework: Next.js
Style: Airbnb
\`\`\`

## 환경별 설정 분리

개발, 스테이징, 프로덕션 환경별로 설정 분리:

\`\`\`
.env.local          # 로컬 개발
.env.development    # 개발 서버
.env.staging        # 스테이징
.env.production     # 프로덕션
\`\`\`

환경 변수로 민감한 정보를 안전하게 관리:

\`\`\`typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const dbUrl = process.env.DATABASE_URL;
\`\`\`

## 팀과 설정 공유

프로젝트 설정 파일을 **Git 저장소에 포함**하면 팀원과 쉽게 공유:

\`\`\`
git add .cursorrules CLAUDE.md
git commit -m "Add project settings"
git push
\`\`\`

팀원들이 프로젝트를 클론하면 자동으로 동일한 설정 적용됩니다.

## 워크스페이스 설정

여러 프로젝트를 동시에 다룰 때:

\`\`\`json
{
  "workspace": {
    "projects": [
      "/path/to/frontend",
      "/path/to/backend",
      "/path/to/mobile"
    ]
  }
}
\`\`\`

## 성능 최적화 설정

\`\`\`
"큰 프로젝트에서 Claude가 느려요.
최적화 설정을 해줘."
\`\`\`

- 불필요한 파일 제외
- 인덱싱 범위 제한
- 캐시 활용

## 키보드 단축키 커스터마이징

\`\`\`json
{
  "keybindings": {
    "chat": "Cmd+Shift+L",
    "composer": "Cmd+I",
    "quick-command": "Cmd+K"
  }
}
\`\`\`

다음 챕터에서는 Hooks와 Commands를 배웁니다.
  `,

  "23": `
# Hooks & Commands

Claude Code의 훅 시스템과 커스텀 명령어로 워크플로우를 자동화해봅시다.

## Hooks란?

**Hooks**는 특정 이벤트가 발생할 때 자동으로 실행되는 스크립트입니다.

예시:
- 파일 저장 시 자동 포맷팅
- 커밋 전 테스트 실행
- 배포 전 빌드 확인

## Pre-commit Hook

**커밋 전에 실행**되어 코드 검사, 포맷팅, 테스트 등을 자동으로 수행합니다.

\`\`\`
"pre-commit hook을 설정해줘.
커밋 전에:
1. ESLint 검사
2. Prettier 포맷팅
3. 타입 체크
4. 유닛 테스트"
\`\`\`

### .git/hooks/pre-commit

\`\`\`bash
#!/bin/sh

echo "Running pre-commit checks..."

# ESLint
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint failed"
  exit 1
fi

# Prettier
npm run format:check
if [ $? -ne 0 ]; then
  echo "❌ Prettier failed"
  exit 1
fi

# Type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed"
  exit 1
fi

# Tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✅ All checks passed"
\`\`\`

테스트 실패 시 커밋이 중단되고 수정할 수 있습니다.

## Hook 실패 시 동작

Hook 실패 시 설정에 따라:
- **작업 중단**: 에러 수정 필요
- **경고 후 계속**: 경고만 표시

\`\`\`json
{
  "hooks": {
    "onError": "block" // or "warn"
  }
}
\`\`\`

## Slash Commands

**슬래시 명령어**로 자주 사용하는 기능을 빠르게 실행:

\`\`\`
/commit  - 변경사항 커밋
/test    - 테스트 실행
/build   - 프로젝트 빌드
/deploy  - 배포 실행
\`\`\`

채팅창에 `/commit`을 입력하면 자동으로 커밋 워크플로우 실행.

## 사용자 정의 슬래시 명령어

설정 파일에서 사용자 정의 슬래시 명령어와 실행할 동작을 정의:

\`\`\`json
{
  "commands": {
    "/setup": {
      "description": "프로젝트 초기 설정",
      "script": "npm install && npm run db:migrate"
    },
    "/clean": {
      "description": "빌드 파일 정리",
      "script": "rm -rf dist .next node_modules/.cache"
    },
    "/deploy-staging": {
      "description": "스테이징에 배포",
      "script": "npm run build && vercel --env=staging"
    }
  }
}
\`\`\`

사용:
\`\`\`
/setup
/clean
/deploy-staging
\`\`\`

## Post-save Hook

파일 저장 시 자동 실행:

\`\`\`json
{
  "hooks": {
    "post-save": {
      "*.ts": "eslint --fix",
      "*.tsx": "eslint --fix",
      "*.css": "prettier --write"
    }
  }
}
\`\`\`

파일 저장하면 자동으로 린트와 포맷팅!

## Pre-push Hook

푸시 전 실행:

\`\`\`bash
#!/bin/sh

echo "Running pre-push checks..."

# 전체 테스트 스위트
npm run test:all

# E2E 테스트
npm run test:e2e

# 빌드 확인
npm run build
\`\`\`

## Husky로 Git Hooks 관리

\`\`\`
"Husky를 설정해서 Git hooks를 관리하도록 해줘"
\`\`\`

\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  }
}
\`\`\`

## 워크플로우 자동화 예시

### 완전한 CI 워크플로우

\`\`\`
파일 저장
  → 자동 포맷팅 (post-save)
  → 코드 작성 완료
  → 커밋 시도
  → Pre-commit hook 실행
    → Lint ✓
    → Type check ✓
    → Tests ✓
  → 커밋 완료
  → 푸시 시도
  → Pre-push hook 실행
    → Full test suite ✓
    → Build ✓
  → 푸시 완료
  → CI/CD 자동 배포
\`\`\`

## 조건부 Hook

특정 브랜치에서만 실행:

\`\`\`bash
#!/bin/sh

BRANCH=$(git branch --show-current)

if [ "$BRANCH" = "main" ]; then
  echo "Main branch - running full checks"
  npm run test:all
else
  echo "Feature branch - running quick checks"
  npm run test:unit
fi
\`\`\`

다음 챕터에서는 Agents와 Skills를 배웁니다.
  `,

  "24": `
# Agents & Skills

AI Agent 기반 개발과 전문화된 스킬을 활용하는 방법을 배워봅시다.

## AI Agent란?

**AI Agent**는 목표를 이해하고 필요한 도구를 사용하여 자율적으로 작업을 수행합니다.

일반적인 AI:
\`\`\`
사용자: "로그인 기능 만들어줘"
AI: [코드 생성]
\`\`\`

Agent:
\`\`\`
사용자: "로그인 기능 만들어줘"
Agent:
  1. 기존 인증 코드 탐색
  2. 필요한 라이브러리 확인
  3. 코드 생성
  4. 테스트 작성
  5. 문서 업데이트
\`\`\`

자율적으로 여러 단계를 수행합니다.

## Claude Code Agent 모드

\`\`\`
"Agent 모드로 전환해서
사용자 프로필 페이지를 완전히 구현해줘.
필요한 모든 작업을 알아서 해줘."
\`\`\`

Agent가 자동으로:
- 관련 파일 찾기
- 컴포넌트 생성
- API 연결
- 스타일링
- 테스트 작성
- 문서화

복잡한 작업을 단계별로 자동 수행합니다.

## Skills란?

**Skills**는 특정 작업에 특화된 기능입니다.

예시:
- **Code Review Skill**: 코드 리뷰에 특화
- **Test Generation Skill**: 테스트 코드 생성에 특화
- **Refactoring Skill**: 리팩토링에 특화
- **Documentation Skill**: 문서 작성에 특화

해당 작업을 더 효과적으로 수행합니다.

## Agent에게 작업 위임

### 명확한 목표 설정

\`\`\`
"블로그 포스트 상세 페이지를 구현해줘.

요구사항:
- 마크다운 렌더링
- 댓글 섹션
- 좋아요 기능
- 공유 버튼
- SEO 메타 태그

기존 코드 스타일을 따라서 구현하고,
테스트도 함께 작성해줘."
\`\`\`

### 결과 확인

Agent가 작업을 완료하면:
1. 생성된 코드 검토
2. 테스트 실행 확인
3. 기능 동작 테스트
4. 필요시 피드백

자동화되어도 **검토는 필수**입니다.

## Multi-agent 시스템

여러 에이전트가 각자 전문 영역을 담당:

\`\`\`
[Architect Agent]
  설계와 구조 결정
    ↓
[Developer Agent]
  코드 작성
    ↓
[Tester Agent]
  테스트 작성 및 실행
    ↓
[Reviewer Agent]
  코드 리뷰와 개선
\`\`\`

각 에이전트가 전문 역할을 담당하여 복잡한 작업을 효율적으로 처리합니다.

## Agent 작업 모니터링

\`\`\`
"Agent가 무슨 작업을 하고 있는지 보여줘"
\`\`\`

Agent의 작업 진행상황:
- 현재 단계
- 완료된 작업
- 다음 계획
- 발견한 이슈

## 제약 조건 설정

\`\`\`
"Agent 모드로 작업하되,
다음 제약을 지켜줘:
- 기존 파일 삭제 금지
- 외부 API 호출 금지
- 데이터베이스 스키마 변경 금지"
\`\`\`

## 실용 예시

### 1. 전체 기능 구현
\`\`\`
"검색 기능을 처음부터 끝까지 구현해줘"
\`\`\`

Agent가:
- UI 컴포넌트 생성
- 검색 API 구현
- 데이터베이스 쿼리 최적화
- 검색 결과 페이지네이션
- 테스트 작성

### 2. 버그 조사 및 수정
\`\`\`
"사용자들이 로그아웃이 안 된다고 하는데,
원인을 찾아서 고쳐줘"
\`\`\`

Agent가:
- 관련 코드 탐색
- 로그 분석
- 재현 시나리오 작성
- 버그 수정
- 테스트 추가

### 3. 레거시 코드 마이그레이션
\`\`\`
"이 오래된 jQuery 코드를
React로 마이그레이션해줘"
\`\`\`

Agent가:
- 기존 로직 분석
- React 컴포넌트로 변환
- 상태 관리 구현
- 스타일 마이그레이션
- 동작 검증

## 주의사항

1. **검토 필수**: Agent 결과물 반드시 확인
2. **명확한 지시**: 목표와 제약 조건 명시
3. **단계별 확인**: 복잡한 작업은 중간 확인
4. **백업**: 중요한 변경 전 커밋

다음 챕터에서는 MCP 연동을 배웁니다.
  `,

  "25": `
# MCP 연동

Model Context Protocol (MCP)로 Claude의 기능을 확장해봅시다.

## MCP란?

**MCP (Model Context Protocol)**는 AI 모델이 외부 도구, 데이터 소스, 서비스와 표준화된 방식으로 연동할 수 있게 하는 프로토콜입니다.

비유: 스마트폰의 앱처럼, MCP 서버를 설치하면 Claude가 새로운 능력을 얻습니다.

## MCP의 구성 요소

### 1. MCP 서버

외부 서비스와의 연결을 제공하는 백엔드:

\`\`\`
GitHub MCP → GitHub API와 연동
Slack MCP → Slack 메시지 전송
Database MCP → 데이터베이스 쿼리
\`\`\`

### 2. MCP 도구 (Tools)

특정 동작을 수행하는 함수:

\`\`\`
- search_files: 파일 검색
- call_api: API 호출
- query_database: DB 조회
- send_message: 메시지 전송
\`\`\`

MCP Tool은 파일 검색, API 호출, 데이터 조회 등 특정 동작을 수행하는 함수를 AI에게 제공합니다.

### 3. MCP 리소스 (Resources)

읽기 가능한 데이터나 컨텍스트:

\`\`\`
- 파일 내용
- 데이터베이스 레코드
- API 응답 데이터
- 문서 내용
\`\`\`

MCP Resource는 파일 내용, 데이터베이스 레코드 등 AI가 읽고 활용할 수 있는 데이터를 제공합니다.

## MCP 서버 사용하기

\`\`\`
"GitHub MCP 서버를 연동해줘"
\`\`\`

설정 후:

\`\`\`
"GitHub에서 최근 이슈 10개를 가져와줘"
"새로운 Pull Request를 만들어줘"
"이 저장소의 스타 수를 확인해줘"
\`\`\`

Claude가 MCP 서버를 통해 GitHub API를 직접 호출하여 작업을 수행합니다.

## 사용 가능한 MCP 서버 예시

### GitHub MCP
- 이슈 조회/생성
- PR 관리
- 코드 검색
- 커밋 히스토리

### Slack MCP
- 메시지 전송
- 채널 조회
- 사용자 검색

### Database MCP
- SQL 쿼리 실행
- 테이블 스키마 조회
- 데이터 CRUD

### File System MCP
- 파일 검색
- 내용 읽기
- 디렉토리 탐색

## 커스텀 MCP 서버 만들기

\`\`\`
"날씨 API를 호출하는 MCP 서버를 만들어줘"
\`\`\`

\`\`\`typescript
// weather-mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk';

const server = new Server({
  name: 'weather-mcp',
  version: '1.0.0'
});

server.addTool({
  name: 'get_weather',
  description: '특정 도시의 날씨 조회',
  parameters: {
    city: { type: 'string', description: '도시 이름' }
  },
  handler: async ({ city }) => {
    const response = await fetch(\`https://api.weather.com/\${city}\`);
    const data = await response.json();
    return {
      temperature: data.temp,
      condition: data.condition
    };
  }
});

server.start();
\`\`\`

이제 Claude에게:
\`\`\`
"서울의 날씨를 확인해줘"
\`\`\`

Claude가 자동으로 MCP 서버를 통해 날씨 API를 호출합니다.

## MCP 보안

MCP 연동 시 **필요한 최소 권한만 부여**하고, API 키와 인증 정보를 안전하게 관리해야 합니다.

### 권한 설정

\`\`\`json
{
  "mcp-servers": {
    "github": {
      "permissions": [
        "read:issues",
        "write:issues"
      ]
    }
  }
}
\`\`\`

❌ 나쁜 예: 모든 권한 부여
\`\`\`json
{
  "permissions": ["*"]
}
\`\`\`

✅ 좋은 예: 필요한 권한만
\`\`\`json
{
  "permissions": ["read:issues"]
}
\`\`\`

### API 키 관리

\`\`\`
# .env
GITHUB_TOKEN=ghp_xxx
SLACK_TOKEN=xoxb-xxx
WEATHER_API_KEY=abc123
\`\`\`

코드에 직접 작성하지 말고 환경 변수 사용!

## 실용 예시

### 1. 자동 이슈 생성
\`\`\`
"코드에서 TODO 주석을 찾아서
각각 GitHub 이슈로 만들어줘"
\`\`\`

### 2. 슬랙 알림
\`\`\`
"배포가 완료되면 #dev-team 채널에
알림을 보내줘"
\`\`\`

### 3. 데이터 분석
\`\`\`
"최근 일주일간 신규 사용자 수를
데이터베이스에서 조회해줘"
\`\`\`

### 4. 문서 동기화
\`\`\`
"API 엔드포인트 변경사항을
Notion 문서에 업데이트해줘"
\`\`\`

## MCP vs API 직접 호출

| MCP | 직접 API 호출 |
|-----|--------------|
| 표준화된 인터페이스 | 각 API마다 다름 |
| Claude가 자동 처리 | 코드 작성 필요 |
| 에러 처리 내장 | 직접 구현 |
| 재사용 쉬움 | 매번 구현 |

다음 챕터에서는 CI/CD 자동화를 배웁니다.
  `,

  "26": `
# CI/CD 자동화

지속적 통합(CI)과 지속적 배포(CD)로 개발 워크플로우를 자동화해봅시다.

## CI/CD란?

**CI (Continuous Integration)**: 코드를 자주 통합하고 자동 테스트
**CD (Continuous Deployment)**: 자동으로 배포

## CI의 핵심

개발자들이 코드를 자주 통합하고, **자동화된 빌드와 테스트**를 통해 문제를 조기에 발견합니다.

### 기존 방식
\`\`\`
개발 → 수동 테스트 → 수동 빌드 → 수동 배포
(느리고 에러 발생 가능)
\`\`\`

### CI/CD
\`\`\`
코드 푸시 → 자동 빌드 → 자동 테스트 → 자동 배포
(빠르고 일관됨)
\`\`\`

## CD의 장점

- ✅ **빠른 피드백**: 문제를 즉시 발견
- ✅ **일관된 배포**: 동일한 프로세스 반복
- ✅ **인적 오류 감소**: 수동 작업 최소화
- ✅ **빠른 릴리스**: 자주 작은 단위로 배포
- ❌ **수동 배포 과정**: CD의 장점이 아님

CD는 자동화로 수동 과정을 줄입니다.

## GitHub Actions 시작하기

GitHub Actions는 GitHub에 내장된 CI/CD 도구입니다.

### 워크플로우 파일 위치

**.github/workflows** 폴더에 YAML 파일로 정의:

\`\`\`
my-project/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── src/
\`\`\`

## 기본 CI 워크플로우

\`\`\`
"GitHub Actions로 CI를 설정해줘.
PR 시 자동으로:
- 타입 체크
- 린트
- 테스트
실행하도록"
\`\`\`

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test
\`\`\`

이제 PR을 만들면 자동으로 모든 검사 실행!

## 테스트 실패 시 동작

테스트 실패 시 **파이프라인이 중단**되고 담당자에게 알림이 가서 문제를 수정할 수 있습니다.

\`\`\`
✅ 테스트 통과 → PR 머지 가능
❌ 테스트 실패 → PR 머지 차단
\`\`\`

## 자동 배포 워크플로우

\`\`\`
"main 브랜치에 머지되면 자동으로
Vercel에 배포하도록 설정해줘"
\`\`\`

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod --token=\$VERCEL_TOKEN
\`\`\`

## 환경 변수와 시크릿

GitHub 저장소 설정에서 시크릿 추가:

\`\`\`
Settings → Secrets → New repository secret

VERCEL_TOKEN
DATABASE_URL
API_KEY
\`\`\`

워크플로우에서 사용:
\`\`\`yaml
env:
  API_KEY: \${{ secrets.API_KEY }}
\`\`\`

## 조건부 실행

\`\`\`yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: vercel --env=staging

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: vercel --prod
\`\`\`

## 매트릭스 빌드

여러 환경에서 테스트:

\`\`\`yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]

runs-on: \${{ matrix.os }}

steps:
  - uses: actions/setup-node@v3
    with:
      node-version: \${{ matrix.node-version }}
\`\`\`

## Claude로 워크플로우 생성

\`\`\`
"다음 요구사항으로 GitHub Actions 워크플로우를 만들어줘:

PR 생성 시:
- 코드 품질 검사
- 유닛 테스트 실행
- E2E 테스트 실행

main 브랜치 머지 시:
- 프로덕션 빌드
- Vercel에 배포
- Slack으로 배포 알림"
\`\`\`

Claude가 적절한 YAML 워크플로우를 생성합니다.

## 캐싱으로 빌드 속도 향상

\`\`\`yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
\`\`\`

의존성을 캐싱하여 빌드 시간 단축!

## 배지 추가

README에 CI 상태 배지:

\`\`\`markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
\`\`\`

다음 챕터에서는 팀 협업 방법을 배웁니다.
  `,

  "27": `
# 팀 협업

팀에서 Claude Code를 효과적으로 사용하는 방법을 배워봅시다.

## 팀 협업 설정

### 공통 규칙과 설정 공유

**.cursorrules, CLAUDE.md 등 공통 설정 파일을 공유**하면 팀원 모두 일관된 AI 지원을 받습니다.

\`\`\`bash
# Git에 포함
git add .cursorrules CLAUDE.md
git commit -m "Add team AI settings"
git push
\`\`\`

팀원들이 프로젝트를 클론하면 자동으로 동일한 설정이 적용됩니다.

## AI 생성 코드 리뷰

### 왜 중요한가?

AI 생성 코드도 버그나 보안 문제가 있을 수 있고, 리뷰를 통해 팀 내 지식 공유도 이루어집니다.

### 리뷰 체크리스트

\`\`\`
✅ 로직이 올바른가?
✅ 에러 처리가 적절한가?
✅ 보안 취약점은 없는가?
✅ 성능 이슈는 없는가?
✅ 테스트가 충분한가?
✅ 팀 코딩 컨벤션을 따르는가?
\`\`\`

## PR에 AI 사용 표시

AI 도움을 받은 부분을 표시하면 리뷰어가 더 주의 깊게 확인할 수 있고 투명한 협업이 가능합니다.

### PR 템플릿

\`\`\`markdown
## 변경 사항
[변경 내용 설명]

## AI 지원 사용
- [ ] Claude Code로 코드 생성
- [ ] AI가 생성한 파일: \`src/components/NewFeature.tsx\`
- [ ] 수동으로 검토 완료

## 테스트
- [ ] 유닛 테스트 작성
- [ ] 수동 테스트 완료
\`\`\`

## 팀 코딩 컨벤션 적용

팀 코딩 컨벤션을 **.cursorrules 또는 CLAUDE.md**에 명시하면 AI가 일관되게 팀 스타일을 따릅니다.

\`\`\`markdown
# CLAUDE.md

## 코딩 컨벤션

### 네이밍
- 컴포넌트: PascalCase
- 함수: camelCase
- 상수: UPPER_SNAKE_CASE

### 파일 구조
- 컴포넌트당 하나의 파일
- 테스트 파일은 \`.test.tsx\` 접미사

### 주석
- 복잡한 로직에만 주석 추가
- 한국어 사용

### 에러 처리
- try-catch 사용
- 사용자 친화적 메시지
\`\`\`

## 코드 리뷰 프로세스

### 1. AI로 사전 검토

\`\`\`
"이 PR의 코드를 리뷰해줘.
- 버그 가능성
- 성능 이슈
- 보안 문제
- 개선 제안"
\`\`\`

AI가 1차 검토 → 팀원이 2차 검토

### 2. 리뷰 코멘트 작성

\`\`\`
"이 함수에 대한 리뷰 코멘트를 작성해줘.
건설적이고 친절하게"
\`\`\`

## 브랜치 전략

\`\`\`
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/* (기능 개발)
fix/* (버그 수정)
\`\`\`

## 문서화 자동화

\`\`\`
"새로 추가한 API 엔드포인트를
API 문서에 추가해줘"
\`\`\`

\`\`\`
"이 컴포넌트의 Props 문서를
자동으로 생성해줘"
\`\`\`

## AI 도구 사용 시 주의사항

### 모든 코드를 AI로만 생성하지 말 것

❌ **나쁜 습관**: 모든 코드 AI로만 작성
✅ **좋은 습관**: AI는 보조 수단, 개발자가 이해하고 검토

AI 도구는 보조 수단입니다. 모든 코드를 AI로만 생성하는 것은 권장되지 않으며, 개발자의 이해와 검토가 필요합니다.

### 민감 정보 노출 방지

\`\`\`
❌ API 키를 AI에게 공유
❌ 고객 데이터를 AI에게 전송
❌ 비밀 알고리즘을 AI에게 공개
\`\`\`

### 라이선스 확인

AI가 생성한 코드도:
- 라이선스 확인 필요
- 저작권 준수
- 오픈소스 라이선스 호환성 체크

## 품질 기준 유지

\`\`\`yaml
# .github/workflows/quality.yml
name: Code Quality

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Lint
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Test Coverage
        run: npm run test:coverage

      - name: Check Coverage Threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi
\`\`\`

## 지식 공유

### 1. 팀 위키
AI와 함께 해결한 문제를 문서화

### 2. 코드 리뷰 시 학습
AI 생성 코드를 함께 리뷰하며 학습

### 3. 베스트 프랙티스 공유
효과적인 프롬프트와 워크플로우 공유

## 온보딩 프로세스

신규 팀원을 위한 가이드:

\`\`\`markdown
# 개발 환경 설정

1. 저장소 클론
2. Claude Code 설치
3. 프로젝트 설정 자동 적용 (.cursorrules)
4. 첫 이슈 할당
5. AI 지원 받으며 코드 작성
6. 리뷰어와 함께 PR 리뷰
\`\`\`

다음 Part에서는 Web3 개발에 도전합니다!
  `,

  "28": `
# Web3 기초

블록체인과 탈중앙화 애플리케이션의 세계로 입문해봅시다.

## Web3란?

**Web3**는 중앙 서버에 의존하지 않고 블록체인을 통해 탈중앙화된 방식으로 동작하는 인터넷의 새로운 패러다임입니다.

### Web1, Web2, Web3 비교

| Web1 (읽기 전용) | Web2 (참여) | Web3 (소유) |
|------------------|-------------|-------------|
| 정적 웹사이트 | SNS, 플랫폼 | 블록체인 기반 |
| 정보 소비 | 콘텐츠 생성 | 데이터 소유 |
| 개인 웹사이트 | Facebook, YouTube | NFT, DeFi |

### Web3의 핵심 특징

- ✅ **탈중앙화**: 중앙 서버 없음
- ✅ **블록체인 기반**: 투명하고 변경 불가능
- ✅ **사용자 데이터 소유권**: 내 데이터는 내 것
- ✅ **토큰 경제**: 암호화폐로 가치 교환
- ❌ **중앙 서버 의존**: Web3가 아님

## 블록체인 기본 개념

### 블록체인이란?

거래 기록을 블록으로 연결한 분산 장부:

\`\`\`
[블록 1] → [블록 2] → [블록 3] → ...
   ↓           ↓           ↓
 거래들      거래들      거래들
\`\`\`

한 번 기록되면 변경할 수 없어 투명하고 안전합니다.

## 스마트 컨트랙트

**스마트 컨트랙트**는 블록체인에 배포되어 조건이 충족되면 자동으로 실행되는 프로그램입니다.

예시:
\`\`\`
IF (조건 충족) THEN (자동 실행)

"100 ETH가 전송되면 자동으로 NFT 발급"
\`\`\`

법적 계약서, 전자 서명, 암호화된 이메일이 아닙니다.

## 지갑 (Wallet)

### 지갑의 역할

- ✅ **암호화폐 보관**: ETH, 토큰 저장
- ✅ **트랜잭션 서명**: 거래 승인
- ✅ **dApp 연결**: 탈중앙화 앱 사용
- ✅ **신원 인증**: 로그인 수단
- ❌ **코드 컴파일**: 지갑의 역할 아님

코드 컴파일은 개발 도구의 역할입니다.

### 주요 지갑

- **MetaMask**: 가장 널리 사용
- **Coinbase Wallet**: 초보자 친화적
- **WalletConnect**: 모바일 연결

## 가스비 (Gas Fee)

**가스비**는 블록체인에서 트랜잭션을 처리하기 위해 지불하는 수수료입니다.

비유: 우체국에서 편지 보낼 때 내는 우표 값

- 네트워크가 바쁠수록 가스비 증가
- 복잡한 작업일수록 가스비 증가

## Web3 개발 시작하기

\`\`\`
"Web3 프로젝트를 시작하려고 해.
MetaMask 연동하는 React 앱을 만들어줘."
\`\`\`

Claude Code로 Solidity 스마트 컨트랙트 작성, 테스트 코드, 프론트엔드 dApp 개발 등을 할 수 있습니다.

### 기본 구조

\`\`\`
my-dapp/
├── contracts/        # 스마트 컨트랙트 (Solidity)
├── test/            # 컨트랙트 테스트
├── scripts/         # 배포 스크립트
└── frontend/        # React dApp
\`\`\`

## 지갑 연결하기

\`\`\`typescript
// 지갑 연결 함수
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log('연결된 주소:', accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error('지갑 연결 실패:', error);
    }
  } else {
    alert('MetaMask를 설치해주세요!');
  }
}
\`\`\`

## 토큰 잔액 조회

\`\`\`typescript
import { ethers } from 'ethers';

async function getBalance(address: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(address);
  // Wei를 ETH로 변환
  const ethBalance = ethers.formatEther(balance);
  return ethBalance;
}
\`\`\`

## NFT 기초

**NFT (Non-Fungible Token)**: 대체 불가능한 토큰

- 각 NFT는 고유함
- 디지털 소유권 증명
- 아트, 게임 아이템, 부동산 등

### NFT 메타데이터 조회

\`\`\`
"NFT 컬렉션의 메타데이터를 조회하고
갤러리 형태로 표시하는 페이지를 만들어줘"
\`\`\`

## 트랜잭션 전송

\`\`\`typescript
async function sendTransaction(to: string, amount: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to: to,
    value: ethers.parseEther(amount)
  });

  await tx.wait(); // 트랜잭션 완료 대기
  console.log('전송 완료:', tx.hash);
}
\`\`\`

## 테스트넷 사용

실제 돈을 쓰기 전에 테스트넷에서 연습:

- **Sepolia**: 이더리움 테스트넷
- **Mumbai**: Polygon 테스트넷
- **Base Sepolia**: Base 테스트넷

테스트넷 토큰은 무료로 받을 수 있습니다 (Faucet).

## Web3 dApp 예시

\`\`\`
"간단한 NFT 민팅 dApp을 만들어줘.
- 지갑 연결
- NFT 민팅 버튼
- 트랜잭션 상태 표시
- 소유한 NFT 목록"
\`\`\`

다음 챕터에서는 Farcaster Frames를 배웁니다.
  `,

  "30": `
# Base 스마트 컨트랙트

Base 네트워크에 스마트 컨트랙트를 배포하고 dApp과 연동하는 방법을 배워봅시다.

## Base 체인이란?

**Base**는 Coinbase가 개발한 이더리움 Layer 2 체인으로, 낮은 수수료와 빠른 처리가 특징입니다.

### Base의 특징

- ✅ **이더리움 L2**: 이더리움 보안 활용
- ✅ **Coinbase 개발**: 안정적인 운영
- ✅ **낮은 수수료**: 이더리움 대비 1/10 수준
- ✅ **빠른 처리**: 2초 블록 타임
- ❌ **비트코인 기반**: Base는 이더리움 기반

## Solidity 기초

**Solidity**는 이더리움 및 EVM 호환 체인에서 스마트 컨트랙트를 작성하는 프로그래밍 언어입니다.

### 간단한 컨트랙트

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private value;

    function setValue(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}
\`\`\`

## ERC-20 토큰 표준

**ERC-20**은 대체 가능한(fungible) 토큰을 만들기 위한 표준 인터페이스로, transfer, balanceOf 등의 함수를 정의합니다.

### 표준 함수

\`\`\`solidity
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
\`\`\`

## 토큰 만들기

\`\`\`
"Base에서 사용할 ERC-20 토큰 컨트랙트를 만들어줘.
토큰 이름: MyToken
심볼: MTK
총 발행량: 1,000,000"
\`\`\`

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
\`\`\`

## 개발 환경 설정

\`\`\`
"Hardhat으로 Base 개발 환경을 설정해줘"
\`\`\`

\`\`\`bash
npm install --save-dev hardhat
npx hardhat init
\`\`\`

### hardhat.config.ts

\`\`\`typescript
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 84532
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 8453
    }
  }
};

export default config;
\`\`\`

## 테스트 작성

실제 자산이 걸린 메인넷 배포 전에 **테스트넷에서 충분히 테스트**하여 버그를 찾아야 합니다.

\`\`\`typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  it("Should have correct total supply", async function () {
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(ethers.parseEther("1000000"));
  });

  it("Should transfer tokens", async function () {
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    const [owner, addr1] = await ethers.getSigners();

    await token.transfer(addr1.address, ethers.parseEther("100"));
    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.parseEther("100"));
  });
});
\`\`\`

## Base에 배포하기

Base에 컨트랙트를 배포하려면 **가스비를 위한 ETH**와 Hardhat, Foundry 같은 배포 도구가 필요합니다.

### 1. Base Sepolia ETH 받기

테스트넷 faucet에서 무료로 받기:
- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### 2. 배포 스크립트

\`\`\`typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();

  await token.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
\`\`\`

### 3. 배포 실행

\`\`\`bash
# 테스트넷에 배포
npx hardhat run scripts/deploy.ts --network baseSepolia

# 메인넷에 배포 (신중하게!)
npx hardhat run scripts/deploy.ts --network base
\`\`\`

## 프론트엔드 연동

\`\`\`
"배포한 토큰 컨트랙트와 연동되는
React 프론트엔드를 만들어줘.
- 토큰 잔액 조회
- 토큰 전송
- 트랜잭션 히스토리"
\`\`\`

\`\`\`typescript
import { ethers } from 'ethers';
import TokenABI from './MyToken.json';

const contractAddress = "0x..."; // 배포된 컨트랙트 주소

async function getTokenBalance(userAddress: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    contractAddress,
    TokenABI,
    provider
  );

  const balance = await contract.balanceOf(userAddress);
  return ethers.formatEther(balance);
}

async function transferTokens(to: string, amount: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    TokenABI,
    signer
  );

  const tx = await contract.transfer(to, ethers.parseEther(amount));
  await tx.wait();
  console.log("Transfer complete:", tx.hash);
}
\`\`\`

## NFT 컨트랙트 (ERC-721)

\`\`\`
"Base에 NFT 컨트랙트를 만들어줘.
민팅 기능과 메타데이터 URI 포함"
\`\`\`

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}

    function mint(address to) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(to, newTokenId);
        return newTokenId;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://YOUR_IPFS_CID/";
    }
}
\`\`\`

## 보안 체크리스트

\`\`\`
✅ Reentrancy 공격 방어
✅ Integer overflow/underflow 체크
✅ Access control 구현
✅ 테스트넷에서 충분히 테스트
✅ 코드 감사 (Audit)
\`\`\`

## BaseScan에서 검증

배포 후 BaseScan에서 컨트랙트 검증:

\`\`\`bash
npx hardhat verify --network base DEPLOYED_CONTRACT_ADDRESS
\`\`\`

검증하면 누구나 소스 코드를 볼 수 있어 투명성이 높아집니다.

축하합니다! VibeDojo의 모든 챕터를 완료했습니다! 🎉
  `,

  "29": `
# Farcaster Frames

Farcaster 소셜 네트워크에서 동작하는 인터랙티브 앱, Frames를 만들어봅시다.

## Farcaster란?

**Farcaster**는 탈중앙화된 소셜 네트워크 프로토콜로, 사용자가 데이터 소유권을 가집니다.

트위터나 페이스북처럼 중앙 서버가 데이터를 소유하는 것이 아니라, 사용자가 자신의 소셜 그래프를 소유합니다.

### Farcaster vs 기존 SNS

| 기존 SNS | Farcaster |
|----------|-----------|
| 중앙화 | 탈중앙화 |
| 플랫폼이 데이터 소유 | 사용자가 데이터 소유 |
| 한 앱에 종속 | 여러 클라이언트 가능 |
| 알고리즘 통제 | 사용자가 선택 |

## Farcaster Frame이란?

**Frame**은 Farcaster 피드 내에서 버튼 클릭, 입력 등 상호작용이 가능한 미니 앱입니다.

일반 포스트:
\`\`\`
[이미지]
텍스트 내용
\`\`\`

Frame:
\`\`\`
[이미지]
[버튼 1] [버튼 2] [버튼 3]
[입력 필드]
\`\`\`

사진 액자, 비디오 플레이어, 텍스트 편집기, 파일 관리자가 아닙니다.

## Frame의 구성 요소

### Open Graph 메타 태그

Frame은 **특정 Open Graph 메타 태그**와 버튼 클릭을 처리할 서버 엔드포인트로 구현합니다.

\`\`\`html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://example.com/image.png" />
<meta property="fc:frame:button:1" content="Click Me" />
<meta property="fc:frame:button:2" content="Learn More" />
<meta property="fc:frame:post_url" content="https://example.com/api/frame" />
\`\`\`

### 서버 엔드포인트

버튼 클릭 시 처리:

\`\`\`typescript
export async function POST(req: Request) {
  const data = await req.json();
  const buttonIndex = data.untrustedData.buttonIndex;

  if (buttonIndex === 1) {
    // 버튼 1 클릭 처리
    return new Response(/* 새 Frame HTML */);
  }
}
\`\`\`

## 간단한 Frame 만들기

\`\`\`
"카운터 Frame을 만들어줘.
버튼을 누르면 숫자가 증가하는 간단한 Frame"
\`\`\`

### page.tsx (Next.js)

\`\`\`typescript
export default function Frame() {
  return (
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://myapp.com/counter/0" />
        <meta property="fc:frame:button:1" content="Increment" />
        <meta property="fc:frame:post_url" content="https://myapp.com/api/frame" />
      </head>
      <body>
        <h1>Counter Frame</h1>
      </body>
    </html>
  );
}
\`\`\`

### API Route

\`\`\`typescript
// app/api/frame/route.ts
export async function POST(req: Request) {
  const data = await req.json();
  const count = parseInt(data.untrustedData.state || '0') + 1;

  const html = \`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://myapp.com/counter/\${count}" />
        <meta property="fc:frame:button:1" content="Increment" />
        <meta property="fc:frame:post_url" content="https://myapp.com/api/frame" />
        <meta property="fc:frame:state" content="\${count}" />
      </head>
    </html>
  \`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
\`\`\`

## 사용자 입력 받기

Frame은 **텍스트 입력 필드와 최대 4개의 버튼**을 통해 사용자 입력을 받을 수 있습니다.

\`\`\`html
<meta property="fc:frame:input:text" content="Enter your name" />
<meta property="fc:frame:button:1" content="Submit" />
<meta property="fc:frame:button:2" content="Reset" />
\`\`\`

입력 값 받기:

\`\`\`typescript
const userInput = data.untrustedData.inputText;
console.log("User entered:", userInput);
\`\`\`

## Frame 상태 관리

\`\`\`html
<meta property="fc:frame:state" content="{&quot;count&quot;:5,&quot;user&quot;:&quot;alice&quot;}" />
\`\`\`

상태를 JSON으로 인코딩하여 전달합니다.

## 실용적인 Frame 예시

### 1. 투표 Frame
\`\`\`
"어떤 기능을 먼저 만들까요?"
[Option A] [Option B] [Option C]
\`\`\`

### 2. 퀴즈 Frame
\`\`\`
"질문: 2 + 2 = ?"
[3] [4] [5] [6]
\`\`\`

### 3. NFT 민팅 Frame
\`\`\`
[NFT 이미지]
[Mint Now] [View Collection]
\`\`\`

### 4. 게임 Frame
\`\`\`
"가위바위보 게임"
[가위] [바위] [보]
\`\`\`

## Frame 개발 with Claude Code

\`\`\`
"Farcaster Frame을 만들어줘.
투표 Frame인데:
- 3개의 선택지
- 실시간 투표 결과 표시
- 한 번만 투표 가능
- Supabase로 투표 저장"
\`\`\`

Claude Code로 Next.js 기반 Frame 서버, 메타 태그 생성, 버튼 핸들러 등을 개발할 수 있습니다.

## 이미지 동적 생성

\`\`\`typescript
import { ImageResponse } from '@vercel/og';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const count = searchParams.get('count') || '0';

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        fontSize: 128,
        background: 'white',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        Count: {count}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
\`\`\`

## Frame 디버깅

- **Warpcast Frame Validator**: Frame이 올바른지 검증
- **로컬 터널**: ngrok으로 로컬 개발 서버 공개

\`\`\`bash
ngrok http 3000
\`\`\`

## Frame 배포

\`\`\`
"Frame을 Vercel에 배포하고
Warpcast에서 테스트하는 방법을 알려줘"
\`\`\`

1. Vercel에 배포
2. 배포 URL 복사
3. Warpcast에서 cast 작성
4. URL 붙여넣기
5. Frame 미리보기 확인!

다음 챕터에서는 Base에 스마트 컨트랙트를 배포합니다.
  `,
};

export function getChapterContent(chapterId: string): string | null {
  return chapterContent[chapterId] || null;
}
