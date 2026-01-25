"use client";

import Link from "next/link";
import { Monitor, Laptop, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface MobileLearningNoticeProps {
  chapterTitle?: string;
}

export function MobileLearningNotice({ chapterTitle }: MobileLearningNoticeProps) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#daa520]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Kanji */}
      <div className="fixed top-1/3 left-4 text-[8rem] font-serif text-[#daa520]/[0.04] select-none pointer-events-none">
        修
      </div>
      <div className="fixed bottom-1/4 right-4 text-[8rem] font-serif text-[#daa520]/[0.04] select-none pointer-events-none">
        練
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl bg-[#1c2128] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#daa520]/20 via-transparent to-[#58a6ff]/10" />
            <div className="relative flex items-center gap-1">
              <Monitor className="w-8 h-8 text-[#daa520]" />
              <span className="text-[#daa520] text-2xl font-bold">/</span>
              <Laptop className="w-7 h-7 text-[#58a6ff]" />
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-[#daa520]/10 rounded-3xl blur-xl -z-10" />
        </div>

        {/* Text content */}
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-[#c9d1d9] mb-3">
            PC에서 수련해주세요
          </h1>

          <p className="text-[#8b949e] text-base mb-2 leading-relaxed">
            학습 콘텐츠는 <span className="text-[#daa520] font-medium">PC</span> 또는 <span className="text-[#58a6ff] font-medium">노트북</span>에서
          </p>
          <p className="text-[#8b949e] text-base mb-6 leading-relaxed">
            더 효과적으로 진행할 수 있습니다.
          </p>

          {chapterTitle && (
            <div className="bg-[#1c2128] rounded-md px-4 py-3 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
              <p className="text-xs text-[#6e7681] mb-1 font-mono uppercase tracking-wider">현재 챕터</p>
              <p className="text-sm text-[#c9d1d9] font-medium truncate">{chapterTitle}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full h-12 rounded-md bg-[#daa520] hover:bg-[#e6b82e] text-[#0d1117] font-bold text-base shadow-[0_4px_12px_rgba(218,165,32,0.3)] transition-all"
            >
              <Link href="/curriculum">
                <ArrowLeft className="w-4 h-4 mr-2" />
                수련 과정으로
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 rounded-md bg-[#1c2128] border-0 text-[#c9d1d9] hover:bg-[#21262d] hover:text-[#e6edf3] font-medium text-base shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all"
            >
              <Link href="/dashboard">
                <Icons.code className="w-4 h-4 mr-2" />
                내 도장
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="mt-10 flex items-center gap-2 px-4 py-2 bg-[#1c2128]/50 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <div className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
          <span className="text-xs text-[#8b949e]">
            나머지 메뉴는 모바일에서도 이용 가능합니다
          </span>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="px-6 pb-8">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#daa520]/30 to-transparent rounded-full" />
      </div>
    </div>
  );
}
