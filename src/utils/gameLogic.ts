import type { Problem } from '../types/game';

export const generateProblem = (level: number, difficulty: number = 1): Problem => {
  let min = 1;
  let max = 5;
  
  // 難易度に応じて数値の範囲を設定
  switch (difficulty) {
    case 1: // かんたん (1-5)
      min = 1;
      max = 5;
      break;
    case 2: // ふつう (1-10)
      min = 1;
      max = 10;
      break;
    case 3: // むずかしい (5-15)
      min = 5;
      max = 15;
      break;
    case 4: // とてもむずかしい (10-20)
      min = 10;
      max = 20;
      break;
  }
  
  // レベルによる微調整（10問ごとに少し難しくなる）
  const levelBonus = Math.floor(level / 10);
  max = Math.min(max + levelBonus, 25);
  
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    num1,
    num2,
    answer: num1 + num2,
  };
};

export const checkAnswer = (problem: Problem, userAnswer: number): boolean => {
  return problem.answer === userAnswer;
};

export const calculateScore = (isCorrect: boolean, timeElapsed: number, streak: number): number => {
  if (!isCorrect) return 0;
  
  const baseScore = 10;
  const timeBonus = Math.max(0, 10 - Math.floor(timeElapsed / 1000));
  const streakBonus = Math.floor(streak / 3) * 5;
  
  return baseScore + timeBonus + streakBonus;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};