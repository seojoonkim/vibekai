"use client";

import { getCharacterById, type Character } from "@/lib/characters";
import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
  characterId: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  beltColor?: string;
  className?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function CharacterAvatar({ characterId, size = "md", beltColor, className }: CharacterAvatarProps) {
  const character = getCharacterById(characterId);
  const pixelSize = sizeMap[size];

  if (!character) {
    return (
      <div
        className={cn(
          "rounded-full bg-muted flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ width: pixelSize, height: pixelSize }}
      >
        ?
      </div>
    );
  }

  // Calculate sprite position for CSS background
  // Each sheet is 4 columns x 2 rows
  const spriteSheet = `/images/characters/characters-${character.image}.png`;
  // For 4 columns: 0%, 33.33%, 66.67%, 100%
  const bgPosX = (character.col / 3) * 100;
  // For 2 rows: 0%, 100%
  const bgPosY = character.row * 100;

  return (
    <div className={cn("relative", className)}>
      <div
        className="rounded-md overflow-hidden ring-2 ring-slate-700 shadow-lg"
        style={{
          width: pixelSize,
          height: pixelSize,
          backgroundImage: `url(${spriteSheet})`,
          backgroundSize: "400% 200%",
          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        }}
        title={character.nameKo}
      />
      {beltColor && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-1.5 w-3/4 rounded-full shadow-sm"
          style={{ backgroundColor: beltColor }}
        />
      )}
    </div>
  );
}

interface CharacterCardProps {
  character: Character;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showName?: boolean;
  beltColor?: string;
}

export function CharacterCard({ character, selected, onClick, disabled, showName = true, beltColor }: CharacterCardProps) {
  const spriteSheet = `/images/characters/characters-${character.image}.png`;
  const bgPosX = (character.col / 3) * 100;
  const bgPosY = character.row * 100;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-0.5 p-1 rounded-md transition-all duration-200",
        "hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-violet-500",
        selected && "bg-violet-500/20 ring-2 ring-violet-500",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="relative">
        <div
          className="w-10 h-10 rounded-md overflow-hidden bg-slate-800 ring-1 ring-slate-700"
          style={{
            backgroundImage: `url(${spriteSheet})`,
            backgroundSize: "400% 200%",
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
          }}
        />
        {/* Belt indicator */}
        {beltColor && (
          <div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-7 rounded-full shadow-sm ring-1 ring-black/20"
            style={{ backgroundColor: beltColor }}
          />
        )}
      </div>
      {showName && (
        <span className="text-[8px] font-medium text-center leading-tight text-slate-400 truncate w-full">
          {character.nameKo}
        </span>
      )}
    </button>
  );
}

// Simple character preview without button functionality
interface CharacterPreviewProps {
  character: Character;
  size?: number;
  beltColor?: string;
  className?: string;
}

export function CharacterPreview({ character, size = 48, beltColor, className }: CharacterPreviewProps) {
  const spriteSheet = `/images/characters/characters-${character.image}.png`;
  const bgPosX = (character.col / 3) * 100;
  const bgPosY = character.row * 100;

  return (
    <div className={cn("relative", className)}>
      <div
        className="rounded-md overflow-hidden bg-slate-800/50 ring-1 ring-slate-700/50 shadow-lg transition-transform hover:scale-105"
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${spriteSheet})`,
          backgroundSize: "400% 200%",
          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        }}
        title={`${character.nameKo} - ${character.description}`}
      />
      {/* Belt indicator */}
      {beltColor && (
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 rounded-full shadow-md ring-1 ring-black/20"
          style={{
            backgroundColor: beltColor,
            width: size * 0.7,
          }}
        />
      )}
    </div>
  );
}
