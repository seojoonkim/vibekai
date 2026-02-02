export interface Chapter {
  id: string;
  part: number;
  title: {
    ko: string;
    en: string;
  };
  description?: {
    ko: string;
    en: string;
  };
  bullets?: string[];
  xpReward: number;
}

export interface Part {
  id: number;
  title: {
    ko: string;
    en: string;
  };
  subtitle: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  chapters: Chapter[];
}

export const CURRICULUM_DATA: Part[] = [
  {
    id: 1,
    title: { ko: "1단계 수련", en: "Stage 1" },
    subtitle: { ko: "입문", en: "Getting Started" },
    description: {
      ko: "AI와 대화하며 코딩하는 법, 환경 설정부터 첫 대화까지",
      en: "AI coding concepts and Claude Code basics",
    },
    chapters: [
      {
        id: "01",
        part: 1,
        title: { ko: "Chapter 01: AI 코딩이란?", en: "Chapter 01: What is AI Coding?" },
        bullets: [
          "바이브코딩의 개념과 기존 코딩과의 차이점을 이해할 수 있습니다.",
          "AI 코딩 어시스턴트의 역할과 활용 방법을 배울 수 있습니다.",
          "바이브코딩으로 개발 생산성을 높이는 방법을 알 수 있습니다.",
        ],
        xpReward: 50,
      },
      {
        id: "02",
        part: 1,
        title: { ko: "Chapter 02: Claude Code 설치하기", en: "Chapter 02: Installing Claude Code" },
        bullets: [
          "VS Code와 필수 확장 프로그램을 설치할 수 있습니다.",
          "Node.js, npm 등 개발 도구를 설정할 수 있습니다.",
          "Claude Code를 설치하고 API 키를 연동할 수 있습니다.",
        ],
        xpReward: 50,
      },
      {
        id: "03",
        part: 1,
        title: { ko: "Chapter 03: 첫 대화 시작하기", en: "Chapter 03: Starting Your First Conversation" },
        bullets: [
          "Claude Code를 실행하고 기본 인터페이스를 익힐 수 있습니다.",
          "자연어로 코드 생성을 요청하는 방법을 배울 수 있습니다.",
          "Claude의 응답을 이해하고 활용할 수 있습니다.",
        ],
        xpReward: 50,
      },
      {
        id: "04",
        part: 1,
        title: { ko: "Chapter 04: 파일 읽고 쓰기", en: "Chapter 04: Reading and Writing Files" },
        bullets: [
          "터미널/커맨드라인의 기본 개념을 이해할 수 있습니다.",
          "필수 명령어 (ls, cd, mkdir, rm 등)를 익힐 수 있습니다.",
          "Claude와 함께 터미널 명령어를 실행할 수 있습니다.",
        ],
        xpReward: 50,
      },
      {
        id: "05",
        part: 1,
        title: { ko: "Chapter 05: 터미널 명령어", en: "Chapter 05: Terminal Commands" },
        bullets: [
          "디렉토리 구조와 경로의 개념을 이해할 수 있습니다.",
          "파일 및 폴더를 생성, 이동, 복사, 삭제할 수 있습니다.",
          "Claude에게 파일 작업을 요청하는 방법을 배울 수 있습니다.",
        ],
        xpReward: 50,
      },
    ],
  },
  {
    id: 2,
    title: { ko: "2단계 수련", en: "Stage 2" },
    subtitle: { ko: "기초 무공", en: "Core Features" },
    description: {
      ko: "프롬프트 작성, 코드 탐색, Git 관리 등 핵심 기술 익히기",
      en: "Master essential Claude Code capabilities",
    },
    chapters: [
      {
        id: "06",
        part: 2,
        title: { ko: "Chapter 06: 프로젝트 구조 이해", en: "Chapter 06: Understanding Project Structure" },
        bullets: [
          "일반적인 프로젝트 폴더 구조를 파악할 수 있습니다.",
          "package.json, tsconfig 등 설정 파일을 이해할 수 있습니다.",
          "Claude에게 프로젝트 구조 분석을 요청할 수 있습니다.",
        ],
        xpReward: 100,
      },
      {
        id: "07",
        part: 2,
        title: { ko: "Chapter 07: 컨텍스트와 메모리", en: "Chapter 07: Context and Memory" },
        bullets: [
          "Claude의 컨텍스트 윈도우 개념을 이해할 수 있습니다.",
          "효율적인 파일 참조와 컨텍스트 제공 방법을 배울 수 있습니다.",
          "@파일 멘션과 컨텍스트 최적화 기법을 익힐 수 있습니다.",
        ],
        xpReward: 100,
      },
      {
        id: "08",
        part: 2,
        title: { ko: "Chapter 08: 효과적인 프롬프팅", en: "Chapter 08: Effective Prompting" },
        bullets: [
          "명확하고 구체적인 요청 작성법을 배울 수 있습니다.",
          "단계별 지시와 예시 활용 방법을 익힐 수 있습니다.",
          "복잡한 작업을 작은 단위로 분해할 수 있습니다.",
        ],
        xpReward: 100,
      },
      {
        id: "09",
        part: 2,
        title: { ko: "Chapter 09: 코드 탐색하기", en: "Chapter 09: Exploring Code" },
        bullets: [
          "Claude를 활용해 코드베이스를 탐색할 수 있습니다.",
          "함수, 클래스, 변수 정의를 빠르게 찾을 수 있습니다.",
          "코드 의존성과 호출 관계를 분석할 수 있습니다.",
        ],
        xpReward: 100,
      },
      {
        id: "10",
        part: 2,
        title: { ko: "Chapter 10: 코드 편집하기", en: "Chapter 10: Editing Code" },
        bullets: [
          "Claude에게 코드 수정을 효과적으로 요청할 수 있습니다.",
          "diff 형식을 이해하고 변경사항을 검토할 수 있습니다.",
          "여러 파일에 걸친 리팩토링을 수행할 수 있습니다.",
        ],
        xpReward: 100,
      },
      {
        id: "11",
        part: 2,
        title: { ko: "Chapter 11: Git 기초", en: "Chapter 11: Git Basics" },
        bullets: [
          "Git의 기본 개념과 워크플로우를 이해할 수 있습니다.",
          "Claude와 함께 커밋, 브랜치, 머지 작업을 할 수 있습니다.",
          "GitHub 연동 및 Pull Request를 만들 수 있습니다.",
        ],
        xpReward: 100,
      },
    ],
  },
  {
    id: 3,
    title: { ko: "3단계 수련", en: "Stage 3" },
    subtitle: { ko: "실전 수련 I", en: "Practical Projects I" },
    description: {
      ko: "포트폴리오 사이트, 브라우저 게임 등 나만의 프로젝트 만들기",
      en: "Real-world application development",
    },
    chapters: [
      {
        id: "12",
        part: 3,
        title: { ko: "Chapter 12: 프로젝트 메모리", en: "Chapter 12: Project Memory" },
        bullets: [
          "Next.js와 Tailwind CSS로 포트폴리오 구조를 설계할 수 있습니다.",
          "반응형 레이아웃과 컴포넌트를 구현할 수 있습니다.",
          "프로젝트 섹션, 소개 페이지 등 핵심 기능을 완성할 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "13",
        part: 3,
        title: { ko: "Chapter 13: 웹사이트 개발", en: "Chapter 13: Website Development" },
        bullets: [
          "Vercel 계정을 연동하고 프로젝트를 설정할 수 있습니다.",
          "GitHub 연동을 통한 자동 배포를 구성할 수 있습니다.",
          "커스텀 도메인을 연결하고 환경변수를 관리할 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "14",
        part: 3,
        title: { ko: "Chapter 14: 배포하기", en: "Chapter 14: Deployment" },
        bullets: [
          "Supabase 프로젝트를 생성하고 설정할 수 있습니다.",
          "테이블 스키마 설계와 데이터 모델링을 할 수 있습니다.",
          "CRUD 작업과 실시간 구독 기능을 구현할 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "15",
        part: 3,
        title: { ko: "Chapter 15: 데이터 저장", en: "Chapter 15: Data Storage" },
        bullets: [
          "Canvas API 또는 게임 라이브러리 기초를 배울 수 있습니다.",
          "게임 루프와 상태 관리를 구현할 수 있습니다.",
          "사용자 입력 처리와 간단한 물리 엔진을 만들 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "16",
        part: 3,
        title: { ko: "Chapter 16: 미니 게임", en: "Chapter 16: Mini Games" },
        bullets: [
          "React 상태 관리와 사용자 인터랙션을 설계할 수 있습니다.",
          "애니메이션과 트랜지션 효과를 구현할 수 있습니다.",
          "드래그 앤 드롭, 제스처 등 고급 인터랙션을 추가할 수 있습니다.",
        ],
        xpReward: 150,
      },
    ],
  },
  {
    id: 4,
    title: { ko: "4단계 수련", en: "Stage 4" },
    subtitle: { ko: "실전 수련 II", en: "Practical Projects II" },
    description: {
      ko: "CLI 도구, 챗봇, API 서버, 풀스택 앱까지 실무급 개발",
      en: "Production-level applications",
    },
    chapters: [
      {
        id: "17",
        part: 4,
        title: { ko: "Chapter 17: CLI 도구 만들기", en: "Chapter 17: Building CLI Tools" },
        bullets: [
          "Node.js로 커맨드라인 인터페이스를 설계할 수 있습니다.",
          "인자 파싱과 옵션 처리를 구현할 수 있습니다.",
          "npm 패키지로 배포하고 글로벌 설치할 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "18",
        part: 4,
        title: { ko: "Chapter 18: 챗봇 만들기", en: "Chapter 18: Building Chatbots" },
        bullets: [
          "Discord/Slack API와 봇 계정을 설정할 수 있습니다.",
          "메시지 수신 및 응답 로직을 구현할 수 있습니다.",
          "슬래시 명령어와 인터랙티브 기능을 추가할 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "19",
        part: 4,
        title: { ko: "Chapter 19: 백엔드 기초", en: "Chapter 19: Backend Basics" },
        bullets: [
          "RESTful API 설계 원칙과 패턴을 이해할 수 있습니다.",
          "Express/Next.js API 라우트를 구현할 수 있습니다.",
          "에러 처리, 검증, 문서화 방법을 배울 수 있습니다.",
        ],
        xpReward: 150,
      },
      {
        id: "20",
        part: 4,
        title: { ko: "Chapter 20: 풀스택 앱 완성하기", en: "Chapter 20: Completing Full-Stack Apps" },
        bullets: [
          "사용자 인증 시스템을 설계하고 구현할 수 있습니다.",
          "세션, JWT, OAuth 방식을 이해하고 적용할 수 있습니다.",
          "보안 베스트 프랙티스와 권한 관리를 구현할 수 있습니다.",
        ],
        xpReward: 200,
      },
    ],
  },
  {
    id: 5,
    title: { ko: "5단계 수련", en: "Stage 5" },
    subtitle: { ko: "고급 비기", en: "Advanced Usage" },
    description: {
      ko: "훅, 커스텀 에이전트, CI/CD 등 프로처럼 Claude Code 다루기",
      en: "Expert-level Claude Code mastery",
    },
    chapters: [
      {
        id: "21",
        part: 5,
        title: { ko: "Chapter 21: 아키텍처 이해", en: "Chapter 21: Understanding Architecture" },
        bullets: [
          "대규모 애플리케이션 아키텍처 패턴을 이해할 수 있습니다.",
          "마이크로서비스와 모놀리식 구조를 비교할 수 있습니다.",
          "Claude와 함께 아키텍처 다이어그램을 분석할 수 있습니다.",
        ],
        xpReward: 200,
      },
      {
        id: "22",
        part: 5,
        title: { ko: "Chapter 22: 설정 심화", en: "Chapter 22: Advanced Configuration" },
        bullets: [
          "Claude Code 설정 파일을 심화 학습할 수 있습니다.",
          "프로젝트별 커스텀 설정을 구성할 수 있습니다.",
          "환경별 설정 분리와 비밀을 관리할 수 있습니다.",
        ],
        xpReward: 200,
      },
      {
        id: "23",
        part: 5,
        title: { ko: "Chapter 23: Hooks & Commands", en: "Chapter 23: Hooks & Commands" },
        bullets: [
          "Claude Code 훅 시스템을 이해할 수 있습니다.",
          "사전/사후 실행 훅을 구성할 수 있습니다.",
          "반복 작업을 위한 커스텀 명령어를 만들 수 있습니다.",
        ],
        xpReward: 200,
      },
      {
        id: "24",
        part: 5,
        title: { ko: "Chapter 24: Agents & Skills", en: "Chapter 24: Agents & Skills" },
        bullets: [
          "에이전트 기반 개발 패러다임을 이해할 수 있습니다.",
          "특정 도메인에 최적화된 에이전트를 설정할 수 있습니다.",
          "멀티 에이전트 워크플로우를 구성할 수 있습니다.",
        ],
        xpReward: 200,
      },
      {
        id: "25",
        part: 5,
        title: { ko: "Chapter 25: MCP 연동", en: "Chapter 25: MCP Integration" },
        bullets: [
          "Claude Code 스킬 시스템을 이해할 수 있습니다.",
          "커스텀 스킬을 개발하고 등록할 수 있습니다.",
          "MCP 서버 연동으로 기능을 확장할 수 있습니다.",
        ],
        xpReward: 200,
      },
      {
        id: "26",
        part: 5,
        title: { ko: "Chapter 26: CI/CD 자동화", en: "Chapter 26: CI/CD Automation" },
        bullets: [
          "GitHub Actions 기반 CI/CD를 구성할 수 있습니다.",
          "자동 테스트와 린트 검사를 설정할 수 있습니다.",
          "스테이징/프로덕션 배포를 자동화할 수 있습니다.",
        ],
        xpReward: 200,
      },
      {
        id: "27",
        part: 5,
        title: { ko: "Chapter 27: 팀 협업", en: "Chapter 27: Team Collaboration" },
        bullets: [
          "Claude Code를 활용한 코드 리뷰 프로세스를 구축할 수 있습니다.",
          "브랜치 전략과 PR 워크플로우를 최적화할 수 있습니다.",
          "문서화와 지식 공유를 자동화할 수 있습니다.",
        ],
        xpReward: 200,
      },
    ],
  },
  {
    id: 6,
    title: { ko: "6단계 수련", en: "Stage 6" },
    subtitle: { ko: "Web3 무림", en: "Web3 Development" },
    description: {
      ko: "지갑 연동, NFT, 스마트 컨트랙트로 온체인 세계 입문",
      en: "Blockchain and decentralized app development",
    },
    chapters: [
      {
        id: "28",
        part: 6,
        title: { ko: "Chapter 28: Web3 기초", en: "Chapter 28: Web3 Basics" },
        bullets: [
          "Web3 지갑 (MetaMask, Coinbase)을 연동할 수 있습니다.",
          "토큰 잔액 조회와 전송 기능을 구현할 수 있습니다.",
          "NFT 메타데이터 조회와 갤러리를 만들 수 있습니다.",
        ],
        xpReward: 250,
      },
      {
        id: "29",
        part: 6,
        title: { ko: "Chapter 29: Farcaster Frames", en: "Chapter 29: Farcaster Frames" },
        bullets: [
          "Farcaster 프로토콜과 Frames 개념을 이해할 수 있습니다.",
          "인터랙티브 Frame 앱을 설계하고 구현할 수 있습니다.",
          "Frame 액션과 상태 관리를 구현할 수 있습니다.",
        ],
        xpReward: 250,
      },
      {
        id: "30",
        part: 6,
        title: { ko: "Chapter 30: Base 스마트 컨트랙트", en: "Chapter 30: Base Smart Contracts" },
        bullets: [
          "Solidity 기초와 스마트 컨트랙트 개념을 배울 수 있습니다.",
          "Base 네트워크에 컨트랙트를 배포할 수 있습니다.",
          "프론트엔드와 컨트랙트를 연동할 수 있습니다.",
        ],
        xpReward: 250,
      },
    ],
  },
];

export function getAllChapters(): Chapter[] {
  return CURRICULUM_DATA.flatMap((part) => part.chapters);
}

export function getChapterById(id: string): Chapter | undefined {
  return getAllChapters().find((chapter) => chapter.id === id);
}

export function getPartById(id: number): Part | undefined {
  return CURRICULUM_DATA.find((part) => part.id === id);
}

export function getTotalXP(): number {
  return getAllChapters().reduce((sum, chapter) => sum + chapter.xpReward, 0);
}

export function getPartChapterIds(partNum: number): string[] {
  const part = getPartById(partNum);
  return part ? part.chapters.map((ch) => ch.id) : [];
}
