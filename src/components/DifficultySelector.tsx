import React from 'react';
import { motion } from 'framer-motion';

interface DifficultySelectorProps {
  difficulty: number;
  onDifficultyChange: (difficulty: number) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  difficulty, 
  onDifficultyChange 
}) => {
  const difficulties = [
    { level: 1, label: 'かんたん', range: '1〜5', color: '#4facfe' },
    { level: 2, label: 'ふつう', range: '1〜10', color: '#667eea' },
    { level: 3, label: 'むずかしい', range: '5〜15', color: '#764ba2' },
    { level: 4, label: 'とてもむずかしい', range: '10〜20', color: '#f5576c' },
  ];

  return (
    <div className="difficulty-selector">
      <h3>むずかしさ</h3>
      <div className="difficulty-options">
        {difficulties.map((diff) => (
          <motion.button
            key={diff.level}
            className={`difficulty-option ${difficulty === diff.level ? 'active' : ''}`}
            onClick={() => onDifficultyChange(diff.level)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderColor: diff.color,
              backgroundColor: difficulty === diff.level ? diff.color : 'transparent',
              color: difficulty === diff.level ? 'white' : diff.color
            }}
          >
            <span className="difficulty-label">{diff.label}</span>
            <span className="difficulty-range">{diff.range}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};