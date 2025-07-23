import React from 'react';
import { motion } from 'framer-motion';
import type { Problem } from '../types/game';

interface ProblemDisplayProps {
  problem: Problem;
  isCorrect: boolean | null;
  level: number;
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem, isCorrect, level }) => {
  // 問題に基づいて固定の果物を選択（問題が変わるまで同じ果物を使用）
  const icons = ['🍎', '🍊', '🍓', '🍇', '🍌'];
  const iconIndex = (problem.num1 + problem.num2) % icons.length;
  const icon = icons[iconIndex];
  
  const renderVisualNumber = (num: number) => {
    const items = [];
    const maxVisualItems = 10; // 視覚的な表示は最大10個まで
    const displayCount = Math.min(num, maxVisualItems);
    
    for (let i = 0; i < displayCount; i++) {
      items.push(
        <motion.span
          key={i}
          className="visual-item"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.05, type: "spring" }}
        >
          {icon}
        </motion.span>
      );
    }
    
    // 10個を超える場合は「...」を表示
    if (num > maxVisualItems) {
      items.push(
        <motion.span
          key="more"
          className="visual-more"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          +{num - maxVisualItems}
        </motion.span>
      );
    }
    
    return <div className="visual-number">{items}</div>;
  };

  return (
    <div className="problem-display">
      <div className="problem-visual">
        {level <= 2 && problem.num1 <= 15 && problem.num2 <= 15 && (
          <>
            <div className="number-group">
              {renderVisualNumber(problem.num1)}
              <div className="number-text">{problem.num1}</div>
            </div>
            
            <motion.div 
              className="operator"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              +
            </motion.div>
            
            <div className="number-group">
              {renderVisualNumber(problem.num2)}
              <div className="number-text">{problem.num2}</div>
            </div>
          </>
        )}
      </div>

      <div className="problem-text">
        <motion.span 
          className="number"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {problem.num1}
        </motion.span>
        
        <motion.span 
          className="operator"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          +
        </motion.span>
        
        <motion.span 
          className="number"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {problem.num2}
        </motion.span>
        
        <motion.span 
          className="equals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          =
        </motion.span>
        
        <motion.span 
          className="question"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ?
        </motion.span>
      </div>

      {isCorrect === true && (
        <motion.div
          className="feedback correct"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          ✨ すごい！ ✨
        </motion.div>
      )}

      {isCorrect === false && (
        <motion.div
          className="feedback incorrect"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          もういちど！
        </motion.div>
      )}
    </div>
  );
};