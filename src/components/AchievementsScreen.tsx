import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Trophy, Lock, CheckCircle } from 'lucide-react';
import type { Player } from '../types/game';
import { ACHIEVEMENTS, getAchievementProgress } from '../utils/achievements';
import { soundService } from '../utils/sound';

interface AchievementsScreenProps {
  player: Player;
  onGoHome: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ player, onGoHome }) => {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      soundService.stopBGM();
    };
  }, []);

  const unlockedCount = player.achievements.filter(a => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="achievements-screen">
      <div className="achievements-header">
        <button className="home-button" onClick={onGoHome}>
          <Home size={30} />
        </button>
        
        <h1>
          <Trophy size={40} />
          <span>じっせき</span>
        </h1>
        
        <div className="achievements-stats">
          <div className="stat-item">
            <span className="stat-label">かいじょ</span>
            <span className="stat-value">{unlockedCount}/{totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">たっせいど</span>
            <span className="stat-value">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const playerAchievement = player.achievements.find(a => a.id === achievement.id);
          const isUnlocked = playerAchievement?.unlocked || false;
          const progress = getAchievementProgress(achievement, player.stats);
          
          return (
            <motion.div
              key={achievement.id}
              className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${selectedAchievement === achievement.id ? 'selected' : ''}`}
              onClick={() => setSelectedAchievement(selectedAchievement === achievement.id ? null : achievement.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ACHIEVEMENTS.indexOf(achievement) * 0.05 }}
            >
              <div className="achievement-icon">
                {isUnlocked ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    {achievement.icon}
                  </motion.div>
                ) : (
                  <Lock size={40} />
                )}
              </div>
              
              <h3>{achievement.name}</h3>
              
              {isUnlocked && (
                <motion.div 
                  className="unlocked-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <CheckCircle size={20} />
                </motion.div>
              )}
              
              {!isUnlocked && progress > 0 && (
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
              
              {selectedAchievement === achievement.id && (
                <motion.div 
                  className="achievement-tooltip"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>{achievement.description}</p>
                  {playerAchievement?.unlockedAt && (
                    <p className="unlock-date">
                      {new Date(playerAchievement.unlockedAt).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="achievement-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="summary-stats">
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <span className="stat-number">{player.stats.totalProblems}</span>
            <span className="stat-label">といたもんだい</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-number">{player.stats.correctAnswers}</span>
            <span className="stat-label">せいかい</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">{player.stats.bestStreak}</span>
            <span className="stat-label">さいこうれんぞく</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <span className="stat-number">{player.stats.bestScore}</span>
            <span className="stat-label">ハイスコア</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};