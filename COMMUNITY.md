# 🥋 VibeDojo 커뮤니티 가이드

VibeDojo 커뮤니티에 오신 것을 환영합니다! 함께 성장하고, 배움을 나누며, 멋진 프로젝트를 만들어봐요.

## 📍 커뮤니티 채널

- **Discord**: [VibeDojo Discord](https://discord.gg/vibedojo)
- **GitHub Discussions**: [vibedojo-dev/discussions](https://github.com/seojoonkim/vibedojo-dev/discussions)

---

## 🔥 스트릭 시스템

### 스트릭이란?
매일 학습을 완료하면 스트릭(연속 학습일)이 쌓입니다. 스트릭은 꾸준한 학습 습관을 만들어주는 핵심 동기부여 시스템입니다.

### 스트릭 공유하기

학습 스트릭을 Discord에 공유하고 동료들과 함께 성장하세요!

1. **웹앱에서 공유 버튼 클릭**
   - 퀴즈 완료 시 나타나는 🎉 축하 모달에서 "Discord에 공유" 버튼 클릭
   - 또는 대시보드에서 스트릭 카드의 공유 아이콘 클릭

2. **Discord 채널**
   - `#streak-sharing` 채널에 자동으로 공유됩니다
   - 7일 스트릭마다 특별 축하 메시지! 🔥

3. **스트릭 뱃지**
   - 7일 연속: 🔥 Fire Starter
   - 30일 연속: 💪 Consistency King
   - 90일 연속: 🏆 Master of Discipline

### Discord 연동하기

1. VibeDojo 웹앱에서 "Discord 연결" 버튼 클릭
2. 발급된 6자리 코드를 Discord `#link-account` 채널에 입력
3. 연동 완료! 이제 스트릭이 자동으로 공유됩니다

> **기술 구조**: `discord_link_codes` 테이블 (Supabase)과 Railway 배포된 Discord 봇이 실시간 연동됩니다.

---

## 🏆 프로젝트 쇼케이스

### 참여 방법

VibeDojo에서 만든 프로젝트를 쇼케이스에 공유하고 피드백을 받아보세요!

1. **프로젝트 준비**
   - README.md 작성 (무엇을, 왜, 어떻게 만들었는지)
   - 스크린샷 또는 데모 GIF 추가
   - 라이브 URL (Vercel, Netlify 등)

2. **제출하기**
   - [`showcase/` 폴더](./showcase/)에 PR 생성
   - 또는 Discord `#project-showcase` 채널에 공유

3. **피드백 받기**
   - 커뮤니티 멤버들의 리뷰와 제안
   - 우수 프로젝트는 메인 페이지 갤러리에 노출!

### 쇼케이스 카테고리

- 🟢 **Foundation Projects**: 30일 트랙 프로젝트 (CLI, 스크립트)
- 🟡 **Builder Projects**: 60일 트랙 프로젝트 (웹앱, API)
- 🔴 **Master Projects**: 90일 트랙 프로젝트 (에이전트, dApp)

---

## 📅 주간 챌린지

매주 새로운 미니 챌린지가 출제됩니다!

### 챌린지 참여 방법

1. **매주 월요일**: Discord `#weekly-challenge`에 새 챌린지 공개
2. **일주일 동안**: 자유롭게 구현
3. **일요일까지**: PR 또는 Discord에 결과물 제출
4. **우수작 선정**: 커뮤니티 투표로 주간 MVP 선정 🎖️

### 챌린지 난이도

| 레벨 | 대상 | 예상 시간 |
|-----|------|----------|
| ⭐ Easy | 30일 트랙 학습자 | 30분-1시간 |
| ⭐⭐ Medium | 60일 트랙 학습자 | 1-2시간 |
| ⭐⭐⭐ Hard | 90일 트랙 학습자 | 2-4시간 |

### 보상

- 🏅 주간 MVP: 프로필 뱃지 + 보너스 XP
- 📌 Hall of Fame: 우수작 갤러리 영구 전시
- 🎁 월간 총 MVP: 특별 보상 (상품권, 굿즈 등)

---

## 💬 커뮤니티 가이드라인

### Do's ✅
- 질문하기 전에 검색 먼저
- 코드 공유 시 마크다운 코드블록 사용
- 긍정적이고 건설적인 피드백
- 초보자에게 친절하게
- 학습 경험 적극 공유

### Don'ts ❌
- 스팸, 광고, 홍보
- 무례하거나 공격적인 언행
- 개인정보 공유 요청
- 과도한 자기 홍보

---

## 🔗 Discord 웹훅 연동 (개발자용)

VibeDojo는 Discord 웹훅을 통해 실시간 이벤트를 전송합니다.

### 현재 연동된 이벤트

| 이벤트 | 채널 | 설명 |
|-------|------|------|
| 스트릭 달성 | `#streak-sharing` | 스트릭 7일, 30일, 90일 달성 시 |
| 퀴즈 만점 | `#achievements` | 챕터 퀴즈 100% 완료 시 |
| 챕터 완료 | `#progress` | 챕터 학습 완료 시 |
| 프로젝트 제출 | `#project-showcase` | 쇼케이스 PR 생성 시 |

### 구현 참고

```typescript
// src/lib/streak.ts - 스트릭 시스템 핵심 로직
// 기존 코드 활용하여 Discord 웹훅 트리거 가능

import { sendDiscordWebhook } from '@/lib/discord';

// 스트릭 달성 시 자동 공유
if (newStreak % 7 === 0) {
  await sendDiscordWebhook('streak-sharing', {
    content: `🔥 ${username}님이 ${newStreak}일 연속 학습 달성!`
  });
}
```

### 환경 변수

```bash
DISCORD_WEBHOOK_STREAK=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_ACHIEVEMENTS=https://discord.com/api/webhooks/...
```

---

## 🤝 기여하기

VibeDojo는 오픈소스입니다! 기여를 환영합니다.

- **버그 리포트**: GitHub Issues
- **기능 제안**: GitHub Discussions
- **문서 개선**: PR 환영
- **번역**: `messages/` 폴더에 새 언어 추가

---

## 📞 문의

- **일반 문의**: Discord `#general`
- **기술 지원**: Discord `#help`
- **제휴/협업**: [contact@vibedojo.com](mailto:contact@vibedojo.com)

---

*함께 배우고, 함께 성장합시다! 🥋*
