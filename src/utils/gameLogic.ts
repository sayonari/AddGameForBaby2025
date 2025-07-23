import type { Problem } from '../types/game';
import { problemHistory } from './problemHistory';

export const generateProblem = (level: number, difficulty: number = 1, previousProblem?: Problem): Problem => {
  let num1: number, num2: number;
  let attempts = 0;
  const maxAttempts = 30;
  
  // 前回の問題と同じにならないように、多様な問題を生成
  do {
    switch (difficulty) {
      case 1: // 3歳向け：繰り上がりなし（答えが10以下）
        // 答えを先に決めて、それに合う組み合わせを作る
        const targetSum1 = Math.floor(Math.random() * 9) + 2; // 答えは2〜10
        num1 = Math.floor(Math.random() * Math.min(5, targetSum1 - 1)) + 1; // num1は1〜5
        num2 = targetSum1 - num1;
        // num2も5以下になるように調整
        if (num2 > 5) {
          num1 = Math.floor(Math.random() * 5) + 1;
          num2 = Math.floor(Math.random() * 5) + 1;
        }
        break;
        
      case 2: // 4歳向け：繰り上がりあり（1桁同士）
        // より多様な組み合わせ
        if (Math.random() < 0.5) {
          // 繰り上がりあり（答えが11〜18）
          const targetSum2 = Math.floor(Math.random() * 8) + 11;
          num1 = Math.floor(Math.random() * 8) + 2; // 2〜9
          num2 = targetSum2 - num1;
          if (num2 < 2 || num2 > 9) {
            num1 = Math.floor(Math.random() * 7) + 3;
            num2 = Math.floor(Math.random() * 7) + 3;
          }
        } else {
          // 繰り上がりなし（答えが10以下）
          num1 = Math.floor(Math.random() * 5) + 1;
          num2 = Math.floor(Math.random() * (9 - num1)) + 1;
        }
        break;
        
      case 3: // 5歳向け：1桁+2桁
        if (Math.random() < 0.7) {
          // 1桁 + 2桁
          num1 = Math.floor(Math.random() * 9) + 1; // 1〜9
          num2 = Math.floor(Math.random() * 10) + 10; // 10〜19
        } else {
          // 2桁 + 1桁（順序を変える）
          num1 = Math.floor(Math.random() * 10) + 10; // 10〜19
          num2 = Math.floor(Math.random() * 9) + 1; // 1〜9
        }
        break;
        
      case 4: // 6歳向け：2桁同士
        // より多様な2桁の組み合わせ
        num1 = Math.floor(Math.random() * 15) + 10; // 10〜24
        num2 = Math.floor(Math.random() * 15) + 10; // 10〜24
        break;
        
      default:
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
    }
    
    attempts++;
    if (attempts >= maxAttempts) break;
    
  } while (
    // 履歴と比較して、最近使った問題や似た問題を避ける
    problemHistory.isSimilarToRecent(num1, num2) ||
    (previousProblem &&
     // 直前の問題とも比較
     ((num1 === previousProblem.num1 && num2 === previousProblem.num2) ||
      (num1 === previousProblem.num2 && num2 === previousProblem.num1)))
  );
  
  // 50%の確率で順序を入れ替えてバリエーションを増やす
  if (Math.random() < 0.5 && num1 !== num2) {
    [num1, num2] = [num2, num1];
  }
  
  const problem = {
    num1,
    num2,
    answer: num1 + num2,
  };
  
  // 履歴に追加
  problemHistory.addProblem(problem);
  
  return problem;
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