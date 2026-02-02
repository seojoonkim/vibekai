# OpenClaw Launch Gate Test Prompt

## 목표
VibeDojo staging 환경에서 런칭 게이트(L0 + L1) 자동 판정

## 산출물
1. PASS/FAIL 표 (6개 체크)
2. 실패 항목의 재현 절차
3. 모바일 스크린샷 1장
4. 실패 시 네트워크 로그 요약 (마지막 20줄)

---

## 환경 설정

```
BASE_URL=https://staging.vibedojo.com
TEST_EMAIL=test@vibedojo.com
TEST_PASSWORD=<테스트 계정 비밀번호>
```

---

## L0: API Gate (90초, 브라우저 불필요)

### L0-1: Streak Idempotency
```bash
# 로그인 후 쿠키 저장
curl -X POST "$BASE_URL/api/streak" -H "Cookie: $SESSION_COOKIE" -o r1.json
curl -X POST "$BASE_URL/api/streak" -H "Cookie: $SESSION_COOKIE" -o r2.json
curl -X POST "$BASE_URL/api/streak" -H "Cookie: $SESSION_COOKIE" -o r3.json

# 검증: isNewDay가 최대 1번만 true
jq '.isNewDay' r1.json r2.json r3.json | grep -c true  # should be <= 1

# 검증: currentStreak 값이 모두 동일
jq '.currentStreak' r1.json r2.json r3.json | uniq | wc -l  # should be 1
```
**PASS 기준**: isNewDay true 1회 이하, currentStreak 일관성

### L0-2: Streak GET/POST Consistency
```bash
curl -X POST "$BASE_URL/api/streak" -H "Cookie: $SESSION_COOKIE" -o post.json
curl -X GET "$BASE_URL/api/streak" -H "Cookie: $SESSION_COOKIE" -o get.json

# 검증
diff <(jq '.currentStreak, .longestStreak' post.json) <(jq '.currentStreak, .longestStreak' get.json)
```
**PASS 기준**: diff 결과 없음 (값 동일)

### L0-3: Quiz Perfect Dedupe
```bash
curl "$BASE_URL/api/debug/xp-logs?action=quiz_perfect&referenceId=01" \
  -H "Cookie: $SESSION_COOKIE" -o dedupe.json

jq '.count' dedupe.json  # should be 0 or 1, never > 1
```
**PASS 기준**: count <= 1

### L0-4: Debug Endpoint Security (Production)
```bash
# Production에서는 403이어야 함
curl -I "$BASE_URL/api/debug/xp-logs?action=test"
# Expected: HTTP 403 Forbidden
```
**PASS 기준**: Production에서 403, Staging에서 200/401

---

## L1: Browser Gate (10분)

### L1-1: Dashboard F5 x3 (Check 2)
```
1. /dashboard 이동
2. 스트릭 숫자 기록 (예: "3일 연속")
3. F5 새로고침 3회
4. 스트릭 숫자 확인
```
**PASS 기준**: 숫자 변동 없음

### L1-2: Chapter Complete → Dashboard (Check 3)
```
1. /dashboard에서 초기 스트릭 기록
2. /curriculum/01 이동 (또는 미완료 챕터)
3. 퀴즈 통과 → 별점 → 완료
4. /dashboard 이동
5. 스트릭 확인 (최대 +1)
6. F5 한번 더 → 숫자 그대로
```
**PASS 기준**: 완료 시 +1 (또는 동일), 재방문 시 변동 없음

### L1-3: Celebration → Community (Check 5)
```
1. 챕터 완료 후 celebration modal 확인
2. "커뮤니티에서 보기 →" 버튼 클릭
3. /community 렌더링 확인
4. 뒤로가기
5. 에러 없이 이전 페이지 복원
```
**PASS 기준**: 네비게이션 에러 없음, 500 페이지 없음

### L1-4: Mobile Heatmap (Check 6)
```
1. 뷰포트: 393x852 (iPhone 14 Pro)
2. /dashboard 이동
3. 확인:
   - 가로 스크롤 없음
   - 스트릭 카운터 보임
   - 범례 "적음~많음" 보임
4. 스크린샷 저장
```
**PASS 기준**: UI 깨짐 없음

---

## 결과 리포트 템플릿

```markdown
# VibeDojo Launch Gate Report

**환경**: staging.vibedojo.com
**일시**: 2026-02-02 15:30 KST
**테스터**: OpenClaw Bot

## 결과 요약

| Check | 항목 | 결과 | 비고 |
|-------|------|------|------|
| L0-1 | Streak Idempotency | ✅ PASS | isNewDay: 0회 true |
| L0-2 | GET/POST Consistency | ✅ PASS | streak=5 |
| L0-3 | Quiz Perfect Dedupe | ✅ PASS | count=1 |
| L0-4 | Debug Endpoint Security | ✅ PASS | 403 on prod |
| L1-1 | Dashboard F5x3 | ✅ PASS | 5일 → 5일 |
| L1-2 | Chapter → Dashboard | ✅ PASS | +1 정상 |
| L1-3 | Community Navigation | ✅ PASS | 에러 없음 |
| L1-4 | Mobile Heatmap | ✅ PASS | 스크린샷 첨부 |

## 최종 판정: ✅ GO

## 첨부
- [모바일 스크린샷](./screenshots/mobile-dashboard.png)
```

---

## 실패 시 추가 수집 항목

1. **네트워크 로그** (마지막 20줄)
2. **콘솔 에러**
3. **재현 절차** (정확한 클릭 순서)
4. **스크린샷** (실패 시점)

---

## Playwright 실행 (자동화)

```bash
# 전체 실행
npx playwright test e2e/launch-gate*.spec.ts

# L0만 (API)
npx playwright test e2e/launch-gate-api.spec.ts

# L1만 (Browser)
npx playwright test e2e/launch-gate.spec.ts

# 모바일만
npx playwright test e2e/launch-gate.spec.ts --project=mobile
```
