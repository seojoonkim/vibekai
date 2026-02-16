-- ============================================
-- Fix: ch02-quiz-mismatch
-- Ch02 title is "Claude Code 설치하기" but quizzes were about Cursor IDE
-- Replace with CLI installation related quizzes
-- ============================================

-- Delete old Cursor IDE quizzes for chapter 02
DELETE FROM public.chapter_quizzes WHERE chapter_id = '02';

-- Insert new CLI installation quizzes
INSERT INTO public.chapter_quizzes (chapter_id, question_ko, options, correct_answer, order_index, explanation_ko)
VALUES
(
  '02',
  'Claude Code를 설치하는 가장 간단한 방법은?',
  '[{"ko": "앱스토어에서 다운로드"}, {"ko": "터미널에서 설치 스크립트 실행"}, {"ko": "웹사이트에서 exe 파일 다운로드"}, {"ko": "이메일로 설치 파일 요청"}, {"ko": "USB로 복사"}]',
  1,
  1,
  '터미널에서 curl 명령어로 설치 스크립트를 다운로드하고 실행하는 것이 가장 간단한 방법입니다. Mac/Linux에서는 curl -fsSL https://claude.ai/install.sh | bash를 사용합니다.'
),
(
  '02',
  'Claude Code 설치 후 버전을 확인하는 명령어는?',
  '[{"ko": "claude version"}, {"ko": "claude --version"}, {"ko": "claude -v"}, {"ko": "claude check"}, {"ko": "claude info"}]',
  1,
  2,
  'claude --version 명령어를 입력하면 설치된 Claude Code의 버전 번호가 출력됩니다. 버전 번호가 나오면 설치가 정상적으로 완료된 것입니다.'
),
(
  '02',
  'GUI와 CLI의 차이점으로 올바른 것은?',
  '[{"ko": "GUI는 느리고 CLI는 빠르다"}, {"ko": "GUI는 마우스 기반, CLI는 텍스트 명령어 기반"}, {"ko": "GUI는 무료, CLI는 유료"}, {"ko": "GUI는 Mac 전용, CLI는 Windows 전용"}, {"ko": "GUI와 CLI는 같은 의미"}]',
  1,
  3,
  'GUI(Graphical User Interface)는 마우스로 클릭하는 그래픽 방식이고, CLI(Command Line Interface)는 텍스트로 명령어를 입력하는 방식입니다.'
),
(
  '02',
  'Claude Code가 웹 버전(claude.ai)과 다른 점은?',
  '[{"ko": "더 비싸다"}, {"ko": "컴퓨터에서 직접 파일을 생성하고 수정할 수 있다"}, {"ko": "영어만 지원한다"}, {"ko": "인터넷 없이도 사용 가능하다"}, {"ko": "모바일에서만 사용 가능하다"}]',
  1,
  4,
  'Claude Code는 터미널에서 실행되며, 웹 버전과 달리 컴퓨터의 파일을 직접 생성, 수정, 삭제할 수 있고 터미널 명령어도 실행할 수 있습니다.'
),
(
  '02',
  '설치 후 "command not found: claude" 에러가 나오면 가장 먼저 해야 할 것은?',
  '[{"ko": "컴퓨터 포맷"}, {"ko": "터미널을 닫고 새로 열기"}, {"ko": "다른 컴퓨터에서 시도"}, {"ko": "인터넷 업체에 연락"}, {"ko": "Claude에게 물어보기"}]',
  1,
  5,
  '설치 후 터미널을 재시작하지 않으면 새로 설치된 명령어를 인식하지 못합니다. 터미널을 완전히 닫고 새로 열면 대부분 해결됩니다.'
);
