import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import './App-mobile.css';
import type { GameState, GameMode, Player } from './types/game';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { VoiceGameScreen } from './components/VoiceGameScreen';
import { ShopScreen } from './components/ShopScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { checkAchievements, checkPurchaseAchievements } from './utils/achievements';
import { motion } from 'framer-motion';
import { initializeScaling } from './utils/scaling';

function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [gameMode, setGameMode] = useState<GameMode>('timeAttack');
  const [lastScore, setLastScore] = useState(0);
  const [gameDifficulty, setGameDifficulty] = useState(() => {
    const saved = localStorage.getItem('gameDifficulty');
    return saved ? parseInt(saved) : 1;
  });
  const [player, setPlayer] = useState<Player>(() => {
    const saved = localStorage.getItem('mathGamePlayer');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      totalScore: 0,
      coins: 0,
      achievements: [],
      items: [],
      stats: {
        totalProblems: 0,
        correctAnswers: 0,
        totalPlayTime: 0,
        bestScore: 0,
        currentStreak: 0,
        bestStreak: 0,
      }
    };
  });
  
  const [showAchievementNotification, setShowAchievementNotification] = useState<Achievement | null>(null);
  
  type Achievement = import('./types/game').Achievement;

  useEffect(() => {
    localStorage.setItem('mathGamePlayer', JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    // Initialize viewport scaling
    initializeScaling();
  }, []);

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('playing');
  };

  const handleEndGame = (score: number, problemsSolved: number, correctAnswers: number, maxStreak: number) => {
    setLastScore(score);
    setGameState('result');
    
    setPlayer(prev => {
      const updatedPlayer = {
        ...prev,
        totalScore: prev.totalScore + score,
        coins: prev.coins + Math.floor(score / 10),
        stats: {
          ...prev.stats,
          totalProblems: prev.stats.totalProblems + problemsSolved,
          correctAnswers: prev.stats.correctAnswers + correctAnswers,
          bestScore: Math.max(prev.stats.bestScore, score),
          currentStreak: 0,
          bestStreak: Math.max(prev.stats.bestStreak, maxStreak),
        }
      };
      
      // 実績のチェック
      const newAchievements = checkAchievements(updatedPlayer, gameMode, score);
      if (newAchievements.length > 0) {
        setShowAchievementNotification(newAchievements[0]);
        setTimeout(() => setShowAchievementNotification(null), 3000);
      }
      
      return updatedPlayer;
    });
  };

  const handleGoHome = () => {
    setGameState('home');
  };

  const handlePlayAgain = () => {
    setGameState('playing');
  };

  const handleOpenShop = () => {
    setGameState('shop');
  };
  
  const handleBuyItem = (itemId: string) => {
    const shopItems = [
      { id: 'timeBonus5', cost: 50 },
      { id: 'timeBonus10', cost: 100 },
      { id: 'scoreX2', cost: 150 },
      { id: 'scoreX3', cost: 300 },
      { id: 'hint', cost: 200 },
      { id: 'shield', cost: 250 },
    ];
    
    const item = shopItems.find(i => i.id === itemId);
    if (item && player.coins >= item.cost) {
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins - item.cost,
        items: [...prev.items, { 
          id: itemId, 
          name: '', 
          description: '', 
          icon: '', 
          cost: item.cost,
          effect: { type: 'timeBonus', value: 0 },
          owned: true,
          active: false 
        }],
      }));
      
      // 購入時の実績チェック
      const newAchievements = checkPurchaseAchievements(player);
      if (newAchievements.length > 0) {
        setShowAchievementNotification(newAchievements[0]);
        setTimeout(() => setShowAchievementNotification(null), 3000);
      }
    }
  };

  const handleOpenAchievements = () => {
    setGameState('achievements');
  };

  return (
    <div className="app">
      <div className="app-container">
        <AnimatePresence mode="wait">
          {gameState === 'home' && (
            <HomeScreen
              key="home"
              onStartGame={handleStartGame}
              onOpenShop={handleOpenShop}
              onOpenAchievements={handleOpenAchievements}
            />
          )}
          
          {gameState === 'playing' && gameMode !== 'voice' && (
            <GameScreen
              key="game"
              mode={gameMode}
              difficulty={gameDifficulty}
              player={player}
              onEndGame={handleEndGame}
              onGoHome={handleGoHome}
            />
          )}
          
          {gameState === 'playing' && gameMode === 'voice' && (
            <VoiceGameScreen
              key="voice-game"
              difficulty={gameDifficulty}
              player={player}
              onEndGame={handleEndGame}
              onGoHome={handleGoHome}
            />
          )}
          
          {gameState === 'result' && (
            <ResultScreen
              key="result"
              score={lastScore}
              onPlayAgain={handlePlayAgain}
              onGoHome={handleGoHome}
            />
          )}
          
          {gameState === 'shop' && (
            <ShopScreen
              key="shop"
              player={player}
              onBuyItem={handleBuyItem}
              onGoHome={handleGoHome}
            />
          )}
          
          {gameState === 'achievements' && (
            <AchievementsScreen
              key="achievements"
              player={player}
              onGoHome={handleGoHome}
            />
          )}
        </AnimatePresence>
        
        {showAchievementNotification && (
          <motion.div
            className="achievement-notification"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="notification-icon">{showAchievementNotification.icon}</div>
            <div className="notification-content">
              <h3>じっせいかいじょ！</h3>
              <p>{showAchievementNotification.name}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
