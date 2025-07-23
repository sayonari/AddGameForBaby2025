import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, ShoppingBag, Mic, Settings } from 'lucide-react';
import type { GameMode } from '../types/game';
import { soundService } from '../utils/sound';
import { DifficultySelector } from './DifficultySelector';

interface HomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStartGame, 
  onOpenShop, 
  onOpenAchievements 
}) => {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem('gameDifficulty');
    return saved ? parseInt(saved) : 1;
  });

  const initializeAudio = async () => {
    if (!audioInitialized) {
      await soundService.init();
      soundService.playBGM('openingBGM');
      setAudioInitialized(true);
    }
  };

  useEffect(() => {
    return () => {
      soundService.stopBGM();
    };
  }, []);

  const handleStartGame = async (mode: GameMode) => {
    await initializeAudio();
    onStartGame(mode);
  };

  const handleOpenShop = async () => {
    await initializeAudio();
    onOpenShop();
  };

  const handleOpenAchievements = async () => {
    await initializeAudio();
    onOpenAchievements();
  };

  const handleDifficultyChange = (newDifficulty: number) => {
    setDifficulty(newDifficulty);
    localStorage.setItem('gameDifficulty', newDifficulty.toString());
    soundService.playSound('click');
  };

  const toggleDifficulty = async () => {
    await initializeAudio();
    setShowDifficulty(!showDifficulty);
    soundService.playSound('click');
  };

  return (
    <div className="home-screen">
      <motion.div 
        className="title"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <h1>たのしい たしざん</h1>
        <div className="subtitle">🌟 すうじであそぼう 🌟</div>
      </motion.div>

      <div className="game-modes">
        <motion.button
          className="mode-button time-attack"
          onClick={() => handleStartGame('timeAttack')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Play size={40} />
          <span>30びょう チャレンジ</span>
        </motion.button>

        <motion.button
          className="mode-button endless"
          onClick={() => handleStartGame('endless')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Play size={40} />
          <span>エンドレス モード</span>
        </motion.button>

        <motion.button
          className="mode-button practice"
          onClick={() => handleStartGame('practice')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Play size={40} />
          <span>れんしゅう モード</span>
        </motion.button>

        <motion.button
          className="mode-button voice"
          onClick={() => handleStartGame('voice')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Mic size={40} />
          <span>こえで こたえる</span>
        </motion.button>
      </div>

      {showDifficulty && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DifficultySelector 
            difficulty={difficulty} 
            onDifficultyChange={handleDifficultyChange} 
          />
        </motion.div>
      )}

      <div className="bottom-buttons">
        <motion.button
          className="icon-button shop"
          onClick={handleOpenShop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ShoppingBag size={30} />
          <span>おみせ</span>
        </motion.button>

        <motion.button
          className="icon-button achievements"
          onClick={handleOpenAchievements}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Trophy size={30} />
          <span>じっせき</span>
        </motion.button>

        <motion.button
          className="icon-button settings"
          onClick={toggleDifficulty}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Settings size={30} />
          <span>むずかしさ</span>
        </motion.button>
      </div>

      <motion.div 
        className="floating-stars"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="star"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};