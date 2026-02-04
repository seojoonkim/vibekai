# Part 5 FAQ: 고급 기능

Chapter 21-27에서 자주 발생하는 문제들입니다.

---

## CLAUDE.md 관련

### Q: CLAUDE.md가 적용이 안 돼요

**체크리스트:**
- [ ] 파일 이름이 정확히 `CLAUDE.md`인가? (대소문자 주의)
- [ ] 프로젝트 루트에 있는가?
- [ ] 마크다운 문법이 올바른가?

```bash
# 확인
ls -la | grep CLAUDE
cat CLAUDE.md
```

### Q: CLAUDE.md가 너무 길어져요

**해결:** 핵심만 남기기
- 필수 규칙만 포함
- 상세 내용은 다른 문서로 분리
- `/docs` 폴더에 참조 문서 작성

```markdown
# CLAUDE.md (간결하게)

## 필수 규칙
- TypeScript 사용
- 함수형 컴포넌트
- 한국어 주석

## 상세 문서
- 코딩 컨벤션: docs/conventions.md
- API 문서: docs/api.md
```

---

## Commands 관련

### Q: /command가 실행이 안 돼요

**확인 사항:**
1. 파일 위치: `.claude/commands/`
2. 파일 확장자: `.md`
3. 파일 이름: 슬래시 없이 (예: `review.md`)

```bash
# 구조 확인
tree .claude/
# .claude/
# └── commands/
#     └── review.md
```

### Q: Command에서 변수를 쓰고 싶어요

**$ARGUMENTS 사용:**
```markdown
<!-- .claude/commands/issue-start.md -->
# 이슈 시작

이슈 번호: $ARGUMENTS

$(gh issue view $ARGUMENTS)
```

```bash
> /issue-start 42
# $ARGUMENTS가 42로 치환됨
```

### Q: 쉘 명령어 결과를 포함하고 싶어요

**$() 문법 사용:**
```markdown
현재 브랜치: $(git branch --show-current)
변경된 파일: $(git diff --name-only)
```

---

## Hooks 관련

### Q: Hook이 실행되지 않아요

**체크리스트:**
- [ ] settings.json 문법이 올바른가?
- [ ] 명령어가 실행 가능한가?
- [ ] 권한이 있는가?

```json
// .claude/settings.json
{
  "hooks": {
    "preCommit": "npm run lint"
  }
}
```

```bash
# 명령어 직접 테스트
npm run lint
```

### Q: Hook에서 에러가 나면 어떻게 되나요?

- Hook이 실패하면 (exit code ≠ 0) 작업이 중단됩니다
- 에러 메시지가 표시됩니다

**디버깅:**
```bash
# 명령어 직접 실행해서 에러 확인
npm run lint
echo $?  # 0이 아니면 실패
```

### Q: Hook을 건너뛰고 싶어요

```bash
# Git hook의 경우
git commit --no-verify -m "message"
```

⚠️ 남용하지 마세요. CI에서 실패할 수 있습니다.

---

## MCP 관련

### Q: MCP 서버 연결이 안 돼요

**체크리스트:**
- [ ] MCP 서버가 실행 중인가?
- [ ] URL이 올바른가?
- [ ] 방화벽/네트워크 문제는 없는가?

```bash
# 연결 테스트
curl http://localhost:3001/health
```

### Q: MCP 도구가 보이지 않아요

**설정 확인:**
```json
// .claude/settings.json
{
  "mcp": {
    "servers": [
      {
        "name": "my-mcp",
        "url": "http://localhost:3001"
      }
    ]
  }
}
```

**Claude에서 확인:**
```
> /mcp list
```

---

## CI/CD 관련

### Q: GitHub Actions가 실패해요

**디버깅 순서:**
1. Actions 탭에서 실패한 워크플로우 확인
2. 로그에서 에러 메시지 찾기
3. 로컬에서 같은 명령어 실행

```bash
# 로컬에서 테스트
npm run lint
npm run build
npm test
```

### Q: 환경변수가 CI에서 안 돼요

**GitHub Secrets 설정:**
1. Repository > Settings > Secrets
2. "New repository secret"
3. 이름과 값 입력

```yaml
# .github/workflows/ci.yml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### Q: 배포가 자동으로 안 돼요

**Vercel 자동 배포 설정:**
1. Vercel 대시보드 > Project Settings
2. Git Integration 확인
3. Production Branch 설정

**수동 배포:**
```bash
vercel --prod
```

---

## 팀 협업 관련

### Q: .claude 폴더를 커밋해도 되나요?

**예! 커밋해야 합니다.**

단, 민감한 정보는 제외:
```gitignore
# .gitignore
.env
.env.local
*.secret
```

### Q: 팀원마다 설정이 다르면?

**팀 설정과 개인 설정 분리:**
- 팀 설정: `.claude/` (Git에 커밋)
- 개인 설정: `~/.claude/` (커밋 안 함)

개인 설정이 팀 설정을 오버라이드합니다.

### Q: 새 팀원 온보딩은 어떻게?

**온보딩 Command 만들기:**
```markdown
<!-- .claude/commands/onboarding.md -->
# 온보딩

1. 저장소 클론
2. npm install
3. 환경변수 설정 (.env.example 참고)
4. npm run dev

문의: #frontend-dev (Slack)
```

```
> /onboarding
```

---

## 성능 관련

### Q: Claude가 너무 느려요

**원인과 해결:**

| 원인 | 해결 |
|------|------|
| 모호한 요청 | 구체적으로 요청 |
| 긴 컨텍스트 | `/compact` 사용 |
| 큰 파일 처리 | 파일 범위 지정 |
| 네트워크 | 인터넷 확인 |

### Q: API 비용이 많이 나와요

**비용 절감 팁:**
1. 구체적으로 요청 (왕복 감소)
2. 계획 단계에서는 opus, 구현에서는 sonnet
3. `/compact`로 컨텍스트 관리
4. 불필요한 파일 제외 (excludePatterns)

```json
{
  "context": {
    "excludePatterns": [
      "node_modules/**",
      "dist/**",
      "*.log"
    ]
  }
}
```

---

## 보안 관련

### Q: 권한 설정은 어떻게 하나요?

```json
// .claude/settings.json
{
  "permissions": {
    "autoApprove": ["Read", "Glob", "Grep"],
    "deny": ["Bash(rm -rf *)"]
  }
}
```

### Q: 민감한 파일을 보호하고 싶어요

```json
{
  "context": {
    "excludePatterns": [
      ".env*",
      "*.secret",
      "credentials/*"
    ]
  }
}
```

---

## 디버깅 팁

### 설정 확인

```bash
# 현재 설정 보기
cat .claude/settings.json

# 설정이 적용되었는지 확인
claude config show
```

### 로그 확인

```bash
# 상세 로그 활성화
claude --verbose
```

### 초기화

문제가 심각하면:
```bash
# Claude Code 설정 초기화
claude config reset

# 캐시 삭제
rm -rf ~/.claude/cache
```

---

## 🆘 여전히 안 되면?

디스코드에서 다음 정보와 함께 질문해주세요:
1. 사용 중인 기능 (CLAUDE.md, Commands, MCP 등)
2. 설정 파일 내용
3. 에러 메시지 전체
4. 예상했던 동작 vs 실제 동작

[![Discord](https://img.shields.io/badge/Discord-질문하기-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/TxbJ56hS94)
