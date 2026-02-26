"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/curriculum", label: "수련 과정" },
  { href: "/community", label: "커뮤니티" },
  { href: "/leaderboard", label: "리더보드" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        aria-label="메뉴 열기"
        onClick={() => setOpen((prev) => !prev)}
        className="flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-md hover:bg-[#1c2128] transition-colors"
      >
        <span
          className={`block w-5 h-[2px] bg-[#8b949e] rounded-full transition-all duration-300 origin-center ${
            open ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-[2px] bg-[#8b949e] rounded-full transition-all duration-300 ${
            open ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-[2px] bg-[#8b949e] rounded-full transition-all duration-300 origin-center ${
            open ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-14 left-0 right-0 z-50 bg-[#010409]/98 backdrop-blur-md border-t border-[#21262d] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <nav className="container flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-[15px] font-medium text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#1c2128] rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
