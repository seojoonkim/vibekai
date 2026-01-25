"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export default function LoginPage() {
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleOAuthLogin = async (provider: "github" | "google") => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left: Image Section */}
        <div className="w-1/2 relative">
          <Image
            src="/images/login.jpg"
            alt="도장 입장"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          {/* Gradient connecting to right side */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#0d1117]" />

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#f0b429]" />
              <span className="text-[#f0b429] text-sm font-semibold tracking-[0.2em] drop-shadow-lg">再入場</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              도장에<br />돌아오셨군요
            </h2>
            <p className="text-white/90 text-lg xl:text-xl max-w-md leading-relaxed drop-shadow-md">
              다시 만나 반갑습니다.<br />
              오늘도 함께 수련을 이어가요.
            </p>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="w-1/2 flex items-center justify-center p-12 relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#f0b429]/5 rounded-full blur-[100px]" />

          <div className="w-full max-w-[400px] relative z-10">
            <div className="bg-[#161b22] rounded-2xl border border-[#30363d] shadow-[0_16px_48px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-8">
                <div className="mb-8">
                  <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
                    <Icons.vibedojoSymbol className="w-9 h-9" />
                    <span className="font-bold text-xl text-[#e6edf3] group-hover:text-[#f0b429] transition-colors">
                      {common("appName")}
                    </span>
                  </Link>
                  <h1 className="text-3xl font-bold text-[#e6edf3] mb-2">
                    {t("loginTitle")}
                  </h1>
                  <p className="text-[15px] text-[#8b949e] leading-relaxed">
                    <span className="text-[#f0b429]">GitHub</span> 또는{" "}
                    <span className="text-[#e6edf3]">Google</span> 계정으로 입장하세요.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-[15px] font-medium rounded-xl bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:border-[#8b949e] transition-all duration-200"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={isLoading}
                  >
                    <Icons.github className="mr-2.5 h-5 w-5" />
                    {t("continueWithGithub")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-[15px] font-medium rounded-xl bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:border-[#8b949e] transition-all duration-200"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isLoading}
                  >
                    <Icons.google className="mr-2.5 h-5 w-5" />
                    {t("continueWithGoogle")}
                  </Button>
                </div>
              </div>

              <div className="px-8 py-4 bg-[#0d1117]/50 border-t border-[#21262d]">
                <p className="text-center text-[14px] text-[#8b949e]">
                  아직 입문하지 않으셨나요?{" "}
                  <Link
                    href="/signup"
                    className="text-[#f0b429] hover:text-[#f7c948] font-medium transition-colors"
                  >
                    입문 신청
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Top: Image Section - fixed to top */}
        <div className="relative w-full aspect-[2/1] flex-shrink-0">
          <Image
            src="/images/login-mobile.jpg"
            alt="도장 입장"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0d1117]" />

          {/* Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-[#f0b429]/30 text-[#f0b429] text-[10px] font-semibold rounded-full border border-[#f0b429]/40 backdrop-blur-sm">
              再入場
            </span>
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
              도장에 돌아오셨군요
            </h2>
            <p className="text-white/80 text-xs sm:text-sm drop-shadow-md">
              오늘도 함께 수련을 이어가요
            </p>
          </div>
        </div>

        {/* Bottom: Form Section */}
        <div className="flex-1 flex items-start justify-center px-4 py-6 sm:px-6 sm:py-8">
          <div className="w-full max-w-[400px]">
            <div className="bg-[#161b22] rounded-2xl border border-[#30363d] shadow-[0_16px_48px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="mb-6">
                  <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                    <Icons.vibedojoSymbol className="w-8 h-8" />
                    <span className="font-bold text-lg text-[#e6edf3] group-hover:text-[#f0b429] transition-colors">
                      {common("appName")}
                    </span>
                  </Link>
                  <h1 className="text-2xl font-bold text-[#e6edf3] mb-1.5">
                    {t("loginTitle")}
                  </h1>
                  <p className="text-[14px] text-[#8b949e]">
                    <span className="text-[#f0b429]">GitHub</span> 또는{" "}
                    <span className="text-[#e6edf3]">Google</span> 계정으로 입장하세요.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Button
                    variant="outline"
                    className="w-full h-11 text-[14px] font-medium rounded-xl bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:border-[#8b949e] transition-all duration-200"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={isLoading}
                  >
                    <Icons.github className="mr-2 h-5 w-5" />
                    {t("continueWithGithub")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 text-[14px] font-medium rounded-xl bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d] hover:border-[#8b949e] transition-all duration-200"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isLoading}
                  >
                    <Icons.google className="mr-2 h-5 w-5" />
                    {t("continueWithGoogle")}
                  </Button>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3.5 bg-[#0d1117]/50 border-t border-[#21262d]">
                <p className="text-center text-[13px] text-[#8b949e]">
                  아직 입문하지 않으셨나요?{" "}
                  <Link
                    href="/signup"
                    className="text-[#f0b429] hover:text-[#f7c948] font-medium transition-colors"
                  >
                    입문 신청
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
