import Link from "next/link";
import { Icons } from "@/components/icons";

export const metadata = {
  title: "개인정보처리방침 — VibeKai",
  description: "VibeKai 서비스의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#010409]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Icons.vibedojoSymbol className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg tracking-tighter font-black text-[#f0f6fc] group-hover:text-[#daa520] transition-colors">
              VibeKai
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            ← 홈으로
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl py-12 px-4 sm:px-6">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1c2128] text-[#58a6ff] text-xs font-medium mb-4 rounded-md font-mono">
            <span className="w-1.5 h-1.5 bg-[#58a6ff] rounded-full" />
            법적 고지
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#e6edf3] mb-3">
            개인정보 <span className="text-[#f0b429]">처리방침</span>
          </h1>
          <p className="text-[#8b949e] text-sm">
            최종 업데이트: 2025년 3월 1일 &nbsp;|&nbsp; 시행일: 2025년 3월 1일
          </p>
          <div className="mt-4 h-[1px] bg-gradient-to-r from-[#58a6ff]/30 via-[#30363d] to-transparent" />
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-[#a8b2bd]">

          {/* Intro */}
          <section>
            <p>
              Hashed(이하 &ldquo;회사&rdquo;)는 VibeKai 서비스(이하 &ldquo;서비스&rdquo;)를 운영함에 있어
              이용자의 개인정보를 매우 중요하게 생각하며, 관련 법령(「개인정보 보호법」,
              「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등)을 준수합니다.
              본 방침은 서비스가 수집하는 개인정보의 항목, 수집 목적, 이용 방법 및 보호 조치에 대해 안내합니다.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제1조 (수집하는 개인정보 항목)
            </h2>
            <p>서비스는 다음과 같은 개인정보를 수집합니다:</p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1c2128]">
                    <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">수집 방법</th>
                    <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">수집 항목</th>
                    <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">필수 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GitHub OAuth 로그인', 'GitHub 사용자명, 이메일 주소, 프로필 이미지 URL', '필수'],
                    ['Google OAuth 로그인', '이름, 이메일 주소, 프로필 이미지 URL', '필수'],
                    ['서비스 이용 중 자동 수집', 'IP 주소, 접속 기기 정보, 브라우저 유형, 이용 기록(학습 진도, XP, 벨트 등)', '자동'],
                    ['이용자 직접 입력', '커뮤니티 게시물 내용, 닉네임(선택 변경 시)', '선택'],
                  ].map(([method, items, required]) => (
                    <tr key={method} className="border border-[#30363d] hover:bg-[#1c2128]/50">
                      <td className="px-4 py-3 border border-[#30363d] text-[#c9d1d9]">{method}</td>
                      <td className="px-4 py-3 border border-[#30363d]">{items}</td>
                      <td className="px-4 py-3 border border-[#30363d]">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          required === '필수' ? 'bg-[#f0b429]/20 text-[#f0b429]' :
                          required === '자동' ? 'bg-[#58a6ff]/20 text-[#58a6ff]' :
                          'bg-[#3fb950]/20 text-[#3fb950]'
                        }`}>
                          {required}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제2조 (개인정보 수집 목적)
            </h2>
            <p>수집한 개인정보는 다음의 목적으로만 이용합니다:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                ['회원 식별 및 인증', '서비스 로그인, 본인 확인, 계정 관리'],
                ['서비스 제공', '학습 진도 저장, XP/벨트 시스템 운영, 커리큘럼 제공'],
                ['개인화 서비스', '학습 이력 기반 추천, 리더보드 표시'],
                ['커뮤니티 운영', '게시물 작성자 식별, 신고 처리'],
                ['서비스 개선', '이용 통계 분석, 오류 진단 및 수정'],
                ['공지사항 전달', '서비스 변경사항, 이용약관 변경 고지'],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="text-[#58a6ff] mt-1">▸</span>
                  <div>
                    <span className="text-[#c9d1d9] font-medium">{title}:</span>{" "}
                    <span>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제3조 (개인정보 보유 및 이용 기간)
            </h2>
            <p>
              이용자의 개인정보는 원칙적으로 서비스 탈퇴 시 즉시 파기합니다.
              단, 관계 법령에 의해 보존이 필요한 경우 해당 기간 동안 보유합니다:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1c2128]">
                    <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">보유 항목</th>
                    <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">보유 기간</th>
                    <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">근거</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['회원 가입 및 이용 기록', '회원 탈퇴 시까지', '서비스 운영'],
                    ['전자상거래 결제 기록 (유료 전환 시)', '5년', '전자상거래법'],
                    ['서비스 접속 로그', '3개월', '통신비밀보호법'],
                    ['소비자 불만 및 분쟁 처리 기록', '3년', '전자상거래법'],
                  ].map(([item, period, basis]) => (
                    <tr key={item} className="border border-[#30363d] hover:bg-[#1c2128]/50">
                      <td className="px-4 py-3 border border-[#30363d] text-[#c9d1d9]">{item}</td>
                      <td className="px-4 py-3 border border-[#30363d] text-[#f0b429] font-medium">{period}</td>
                      <td className="px-4 py-3 border border-[#30363d]">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제4조 (제3자 제공)
            </h2>
            <div className="p-4 bg-[#1c2128] rounded-md border border-[#3fb950]/20">
              <p className="text-[#3fb950] font-semibold mb-2">✓ 원칙: 제3자에게 개인정보를 제공하지 않습니다.</p>
              <p>
                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다:
              </p>
            </div>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                '이용자가 사전에 동의한 경우',
                '법령의 규정에 의거하거나, 수사기관의 수사 목적으로 법령에 정해진 절차와 방법에 따라 요청이 있는 경우',
                '서비스 제공에 필요한 최소한의 범위 내에서 위탁 처리하는 경우 (예: 클라우드 인프라 서비스)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 mt-2">
                  <span className="text-[#58a6ff] mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <p className="text-[#c9d1d9] font-medium mb-2">현재 수탁 업체:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1c2128]">
                      <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">수탁 업체</th>
                      <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">위탁 업무</th>
                      <th className="text-left px-4 py-3 text-[#e6edf3] font-semibold border border-[#30363d]">보유 기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Supabase Inc.', '데이터베이스 및 인증 서비스 운영', '회원 탈퇴 시까지'],
                      ['Vercel Inc.', '웹 서비스 호스팅 및 배포', '서비스 종료 시까지'],
                    ].map(([company, task, period]) => (
                      <tr key={company} className="border border-[#30363d] hover:bg-[#1c2128]/50">
                        <td className="px-4 py-3 border border-[#30363d] text-[#c9d1d9]">{company}</td>
                        <td className="px-4 py-3 border border-[#30363d]">{task}</td>
                        <td className="px-4 py-3 border border-[#30363d]">{period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제5조 (이용자의 권리)
            </h2>
            <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                '개인정보 열람 요청',
                '개인정보 수정 요청 (서비스 내 설정 페이지 또는 문의)',
                '개인정보 삭제 및 회원 탈퇴 요청',
                '개인정보 처리 정지 요청',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#58a6ff] mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[#8b949e]">
              권리 행사는 디스코드 커뮤니티 또는 서비스 내 설정 페이지를 통해 요청하실 수 있습니다.
              요청 후 10 영업일 이내에 처리됩니다.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제6조 (개인정보 보호 조치)
            </h2>
            <p>회사는 개인정보 보호를 위해 다음의 기술적·관리적 조치를 취하고 있습니다:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                'HTTPS 암호화 전송으로 개인정보 보호',
                'Supabase Row Level Security(RLS) 적용으로 데이터 접근 제어',
                'OAuth 기반 인증으로 비밀번호 직접 저장 불필요',
                '최소한의 개인정보만 수집하는 데이터 최소화 원칙 준수',
                '정기적인 보안 점검 및 취약점 검사',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#58a6ff] mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제7조 (쿠키 사용)
            </h2>
            <p>
              서비스는 로그인 세션 유지 및 서비스 최적화를 위해 쿠키를 사용합니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나,
              이 경우 일부 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제8조 (만 14세 미만 아동)
            </h2>
            <p>
              서비스는 만 14세 미만 아동을 대상으로 하지 않습니다.
              만 14세 미만 아동은 부모 또는 법정 대리인의 동의 없이 서비스에 가입할 수 없습니다.
              만 14세 미만 아동의 개인정보가 수집된 것으로 확인된 경우 즉시 삭제 조치합니다.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제9조 (개인정보 보호 책임자)
            </h2>
            <div className="p-4 bg-[#1c2128] rounded-md text-sm space-y-1.5">
              <p><span className="text-[#58a6ff]">서비스명:</span> VibeKai</p>
              <p><span className="text-[#58a6ff]">운영사:</span> Hashed</p>
              <p>
                <span className="text-[#58a6ff]">개인정보 문의:</span>{" "}
                <a
                  href="https://discord.gg/zpk3efB3aY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline"
                >
                  디스코드 커뮤니티 (discord.gg/zpk3efB3aY)
                </a>
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#58a6ff] rounded-full" />
              제10조 (방침 변경)
            </h2>
            <p>
              본 개인정보처리방침은 법령, 정부 지침 또는 서비스 정책에 따라 변경될 수 있습니다.
              변경 시 서비스 내 공지사항 또는 이메일을 통해 사전 고지합니다.
            </p>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-[#30363d] text-center text-sm text-[#484f58]">
          <p>
            <Link href="/terms" className="text-[#58a6ff] hover:underline">이용약관(도장 규칙)</Link>
            {" "}도 함께 확인해 주세요.
          </p>
        </div>
      </main>
    </div>
  );
}
