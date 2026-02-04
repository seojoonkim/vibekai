# 📚 템플릿 모음

Claude Code 프로젝트를 위한 재사용 가능한 템플릿들입니다.

## 📁 폴더 구조

```
templates/
├── CLAUDE.md/              # CLAUDE.md 템플릿 (프로젝트 타입별)
│   ├── nextjs-app.md       # Next.js 앱 프로젝트
│   ├── react-app.md        # React SPA 프로젝트
│   ├── nodejs-api.md       # Node.js API 서버
│   ├── python-script.md    # Python 스크립트/CLI
│   └── general.md          # 범용 템플릿
│
├── settings/               # settings.json 템플릿
│   ├── solo-developer.json # 1인 개발자용
│   ├── team-strict.json    # 팀 (엄격한 설정)
│   └── team-flexible.json  # 팀 (유연한 설정)
│
├── hooks/                  # Hook 패턴 모음
│   ├── pre-commit.md       # 커밋 전 검사
│   ├── post-save.md        # 파일 저장 후 처리
│   └── pre-push.md         # 푸시 전 검사
│
└── commands/               # 자주 쓰는 Commands
    ├── review.md           # 코드 리뷰
    ├── refactor.md         # 리팩토링
    ├── test-gen.md         # 테스트 생성
    └── docs-gen.md         # 문서 생성
```

## 🚀 사용법

### 1. CLAUDE.md 템플릿 사용

```bash
# Next.js 프로젝트라면
cp templates/CLAUDE.md/nextjs-app.md ./CLAUDE.md

# 수정해서 사용
code CLAUDE.md
```

### 2. settings.json 사용

```bash
# .claude 폴더 생성
mkdir -p .claude

# 템플릿 복사
cp templates/settings/solo-developer.json .claude/settings.json
```

### 3. Commands 추가

```bash
# commands 폴더 생성
mkdir -p .claude/commands

# 원하는 command 복사
cp templates/commands/review.md .claude/commands/
```

## 💡 커스터마이징 팁

각 템플릿에는 `[TODO]` 또는 `<!-- 수정 필요 -->` 주석이 있습니다.
이 부분을 프로젝트에 맞게 수정하세요.

---

자세한 내용은 각 템플릿 파일을 참조하세요.
