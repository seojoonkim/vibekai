"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { href: "/dashboard", label: "내 도장", labelShort: "도장", requiresLogin: true },
    { href: "/curriculum", label: "수련 과정", labelShort: "수련", requiresLogin: false },
    { href: "/community", label: "커뮤니티", labelShort: "커뮤니티", requiresLogin: false },
    { href: "/leaderboard", label: "리더보드", labelShort: "리더보드", requiresLogin: false },
  ];

  // Filter nav items based on login status
  const visibleNavItems = navItems.filter(item => !item.requiresLogin || isLoggedIn);

  const logoHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#010409]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo - left */}
        <Link href={logoHref} className="flex items-center gap-1.5 group">
          <Icons.vibedojoSymbol className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg text-[#f0f6fc] tracking-tighter font-black group-hover:text-[#daa520] transition-colors">
            VibeKai
          </span>
        </Link>

        {/* Navigation - center (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "relative flex items-center px-3 lg:px-4 py-1.5 text-sm lg:text-[15px] font-medium transition-all outline-none focus:outline-none focus-visible:outline-none",
                  isActive
                    ? "text-[#f0b429]"
                    : "text-[#8b949e] hover:text-[#c9d1d9]"
                )}
              >
                {/* Active indicator - underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-12px)] h-[2px] bg-[#f0b429] rounded-full" />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md h-8 w-8 sm:h-9 sm:w-9 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] border-0 transition-all"
                  >
                    <Icons.settings className="h-4 w-4" />
                    <span className="sr-only">설정</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-[#1c2128] backdrop-blur-sm border-0 outline-none rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 cursor-pointer text-[#c9d1d9] focus:text-[#c9d1d9] focus:bg-[#21262d] focus:outline-none focus-visible:outline-none focus-visible:ring-0 rounded-md"
                    >
                      <Icons.settings className="h-4 w-4" />
                      설정
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#30363d]/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 cursor-pointer text-[#f85149] focus:text-[#f85149] focus:bg-[#f85149]/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 rounded-md"
                  >
                    <Icons.logOut className="h-4 w-4" />
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
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
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md h-8 w-8 sm:h-9 sm:w-9 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] border-0 transition-all"
              >
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] p-0 bg-[#0a0c10] backdrop-blur-sm  rounded-none shadow-[-4px_0_16px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                  <Link
                    href={logoHref}
                    className="flex items-center gap-1.5 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icons.vibedojoSymbol className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-lg text-[#f0f6fc] tracking-tighter font-black group-hover:text-[#daa520] transition-colors">
                      VibeKai
                    </span>
                  </Link>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                  {visibleNavItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "relative flex items-center px-4 py-3 text-base font-medium transition-all rounded-md",
                          isActive
                            ? "text-[#c9d1d9] bg-[#1c2128] shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                            : "text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128]/50"
                        )}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[#f0b429] rounded-r-full" />
                        )}
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                {!isLoggedIn && (
                  <div className="p-4 shadow-[0_-1px_0_rgba(255,255,255,0.05)] space-y-2">
                    <Button
                      asChild
                      variant="outline"
                      size="default"
                      className="w-full rounded-md h-10 text-sm text-[#c9d1d9] bg-[#1c2128] border-0 hover:bg-[#262c36] hover:text-[#e6edf3] shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-300"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        로그인
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="default"
                      className="w-full rounded-md h-10 text-sm font-bold bg-[#daa520] text-[#0d1117] hover:bg-[#e6b82e] border-0 shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-300"
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        입문하기
                      </Link>
                    </Button>
                  </div>
                )}
                {isLoggedIn && (
                  <div className="p-4 shadow-[0_-1px_0_rgba(255,255,255,0.05)] space-y-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full rounded-md h-10 text-sm border-0 text-[#f85149] hover:text-[#f85149] bg-[#f85149]/10 hover:bg-[#f85149]/20 shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all"
                    >
                      {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
