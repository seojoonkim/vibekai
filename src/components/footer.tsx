import Link from "next/link";
import { Icons } from "@/components/icons";

export function Footer() {
  return (
    <footer className="py-6 sm:py-8 px-4 bg-[#010409] shadow-[0_-1px_0_rgba(255,255,255,0.05)]">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Icons.vibedojoSymbol className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="font-semibold text-xs sm:text-sm text-[#f0f6fc]">
            VibeDojo
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 order-last sm:order-none">
          <p className="text-xs sm:text-sm text-[#484f58]">
            © 2026 VibeDojo. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-[#8b949e]">
            Powered by{" "}
            <Link
              href="https://www.hashed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f0b429] hover:text-[#f7c948] transition-colors font-medium"
            >
              #Hashed
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://discord.gg/TxbJ56hS94"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8b949e] hover:text-[#5865F2] transition-colors"
          >
            <Icons.discord className="h-4 w-4" />
          </Link>
          <Link
            href="https://github.com/vibedojo-by-hashed/VibecodingCurriculum"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            <Icons.github className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
