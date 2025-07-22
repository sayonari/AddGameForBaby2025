import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, RotateCcw, Star } from 'lucide-react';
import { soundService } from '../utils/sound';
import { speechService } from '../utils/speech';

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, onPlayAgain, onGoHome }) => {
  useEffect(() => {
    soundService.playSound('complete');
    const message = score >= 100 ? 'すばらしい！てんさいだね！' : 
                   score >= 50 ? 'よくできました！' : 
                   'がんばったね！';
    speechService.speak(message);
  }, [score]);

  const getStars = () => {
    if (score >= 100) return 3;
    if (score >= 50) return 2;
    return 1;
  };

  const stars = getStars();

  return (
    <div className="result-screen">
      <motion.div
        className="result-content"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <h2>けっか</h2>
        
        <motion.div 
          className="score-display"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="score-label">スコア</div>
          <motion.div 
            className="score-value"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {score}
          </motion.div>
        </motion.div>

        <div className="stars">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={index < stars ? {
                scale: 1,
                rotate: 0,
              } : {
                scale: 0.5,
                rotate: 0,
                opacity: 0.3
              }}
              transition={{ 
                delay: 0.6 + index * 0.2,
                type: "spring",
                stiffness: 300,
                damping: 10
              }}
            >
              <Star size={60} fill={index < stars ? "#FFD700" : "transparent"} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {score >= 100 ? '🎉 てんさい！ 🎉' :
           score >= 50 ? '✨ すごい！ ✨' :
           '💪 がんばったね！ 💪'}
        </motion.div>

        <div className="result-buttons">
          <motion.button
            className="result-button play-again"
            onClick={onPlayAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <RotateCcw size={30} />
            <span>もういちど</span>
          </motion.button>

          <motion.button
            className="result-button home"
            onClick={onGoHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Home size={30} />
            <span>ホーム</span>
          </motion.button>
        </div>

        <motion.div
          className="coins-earned"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span className="coin-icon">🪙</span>
          <span>+{Math.floor(score / 10)} コイン</span>
        </motion.div>
      </motion.div>

      <div className="confetti">
        {score >= 50 && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="confetti-piece"
            initial={{ 
              y: -100, 
              x: Math.random() * window.innerWidth,
              rotate: 0
            }}
            animate={{ 
              y: window.innerHeight + 100,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: "linear"
            }}
            style={{
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][i % 5]
            }}
          />
        ))}
      </div>
    </div>
  );
};