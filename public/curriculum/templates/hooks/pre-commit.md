# Pre-Commit Hook 패턴 모음

커밋 전에 자동으로 실행되는 검사들입니다.

## 기본 패턴

### JavaScript/TypeScript 프로젝트

```json
// .claude/settings.json
{
  "hooks": {
    "preCommit": "npm run lint && npm run typecheck && npm test"
  }
}
```

### 단계별 분리

```json
{
  "hooks": {
    "preCommit": {
      "lint": "npm run lint",
      "typecheck": "npm run typecheck",
      "test": "npm run test:changed"
    }
  }
}
```

## 상세 패턴

### 1. 린트만 검사 (빠름)

```json
{
  "hooks": {
    "preCommit": "npm run lint"
  }
}
```

**언제 사용?**
- 빠른 피드백이 필요할 때
- 테스트가 오래 걸릴 때
- 로컬에서 자주 커밋할 때

### 2. 린트 + 타입 검사

```json
{
  "hooks": {
    "preCommit": "npm run lint && npm run typecheck"
  }
}
```

**언제 사용?**
- TypeScript 프로젝트
- 타입 안정성이 중요할 때

### 3. 전체 검사 (안전함)

```json
{
  "hooks": {
    "preCommit": "npm run lint && npm run typecheck && npm test && npm run build"
  }
}
```

**언제 사용?**
- CI 비용을 줄이고 싶을 때
- 커밋 품질이 매우 중요할 때
- 주의: 시간이 오래 걸림

### 4. 변경된 파일만 검사 (효율적)

```json
{
  "hooks": {
    "preCommit": "npm run lint:staged && npm run test:changed"
  }
}
```

**설정 필요:**
```json
// package.json
{
  "scripts": {
    "lint:staged": "lint-staged",
    "test:changed": "jest --changedSince=HEAD"
  }
}
```

## Python 프로젝트

```json
{
  "hooks": {
    "preCommit": "black . && isort . && pytest"
  }
}
```

## 조건부 실행

```json
{
  "hooks": {
    "preCommit": {
      "command": "npm run lint && npm test",
      "skipOn": ["docs/*", "*.md"]
    }
  }
}
```

문서만 수정했을 때는 검사를 건너뜁니다.

## 커스텀 스크립트

```bash
#!/bin/bash
# scripts/pre-commit.sh

echo "🔍 린트 검사 중..."
npm run lint || exit 1

echo "📝 타입 검사 중..."
npm run typecheck || exit 1

echo "✅ 검사 완료!"
```

```json
{
  "hooks": {
    "preCommit": "bash scripts/pre-commit.sh"
  }
}
```

## 팁

### 검사 건너뛰기 (긴급 시)

```bash
git commit --no-verify -m "hotfix: urgent fix"
```

⚠️ 남용하지 마세요! CI에서 실패할 수 있습니다.

### 실패 시 자동 수정

```json
{
  "hooks": {
    "preCommit": "npm run lint:fix && git add -A"
  }
}
```

린트 에러를 자동으로 수정하고 다시 스테이징합니다.
