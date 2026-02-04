# Part 1 FAQ: 시작하기

Chapter 1-5에서 자주 발생하는 문제들입니다.

---

## 설치 관련

### Q: "command not found: claude" 에러가 나요

**원인:** Claude Code가 설치되지 않았거나 PATH에 없음

**해결:**
```bash
# 1. Node.js 설치 확인
node --version  # 20.x 이상 필요

# 2. Claude Code 설치
npm install -g @anthropic-ai/claude-code

# 3. 터미널 재시작 또는
source ~/.bashrc  # Linux/Mac
# 또는
source ~/.zshrc   # Mac (zsh 사용 시)
```

### Q: npm 권한 에러가 나요

```
EACCES: permission denied
```

**해결 방법 1:** sudo 사용 (권장하지 않음)
```bash
sudo npm install -g @anthropic-ai/claude-code
```

**해결 방법 2:** npm 권한 설정 (권장)
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @anthropic-ai/claude-code
```

### Q: Node.js 버전이 너무 낮아요

**해결:** nvm으로 최신 버전 설치
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 새 터미널 열고
nvm install 20
nvm use 20
node --version  # v20.x.x 확인
```

---

## API 키 관련

### Q: API 키를 어디서 얻나요?

1. [Anthropic Console](https://console.anthropic.com) 접속
2. 로그인/회원가입
3. API Keys 메뉴
4. Create Key 클릭
5. 키 복사 (한 번만 보여줌!)

### Q: API 키 설정은 어떻게 하나요?

**방법 1:** 환경변수 (권장)
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# 적용
source ~/.bashrc
```

**방법 2:** Claude Code 명령어
```bash
claude config set apiKey "sk-ant-your-key-here"
```

### Q: "Invalid API key" 에러

**체크리스트:**
- [ ] 키가 `sk-ant-`로 시작하는가?
- [ ] 키를 복사할 때 공백이 포함되지 않았는가?
- [ ] 환경변수가 제대로 설정되었는가?

```bash
# 환경변수 확인
echo $ANTHROPIC_API_KEY
```

### Q: API 비용이 걱정돼요

**팁:**
1. 처음엔 작은 요청으로 연습
2. 모호한 요청 피하기 (API 왕복 증가)
3. `/compact`로 컨텍스트 관리
4. 월 사용량 확인: [Anthropic Console](https://console.anthropic.com)

---

## 기본 사용 관련

### Q: Claude가 한국어를 못 알아들어요

**해결:** CLAUDE.md에 언어 설정
```markdown
# CLAUDE.md
## 언어
- 모든 응답은 한국어로
- 코드 주석도 한국어로
```

### Q: Claude가 엉뚱한 파일을 수정해요

**원인:** 요청이 모호함

**해결:** 구체적으로 요청
```
# 나쁜 예
> 설정 파일 수정해줘

# 좋은 예
> tsconfig.json의 strict를 true로 변경해줘
```

### Q: Claude가 중간에 멈춰요

**가능한 원인:**
1. 네트워크 문제
2. 요청이 너무 복잡함
3. API 타임아웃

**해결:**
- 인터넷 연결 확인
- 작은 요청으로 나누기
- 잠시 후 다시 시도

### Q: 실행 취소하고 싶어요

Claude가 잘못 수정했을 때:
```bash
# Git 사용 중이라면
git diff  # 변경 사항 확인
git checkout -- .  # 모든 변경 취소

# 또는 특정 파일만
git checkout -- filename.js
```

**팁:** 작업 전에 항상 커밋해두세요!

---

## 터미널 관련

### Q: 터미널이 뭔가요?

**터미널 = 컴퓨터와 텍스트로 대화하는 창**

- **Mac:** Terminal 앱 또는 iTerm2
- **Windows:** PowerShell 또는 Windows Terminal
- **VS Code:** 내장 터미널 (Ctrl+`)

### Q: cd 명령어가 안 돼요

```bash
# 폴더 이름에 공백이 있으면 따옴표 사용
cd "My Project"

# 또는 백슬래시로 이스케이프
cd My\ Project
```

### Q: 현재 폴더가 어디인지 모르겠어요

```bash
# 현재 위치 확인
pwd

# 폴더 내용 확인
ls        # Mac/Linux
dir       # Windows
```

---

## VS Code 관련

### Q: Claude Code를 VS Code에서 쓰고 싶어요

VS Code 터미널에서 바로 사용 가능:
1. VS Code 열기
2. Ctrl+` (터미널 열기)
3. `claude` 입력

### Q: 파일 변경이 안 보여요

VS Code가 외부 변경을 감지 못할 때:
- Cmd+Shift+P (Mac) / Ctrl+Shift+P (Windows)
- "Reload Window" 검색 후 실행

---

## 💡 팁

### 도움말 보기

```bash
claude --help
claude config --help
```

### 버전 확인

```bash
claude --version
```

### 설정 초기화

```bash
claude config reset
```

---

## 🆘 여전히 안 되면?

디스코드에서 다음 정보와 함께 질문해주세요:
1. 운영체제 (Mac/Windows/Linux)
2. Node.js 버전 (`node --version`)
3. 에러 메시지 전체
4. 어떤 명령어를 실행했는지

[![Discord](https://img.shields.io/badge/Discord-질문하기-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/TxbJ56hS94)
