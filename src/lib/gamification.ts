export const XP_REWARDS = {
  CHAPTER_COMPLETE: 100, // Variable per chapter (50-250)
  POST_CREATED: 3,
  SHOWCASE_POSTED: 30,
  COMMENT_WRITTEN: 3,
  ANSWER_ACCEPTED: 10,
  RECEIVED_LIKE: 3,
  DAILY_LOGIN: 0, // No XP but counts as activity
} as const;

export interface Level {
  level: number;
  name: { ko: string; en: string };
  minXp: number;
  color: string;
}

export const LEVELS: Level[] = [
  { level: 1, name: { ko: "새싹", en: "Newbie" }, minXp: 0, color: "bg-green-500" },
  { level: 2, name: { ko: "탐험가", en: "Explorer" }, minXp: 500, color: "bg-blue-500" },
  { level: 3, name: { ko: "빌더", en: "Builder" }, minXp: 1500, color: "bg-purple-500" },
  { level: 4, name: { ko: "크리에이터", en: "Creator" }, minXp: 3500, color: "bg-orange-500" },
  { level: 5, name: { ko: "마스터", en: "Master" }, minXp: 7000, color: "bg-red-500" },
  { level: 6, name: { ko: "센세이", en: "Sensei" }, minXp: 15000, color: "bg-yellow-500" },
];

export function calculateLevel(totalXp: number): Level {
  return LEVELS.reduce((acc, level) => (totalXp >= level.minXp ? level : acc));
}

export function getXpForNextLevel(totalXp: number): { current: number; needed: number; progress: number } {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return { current: totalXp, needed: totalXp, progress: 100 };
  }

  const xpInCurrentLevel = totalXp - currentLevel.minXp;
  const xpNeededForNextLevel = nextLevel.minXp - currentLevel.minXp;
  const progress = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);

  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNextLevel,
    progress,
  };
}

export interface Badge {
  id: string;
  icon: string;
  name: { ko: string; en: string };
  description: { ko: string; en: string };
  category: "learning" | "community" | "streak";
}

export const BADGES: Badge[] = [
  {
    id: "first-chapter",
    icon: "📖",
    name: { ko: "첫 발걸음", en: "First Step" },
    description: { ko: "첫 챕터를 완료했습니다", en: "Completed your first chapter" },
    category: "learning",
  },
  {
    id: "part-1-complete",
    icon: "🎯",
    name: { ko: "Part 1 마스터", en: "Part 1 Master" },
    description: { ko: "Part 1을 완료했습니다", en: "Completed Part 1" },
    category: "learning",
  },
  {
    id: "full-curriculum",
    icon: "🏆",
    name: { ko: "풀 커리큘럼", en: "Full Curriculum" },
    description: { ko: "전체 30챕터를 완료했습니다", en: "Completed all 30 chapters" },
    category: "learning",
  },
  {
    id: "first-post",
    icon: "✍️",
    name: { ko: "첫 글", en: "First Post" },
    description: { ko: "첫 게시글을 작성했습니다", en: "Wrote your first post" },
    category: "community",
  },
  {
    id: "helper-10",
    icon: "💡",
    name: { ko: "도우미", en: "Helper" },
    description: { ko: "10개의 답변을 작성했습니다", en: "Wrote 10 answers" },
    category: "community",
  },
  {
    id: "streak-7",
    icon: "🔥",
    name: { ko: "7일 연속", en: "7 Day Streak" },
    description: { ko: "7일 연속 학습했습니다", en: "Studied for 7 consecutive days" },
    category: "streak",
  },
  {
    id: "streak-30",
    icon: "💎",
    name: { ko: "30일 연속", en: "30 Day Streak" },
    description: { ko: "30일 연속 학습했습니다", en: "Studied for 30 consecutive days" },
    category: "streak",
  },
  {
    id: "showcase-first",
    icon: "🚀",
    name: { ko: "첫 배포", en: "First Deploy" },
    description: { ko: "첫 프로젝트를 공유했습니다", en: "Shared your first project" },
    category: "community",
  },
  {
    id: "web3-pioneer",
    icon: "🔗",
    name: { ko: "Web3 파이오니어", en: "Web3 Pioneer" },
    description: { ko: "Part 6을 완료했습니다", en: "Completed Part 6" },
    category: "learning",
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id);
}
