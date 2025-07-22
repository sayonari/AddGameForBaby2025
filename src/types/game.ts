export type GameMode = 'timeAttack' | 'endless' | 'practice' | 'voice';

export type GameState = 'home' | 'playing' | 'result' | 'shop' | 'achievements';

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface GameSession {
  mode: GameMode;
  problems: Problem[];
  currentProblemIndex: number;
  score: number;
  timeRemaining: number;
  mistakes: number;
  startTime: Date;
  endTime?: Date;
}

export interface Player {
  totalScore: number;
  coins: number;
  achievements: Achievement[];
  items: Item[];
  stats: PlayerStats;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  effect: ItemEffect;
  owned: boolean;
  active: boolean;
}

export interface ItemEffect {
  type: 'timeBonus' | 'scoreMultiplier' | 'hintUnlock' | 'mistakeProtection';
  value: number;
}

export interface PlayerStats {
  totalProblems: number;
  correctAnswers: number;
  totalPlayTime: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
}