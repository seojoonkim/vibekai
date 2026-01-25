import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { CURRICULUM_DATA, getAllChapters, getTotalXP } from "@/lib/curriculum-data";
import { BELTS } from "@/lib/belt-system";
import { LandingLanguageSwitcher } from "@/components/landing-language-switcher";

// Part 이미지 매핑
const PART_IMAGES: Record<number, string> = {
  1: "/images/p1.png",
  2: "/images/p2.png",
  3: "/images/p3.png",
  4: "/images/p4.png",
  5: "/images/p5.png",
  6: "/images/p6.png",
};

export default function CoursesPage() {
  const totalChapters = getAllChapters().length;
  const totalParts = CURRICULUM_DATA.length;
  const totalXP = getTotalXP();

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[#010409]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Icons.vibedojoSymbol className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg tracking-tighter font-black text-[#e6edf3] group-hover:text-[#daa520] transition-colors">
              VibeDojo
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <LandingLanguageSwitcher />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-md h-8 px-4 text-xs text-[#c9d1d9] bg-[#1c2128] border-0 hover:bg-[#262c36] hover:text-[#e6edf3] shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all duration-300"
            >
              <Link href="/login">로그인</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-md h-8 px-5 text-xs font-bold bg-[#daa520] text-[#0d1117] hover:bg-[#e6b82e] border-0 transition-all duration-300"
            >
              <Link href="/signup">입문하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-12 sm:py-16 px-4 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#daa520]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#58a6ff]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Decorative Kanji */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-[150px] font-serif text-[#daa520]/[0.04] pointer-events-none select-none hidden lg:block">
          修
        </div>
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-[120px] font-serif text-[#daa520]/[0.04] pointer-events-none select-none hidden lg:block">
          練
        </div>

        <div className="container max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1c2128] text-[#daa520] text-xs font-medium mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <Icons.scroll className="h-3.5 w-3.5" />
            VibeDojo 수련 과정
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#c9d1d9] mb-4">
            바이브코딩 마스터가 되기 위한{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#daa520] via-[#e6b82e] to-[#daa520]">
              체계적인 수련 과정
            </span>
          </h1>
          <p className="text-[#8b949e] mb-8 max-w-xl mx-auto text-sm sm:text-base">
            AI와 함께 코딩하는 방법을 처음부터 끝까지 배웁니다.
            <br />
            흰띠 입문생에서 검은띠 마스터까지, 단계별로 성장하세요.
          </p>

          {/* Stats */}
          <div className="inline-flex items-center gap-4 sm:gap-6 px-5 sm:px-6 py-3 sm:py-4 bg-[#1c2128] rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.35)] mb-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-[#daa520]">{totalParts}</div>
              <div className="text-[10px] sm:text-xs text-[#8b949e] font-mono">과정</div>
            </div>
            <div className="w-px h-8 bg-[#30363d]" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-[#daa520]">{totalChapters}</div>
              <div className="text-[10px] sm:text-xs text-[#8b949e] font-mono">챕터</div>
            </div>
            <div className="w-px h-8 bg-[#30363d]" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-[#daa520]">{totalXP.toLocaleString()}</div>
              <div className="text-[10px] sm:text-xs text-[#8b949e] font-mono">총 XP</div>
            </div>
          </div>

          {/* Belt Preview */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#8b949e] mr-2 font-mono">수련 완료 시 도달 가능:</span>
            {BELTS.slice(0, 6).map((belt, index) => (
              <div
                key={belt.id}
                className={`w-6 h-4 sm:w-8 sm:h-5 rounded-sm ${belt.bgColor} transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
                title={`${belt.nameKo} (${belt.minXp}+ XP)`}
              >
                <span
                  className="text-[6px] sm:text-[8px] font-bold font-mono"
                  style={{ color: index === 0 ? "#6b5344" : index === 8 ? "#f5f0e6" : "#3d2c1e" }}
                >
                  {belt.rank}
                </span>
              </div>
            ))}
            <span className="text-xs text-[#484f58] ml-1">...</span>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-8 sm:py-12 px-4 relative">
        <div className="container max-w-4xl">
          <div className="space-y-6 sm:space-y-8">
            {CURRICULUM_DATA.map((part) => {
              const partTotalXP = part.chapters.reduce((sum, ch) => sum + ch.xpReward, 0);

              return (
                <div
                  key={part.id}
                  className="rounded-md bg-[#1c2128] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(218,165,32,0.15)]"
                >
                  {/* Part Header with Image */}
                  <div className="relative aspect-[5/1] overflow-hidden group">
                    <Image
                      src={PART_IMAGES[part.id]}
                      alt={part.subtitle.ko}
                      fill
                      className="object-cover object-[center_60%] transition-transform duration-700 group-hover:scale-105 saturate-[0.8]"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/90 via-[#0d1117]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c2128]/80 via-transparent to-transparent" />

                    {/* Part Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md bg-[#daa520] text-[#0d1117] font-mono shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                      Part {part.id}
                    </div>

                    {/* XP Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-[#1c2128]/80 backdrop-blur-sm rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
                      <Icons.zap className="h-3 w-3 text-[#daa520]" />
                      <span className="text-[10px] sm:text-xs font-bold text-[#daa520] font-mono">{partTotalXP} XP</span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h2 className="text-lg sm:text-xl font-bold text-[#c9d1d9] mb-1">
                        {part.subtitle.ko}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#8b949e] max-w-md line-clamp-2">
                        {part.description.ko}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[#8b949e] font-mono">{part.chapters.length} Chapters</span>
                      </div>
                    </div>
                  </div>

                  {/* Chapters */}
                  <div className="bg-[#161b22] px-4 sm:px-5 py-3 sm:py-4">
                    <div className="grid gap-2">
                      {part.chapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-md bg-[#1c2128]/50 hover:bg-[#21262d] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-md bg-[#21262d] flex items-center justify-center text-xs font-bold text-[#8b949e] group-hover:text-[#c9d1d9] group-hover:bg-[#30363d] transition-all font-mono shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                            {chapter.id}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-[#c9d1d9] group-hover:text-[#daa520] transition-colors truncate">
                              {chapter.title.ko.replace(/^Chapter\s+\d+:\s*/, '')}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#6e7681] truncate">
                              {chapter.title.en.replace(/^Chapter\s+\d+:\s*/, '')}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#daa520] font-medium shrink-0 font-mono">
                            <Icons.award className="h-3 w-3" />
                            +{chapter.xpReward}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 bg-[#0d1117] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#daa520]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-xl text-center relative z-10">
          <Icons.swords className="h-8 w-8 text-[#daa520] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-black text-[#c9d1d9] mb-3">
            수련을 시작할 준비가 되셨나요?
          </h2>
          <p className="text-sm text-[#8b949e] mb-8">
            완전 무료로 바이브코딩 마스터의 길을 걸어보세요.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              asChild
              variant="outline"
              className="rounded-md h-10 sm:h-11 px-5 sm:px-6 text-sm font-medium bg-[#1c2128] border-0 text-[#c9d1d9] hover:bg-[#262c36] hover:text-[#e6edf3] shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
            >
              <Link href="/">
                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                도장 입구로
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-md h-10 sm:h-11 px-5 sm:px-6 text-sm font-bold bg-[#daa520] hover:bg-[#e6b82e] text-[#0d1117] transition-all duration-300"
            >
              <Link href="/signup">
                VibeDojo 입문하기
                <Icons.chevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 bg-[#010409] shadow-[0_-1px_0_rgba(255,255,255,0.05)] mt-auto">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
          <div className="flex items-center gap-2">
            <Icons.vibedojoSymbol className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="font-bold text-xs sm:text-sm text-[#e6edf3] tracking-tight">
              VibeDojo
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5 sm:gap-1 order-last sm:order-none">
            <p className="text-xs sm:text-sm text-[#484f58]">
              © 2025 VibeDojo. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-[#a8b2bd]">
              Powered by{" "}
              <Link
                href="https://www.hashed.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#58a6ff] hover:text-[#79c0ff] transition-all font-medium"
              >
                #Hashed
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/anthropics/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a8b2bd] hover:text-[#c9d1d9] transition-all duration-300"
            >
              <Icons.github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
