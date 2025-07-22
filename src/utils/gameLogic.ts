import type { Problem } from '../types/game';

export const generateProblem = (level: number): Problem => {
  let maxSum = 5;
  
  switch (level) {
    case 1:
      maxSum = 5;
      break;
    case 2:
      maxSum = 10;
      break;
    case 3:
      maxSum = 20;
      break;
    case 4:
      maxSum = 30;
      break;
    default:
      maxSum = 10;
  }
  
  const answer = Math.floor(Math.random() * maxSum) + 1;
  const num1 = Math.floor(Math.random() * answer) + 1;
  const num2 = answer - num1;
  
  return {
    num1,
    num2,
    answer,
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