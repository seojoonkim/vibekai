import Link from "next/link";
import { Icons } from "@/components/icons";

export const metadata = {
  title: "이용약관 (도장 규칙) — VibeKai",
  description: "VibeKai 서비스 이용약관 (도장 규칙)입니다.",
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1c2128] text-[#f0b429] text-xs font-medium mb-4 rounded-md font-mono">
            <span className="w-1.5 h-1.5 bg-[#f0b429] rounded-full" />
            법적 고지
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#e6edf3] mb-3">
            도장 규칙 <span className="text-[#f0b429]">(이용약관)</span>
          </h1>
          <p className="text-[#8b949e] text-sm">
            최종 업데이트: 2025년 3월 1일 &nbsp;|&nbsp; 시행일: 2025년 3월 1일
          </p>
          <div className="mt-4 h-[1px] bg-gradient-to-r from-[#f0b429]/30 via-[#30363d] to-transparent" />
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-[#a8b2bd]">

          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제1조 (목적)
            </h2>
            <p>
              이 약관은 Hashed(이하 &ldquo;회사&rdquo;)가 제공하는 VibeKai 서비스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여,
              회사와 이용자 간의 권리·의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
            <p className="mt-2">
              본 서비스는 바이브코딩(AI를 활용한 자연어 기반 소프트웨어 개발) 교육을 제공하는 온라인 학습 플랫폼입니다.
              이용자는 본 약관에 동의함으로써 서비스에 가입하고 이용할 수 있습니다.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제2조 (용어 정의)
            </h2>
            <ul className="space-y-2 list-none">
              {[
                ['"서비스"', 'VibeKai 웹사이트(vibekai.vercel.app) 및 관련 모바일 앱, API, 콘텐츠 일체를 의미합니다.'],
                ['"이용자"', '본 약관에 동의하고 서비스에 가입한 자를 의미합니다.'],
                ['"계정"', '이용자가 서비스를 이용하기 위해 등록한 GitHub 또는 Google 계정 기반 식별 정보를 의미합니다.'],
                ['"콘텐츠"', '서비스 내에서 제공되는 강의, 프로젝트, 커리큘럼, 커뮤니티 게시물 등 모든 학습 자료를 의미합니다.'],
              ].map(([term, def]) => (
                <li key={term} className="flex gap-2">
                  <span className="text-[#f0b429] font-semibold whitespace-nowrap">{term}</span>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제3조 (약관의 효력 및 변경)
            </h2>
            <p>
              본 약관은 이용자가 서비스에 가입하는 시점부터 효력이 발생합니다.
              회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며,
              변경 시 서비스 내 공지사항 또는 이메일을 통해 7일 전 사전 고지합니다.
            </p>
            <p className="mt-2">
              변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
              변경 공지 후 계속 서비스를 이용하면 변경된 약관에 동의한 것으로 간주합니다.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제4조 (서비스 이용 목적)
            </h2>
            <p>서비스는 다음 목적으로만 이용하여야 합니다:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                '개인적인 바이브코딩 학습 및 역량 개발',
                'AI 도구를 활용한 소프트웨어 개발 기술 습득',
                '커뮤니티를 통한 지식 공유 및 협업',
                '제공된 커리큘럼과 프로젝트를 통한 실습',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#f0b429] mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제5조 (금지 행위)
            </h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                '타인의 개인정보, 계정 정보를 무단으로 수집, 이용하는 행위',
                '서비스를 통해 제공된 콘텐츠를 무단으로 복제, 배포, 판매하는 행위',
                '서비스의 정상적인 운영을 방해하는 행위 (DDoS, 해킹, 악성코드 배포 등)',
                '타인을 비방하거나 명예를 훼손하는 게시물을 게시하는 행위',
                '음란물, 폭력적 콘텐츠, 혐오 표현 등 불법적이거나 유해한 콘텐츠를 유포하는 행위',
                '회사의 사전 동의 없이 서비스를 이용하여 영리 목적의 활동을 하는 행위',
                '관계 법령에 위반되는 모든 행위',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[#8b949e]">
              위반 시 회사는 사전 통보 없이 해당 이용자의 계정을 정지 또는 삭제할 수 있습니다.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제6조 (계정 정책)
            </h2>
            <p>
              이용자는 GitHub 또는 Google OAuth를 통해 계정을 생성합니다.
              계정은 본인만 이용 가능하며 타인과 공유할 수 없습니다.
            </p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                '1인 1계정 원칙: 이용자당 하나의 계정만 허용됩니다.',
                '계정 보안: 계정 접근 정보는 이용자 본인이 안전하게 관리해야 합니다.',
                '계정 양도 금지: 계정을 타인에게 양도하거나 판매할 수 없습니다.',
                '계정 삭제 요청: 언제든지 회사에 계정 삭제를 요청할 수 있습니다.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#f0b429] mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제7조 (서비스 이용 제한 및 중단)
            </h2>
            <p>
              회사는 다음의 경우 이용자의 서비스 이용을 제한하거나 중단할 수 있습니다:
            </p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                '본 약관 제5조(금지 행위)를 위반한 경우',
                '서비스의 유지보수, 시스템 점검이 필요한 경우',
                '천재지변, 국가 비상사태 등 불가항력적 사유가 발생한 경우',
                '법원, 수사기관 등 법적 요청이 있는 경우',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#f0b429] mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제8조 (지적 재산권)
            </h2>
            <p>
              서비스에서 제공되는 콘텐츠(강의 영상, 텍스트, 이미지, 코드 등)의 지적 재산권은 회사 또는 해당 콘텐츠 제공자에게 귀속됩니다.
              이용자는 개인적인 학습 목적으로만 콘텐츠를 이용할 수 있으며, 무단 복제·배포·판매는 금지됩니다.
            </p>
            <p className="mt-2">
              이용자가 서비스 내에 게시한 콘텐츠(커뮤니티 게시물 등)에 대한 저작권은 이용자에게 귀속되나,
              회사는 서비스 운영 및 홍보 목적으로 해당 콘텐츠를 이용할 수 있습니다.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제9조 (면책 조항)
            </h2>
            <p>
              회사는 서비스를 &ldquo;있는 그대로(as-is)&rdquo; 제공하며, 서비스의 완전성, 정확성, 특정 목적에의 적합성을 보증하지 않습니다.
              회사는 이용자가 서비스를 통해 기대하는 수익 또는 결과를 보장하지 않습니다.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제10조 (분쟁 해결 및 준거법)
            </h2>
            <p>
              본 약관은 대한민국 법률에 따라 해석됩니다.
              서비스 이용과 관련하여 발생한 분쟁에 대해서는 서울중앙지방법원을 제1심 관할 법원으로 합니다.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-lg font-bold text-[#e6edf3] mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-5 bg-[#f0b429] rounded-full" />
              제11조 (문의)
            </h2>
            <p>
              본 약관에 관한 문의사항은 아래로 연락해 주세요:
            </p>
            <div className="mt-3 p-4 bg-[#1c2128] rounded-md text-sm space-y-1">
              <p><span className="text-[#f0b429]">서비스명:</span> VibeKai</p>
              <p><span className="text-[#f0b429]">운영사:</span> Hashed</p>
              <p>
                <span className="text-[#f0b429]">디스코드:</span>{" "}
                <a
                  href="https://discord.gg/zpk3efB3aY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline"
                >
                  discord.gg/zpk3efB3aY
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-[#30363d] text-center text-sm text-[#484f58]">
          <p>
            <Link href="/privacy" className="text-[#58a6ff] hover:underline">개인정보처리방침</Link>
            {" "}도 함께 확인해 주세요.
          </p>
        </div>
      </main>
    </div>
  );
}
