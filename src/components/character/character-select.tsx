"use client";

import { useState } from "react";
import { CHARACTERS, type Character } from "@/lib/characters";
import { CharacterCard, CharacterPreview } from "./character-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { getBeltByXp } from "@/lib/belt-system";

interface CharacterSelectProps {
  onSelect: (character: Character) => void;
  selectedId?: string;
  beltColor?: string;
}

export function CharacterSelect({ onSelect, selectedId, beltColor }: CharacterSelectProps) {
  const [selected, setSelected] = useState<Character | null>(
    selectedId ? CHARACTERS.find((c) => c.id === selectedId) || null : null
  );

  const handleSelect = (character: Character) => {
    setSelected(character);
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="space-y-3">
      {/* All 32 characters in a scrollable grid */}
      <div className="max-h-[50vh] overflow-y-auto p-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-violet-500/70">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-0.5">
          {CHARACTERS.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={selected?.id === character.id}
              onClick={() => handleSelect(character)}
              beltColor={beltColor}
            />
          ))}
        </div>
      </div>

      {/* Selected character info */}
      {selected && (
        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <CharacterPreview character={selected} size={48} beltColor={beltColor} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-100">{selected.nameKo}</p>
              <p className="text-xs text-slate-400">{selected.description}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleConfirm}
        disabled={!selected}
        className="w-full rounded-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0"
      >
        {selected ? `${selected.nameKo}(으)로 선택하기` : "캐릭터를 선택해주세요"}
      </Button>
    </div>
  );
}

interface CharacterSelectModalProps {
  currentCharacterId: string;
  currentXp: number;
  onSelect: (character: Character) => void;
  children?: React.ReactNode;
}

export function CharacterSelectModal({ currentCharacterId, currentXp, onSelect, children }: CharacterSelectModalProps) {
  const [open, setOpen] = useState(false);
  const currentCharacter = CHARACTERS.find((c) => c.id === currentCharacterId);
  const belt = getBeltByXp(currentXp);

  const handleSelect = (character: Character) => {
    onSelect(character);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="group relative">
            {currentCharacter && (
              <CharacterPreview character={currentCharacter} size={80} beltColor={belt.color} />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
              <Pencil className="h-5 w-5 text-white" />
            </div>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-slate-100 text-center">수련생 캐릭터 선택</DialogTitle>
          <p className="text-xs text-slate-400 text-center">
            바이브 도장에서 함께할 캐릭터를 선택하세요
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: belt.color }}
            />
            <span className="text-xs text-slate-500">현재 띠: {belt.nameKo}</span>
          </div>
        </DialogHeader>
        <CharacterSelect
          onSelect={handleSelect}
          selectedId={currentCharacterId}
          beltColor={belt.color}
        />
      </DialogContent>
    </Dialog>
  );
}
