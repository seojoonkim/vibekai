# 🎓 VibeDojo 수료 인증서 템플릿

## 개요

VibeDojo 커리큘럼 수료자를 위한 인증서 템플릿입니다.

## 트랙별 인증서

| 트랙 | 챕터 | 예상 기간 | 인증서 색상 |
|------|------|----------|------------|
| 🟢 30일 기초 트랙 | Ch 1-10 | 30일 | 그린 그라데이션 |
| 🟡 60일 중급 트랙 | Ch 1-20 | 60일 | 핑크 그라데이션 |
| 🔴 90일 마스터 트랙 | Ch 1-30 | 90일 | 퍼플 그라데이션 |

## 사용법

### URL 파라미터

인증서는 URL 파라미터로 커스터마이즈 가능합니다:

```
certificate.html?name=홍길동&date=2026-02-04&track=90&hours=40&uuid=abc123
```

| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `name` | 수료자 이름 | `홍길동` |
| `date` | 수료일 | `2026-02-04` |
| `track` | 트랙 (30/60/90) | `90` |
| `hours` | 총 학습 시간 | `40` |
| `uuid` | 검증 코드 | `a1b2c3d4-...` |

### 로컬 테스트

```bash
# 브라우저에서 직접 열기
open templates/certificate/certificate.html

# 또는 로컬 서버로
npx serve templates/certificate
```

### PDF 저장

1. 브라우저에서 인증서 열기
2. `Cmd/Ctrl + P` 로 인쇄 다이얼로그 열기
3. "Save as PDF" 선택
4. 저장

## 검증 시스템 (향후 구현)

### 구조

```
verification/
├── api/
│   └── verify.ts      # 검증 API 엔드포인트
├── db/
│   └── certificates/  # 발급된 인증서 데이터
└── utils/
    └── generate-uuid.ts
```

### 검증 플로우

```
1. 수료 완료 → UUID 생성
2. DB에 인증서 정보 저장 (이름, 트랙, 날짜, UUID)
3. 인증서 PDF 생성 및 발급
4. 검증 페이지에서 UUID로 조회 가능
```

### 검증 API 예시

```typescript
// GET /api/verify?uuid=abc123
{
  "valid": true,
  "certificate": {
    "name": "홍길동",
    "track": "90일 마스터 트랙",
    "completionDate": "2026-02-04",
    "chaptersCompleted": 30
  }
}
```

## 커스터마이징

### 색상 변경

`certificate.html`의 CSS에서 그라데이션 색상 수정:

```css
/* 30일 트랙 */
.track-30 {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

/* 60일 트랙 */
.track-60 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* 90일 트랙 */
.track-90 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 로고 변경

```html
<div class="logo">
  <span>🥋 VibeDojo</span>
</div>
```

## 라이선스

VibeDojo 커리큘럼의 일부로 MIT 라이선스 적용.
