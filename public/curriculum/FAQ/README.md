# ❓ FAQ - 자주 묻는 질문

Claude Code 학습 중 자주 발생하는 문제와 해결 방법을 정리했습니다.

## 📁 Part별 FAQ

| Part | 내용 | 파일 |
|------|------|------|
| Part 1 | 설치, 기본 사용 | [part1-getting-started.md](./part1-getting-started.md) |
| Part 2 | 프롬프팅, Git | [part2-fundamentals.md](./part2-fundamentals.md) |
| Part 3-4 | 웹/앱 개발 | [part3-4-development.md](./part3-4-development.md) |
| Part 5 | 고급 설정, CI/CD | [part5-advanced.md](./part5-advanced.md) |

## 🔥 가장 흔한 문제 Top 5

### 1. Claude Code가 설치되지 않아요

```bash
# Node.js 버전 확인 (20.x 이상 필요)
node --version

# 설치 명령어
npm install -g @anthropic-ai/claude-code

# 권한 에러 시
sudo npm install -g @anthropic-ai/claude-code
```

### 2. API 키 에러

```
Error: Invalid API key
```

**해결:**
1. API 키가 `sk-ant-`로 시작하는지 확인
2. 환경변수 설정 확인:
   ```bash
   export ANTHROPIC_API_KEY="sk-ant-..."
   ```
3. 또는 `claude config set apiKey "sk-ant-..."`

### 3. Claude가 파일을 못 찾아요

**원인:** 작업 디렉토리가 다름

**해결:**
```bash
# 프로젝트 폴더로 이동 후 실행
cd /path/to/project
claude
```

### 4. 응답이 너무 느려요

**가능한 원인:**
- 큰 파일 처리 중
- 네트워크 문제
- 모호한 요청으로 많은 API 왕복

**해결:**
- 구체적으로 요청하기
- 작은 단위로 나눠서 요청
- `/compact`로 컨텍스트 정리

### 5. 권한 에러 (Permission denied)

```
Permission denied when editing file
```

**해결:**
- `y`를 눌러 승인
- 또는 settings.json에서 autoApprove 설정

## 🆘 문제가 계속되면?

1. **디스코드에서 질문하기**
   [![Discord](https://img.shields.io/badge/Discord-질문하기-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/TxbJ56hS94)

2. **GitHub 이슈 확인**
   - 이미 보고된 문제인지 확인
   - 새 이슈 등록

3. **공식 문서 확인**
   - [Claude Code 문서](https://docs.anthropic.com/en/docs/claude-code)

---

각 Part별 상세 FAQ는 해당 파일을 참조하세요.
