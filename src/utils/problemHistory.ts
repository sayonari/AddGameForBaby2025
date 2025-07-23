import type { Problem } from '../types/game';

class ProblemHistory {
  private history: Problem[] = [];
  private maxHistorySize = 10;

  addProblem(problem: Problem) {
    this.history.push(problem);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  isRecentlyUsed(num1: number, num2: number): boolean {
    return this.history.some(p => 
      (p.num1 === num1 && p.num2 === num2) ||
      (p.num1 === num2 && p.num2 === num1)
    );
  }

  isSimilarToRecent(num1: number, num2: number): boolean {
    if (this.history.length === 0) return false;
    
    // 最近の3問と比較
    const recentProblems = this.history.slice(-3);
    
    return recentProblems.some(p => {
      // 全く同じ数字の組み合わせ
      if ((p.num1 === num1 && p.num2 === num2) || (p.num1 === num2 && p.num2 === num1)) {
        return true;
      }
      
      // 片方の数字が同じで、もう片方が±1の範囲
      if ((p.num1 === num1 && Math.abs(p.num2 - num2) <= 1) ||
          (p.num2 === num2 && Math.abs(p.num1 - num1) <= 1) ||
          (p.num1 === num2 && Math.abs(p.num2 - num1) <= 1) ||
          (p.num2 === num1 && Math.abs(p.num1 - num2) <= 1)) {
        return true;
      }
      
      return false;
    });
  }

  clear() {
    this.history = [];
  }
}

export const problemHistory = new ProblemHistory();