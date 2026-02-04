# VibeDojo

AI와 함께 코딩을 배우는 학습 커뮤니티 플랫폼

## Overview

VibeDojo는 [Vibecoding Curriculum](https://github.com/vibedojo-by-hashed/VibecodingCurriculum)을 기반으로 한 학습 커뮤니티 플랫폼입니다. Claude Code를 활용한 바이브코딩으로 완전 초보부터 Web3 개발자까지 성장할 수 있습니다.

### Features

- 📚 **30챕터 커리큘럼** - 체계적인 단계별 학습
- 👥 **커뮤니티** - 질문, 토론, 프로젝트 공유
- 🎮 **게이미피케이션** - XP, 레벨, 뱃지로 재미있게 학습
- 🌍 **다국어 지원** - 한국어 / English
- 🚀 **원클릭 실습** - GitHub Codespaces 지원

---

## 🗺️ 학습 로드맵

### 당신에게 맞는 트랙을 선택하세요

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         🥋 VibeDojo 학습 여정                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🟢 30일 기초 트랙 (Foundation)                                          │
│  ├── Part 1: 시작하기 (Ch 1-5)     ⏱️ ~5시간                             │
│  └── Part 2: 핵심기술 (Ch 6-10)    ⏱️ ~8시간                             │
│      └─→ 🎯 도달점: AI와 대화하며 기본 코드 수정 가능                      │
│                                                                         │
│  🟡 60일 중급 트랙 (Builder)                                             │
│  ├── 30일 기초 트랙 포함                                                 │
│  ├── Part 3: 실전 프로젝트1 (Ch 11-16)  ⏱️ ~12시간                       │
│  └── Part 4: 실전 프로젝트2 (Ch 17-20)  ⏱️ ~10시간                       │
│      └─→ 🎯 도달점: 풀스택 웹앱을 혼자 만들고 배포 가능                    │
│                                                                         │
│  🔴 90일 마스터 트랙 (Master)                                            │
│  ├── 60일 중급 트랙 포함                                                 │
│  ├── Part 5: 고급 기술 (Ch 21-27)     ⏱️ ~15시간                         │
│  └── Part 6: Web3 개발 (Ch 28-30)     ⏱️ ~10시간                         │
│      └─→ 🎯 도달점: Claude Code 완전 정복 + Web3 dApp 개발 가능           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 트랙별 상세 정보

| 트랙 | 챕터 | 예상 기간 | 총 학습 시간 | 대상 |
|------|------|----------|-------------|------|
| 🟢 **30일 기초** | Ch 1-10 | 4주 | ~13시간 | 코딩 완전 초보, AI 코딩 입문자 |
| 🟡 **60일 중급** | Ch 1-20 | 8주 | ~35시간 | 실제 프로젝트를 만들고 싶은 사람 |
| 🔴 **90일 마스터** | Ch 1-30 | 12주 | ~60시간 | 프로 개발자 수준을 원하는 사람 |

### 파트별 커리큘럼 맵

```
Week 1-2        Week 3-4        Week 5-6        Week 7-8        Week 9-10       Week 11-12
   │               │               │               │               │               │
   ▼               ▼               ▼               ▼               ▼               ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Part 1  │──▶│  Part 2  │──▶│  Part 3  │──▶│  Part 4  │──▶│  Part 5  │──▶│  Part 6  │
│ 시작하기 │   │ 핵심기술 │   │ 실전 1   │   │ 실전 2   │   │ 고급    │   │ Web3    │
│ Ch 1-5   │   │ Ch 6-10  │   │ Ch 11-16 │   │ Ch 17-20 │   │ Ch 21-27│   │ Ch 28-30│
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
     │               │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼               ▼
  설치/대화       파일/코드       Git/배포        백엔드/DB       아키텍처       지갑/NFT
  터미널 기초     프롬프팅        웹사이트        챗봇/API        자동화         스마트컨트랙트
                                  게임            풀스택          협업           Farcaster
```

### 🏆 수료 인증서

각 트랙 완료 시 VibeDojo 공식 수료 인증서가 발급됩니다!

- **30일 기초 트랙** → 🟢 Foundation Certificate
- **60일 중급 트랙** → 🟡 Builder Certificate  
- **90일 마스터 트랙** → 🔴 Master Certificate

[인증서 미리보기 →](./templates/certificate/)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Realtime)
- **i18n**: next-intl
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/vibedojo-by-hashed/vibedojo.git
cd vibedojo
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up Supabase

- Create a new project at [supabase.com](https://supabase.com)
- Run the migration: Copy contents of `supabase/migrations/001_initial_schema.sql` to SQL Editor
- Run the seed data: Copy contents of `supabase/seed.sql` to SQL Editor
- Enable Authentication providers (GitHub, Google, Email)

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (main)/            # Protected pages (dashboard, curriculum)
│   └── auth/callback/     # OAuth callback
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── gamification/     # XP, level, badge components
├── lib/
│   ├── supabase/         # Supabase client setup
│   ├── curriculum-data.ts
│   └── gamification.ts
├── messages/              # i18n translations
│   ├── ko.json
│   └── en.json
└── middleware.ts          # Auth middleware
```

## Supabase Setup

### Authentication Providers

1. **GitHub**: Settings > Authentication > Providers > GitHub
2. **Google**: Settings > Authentication > Providers > Google
3. **Email**: Enabled by default

### Database

Run migrations in order from `supabase/migrations/`

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## License

MIT
