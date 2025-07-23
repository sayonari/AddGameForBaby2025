import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Volume2, VolumeX } from 'lucide-react';
import type { GameMode, Problem, Player } from '../types/game';
import { generateProblem, checkAnswer, formatTime } from '../utils/gameLogic';
import { speechService } from '../utils/speech';
import { soundService } from '../utils/sound';
import { problemHistory } from '../utils/problemHistory';
import { NumberPad } from './NumberPad';
import { ProblemDisplay } from './ProblemDisplay';

interface GameScreenProps {
  mode: GameMode;
  difficulty: number;
  player: Player;
  onEndGame: (score: number, problemsSolved: number, correctAnswers: number, maxStreak: number) => void;
  onGoHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ mode, difficulty, onEndGame, onGoHome }) => {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(1, difficulty));
  const [previousProblem, setPreviousProblem] = useState<Problem | undefined>(undefined);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(mode === 'timeAttack' ? 120 : -1);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [problemCount, setProblemCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    soundService.init().then(() => {
      if (!isMuted) {
        soundService.playBGM();
      }
    });
    // ゲーム開始時に履歴をクリア
    problemHistory.clear();
    
    return () => {
      soundService.stopBGM();
      // ゲーム終了時にも履歴をクリア
      problemHistory.clear();
    };
  }, []);

  useEffect(() => {
    if (!isMuted) {
      speechService.speakProblem(problem.num1, problem.num2);
    }
  }, [problem, isMuted]);

  useEffect(() => {
    if (mode === 'timeAttack' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeRemaining]);

  useEffect(() => {
    if (mode === 'timeAttack' && timeRemaining === 0) {
      onEndGame(score, problemCount, correctCount, maxStreak);
    }
  }, [mode, timeRemaining, score, problemCount, correctCount, maxStreak, onEndGame]);

  useEffect(() => {
    const newLevel = Math.min(4, Math.floor(problemCount / 5) + 1);
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [problemCount, level]);

  const handleNumberClick = useCallback((num: number) => {
    if (userAnswer.length < 2) {
      soundService.playSound('click');
      const newAnswer = userAnswer + num;
      setUserAnswer(newAnswer);
      if (!isMuted) {
        speechService.speakNumber(parseInt(newAnswer));
      }
    }
  }, [userAnswer, isMuted]);

  const handleClear = useCallback(() => {
    soundService.playSound('click');
    setUserAnswer('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const correct = checkAnswer(problem, answer);

    // 問題を履歴に追加（答えを送信した後）
    problemHistory.addProblem(problem);

    if (correct) {
      soundService.playSound('correct');
      if (!isMuted) {
        speechService.speakCorrect();
      }
      setIsCorrect(true);
      setScore(prev => prev + 10 + streak);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      setProblemCount(prev => prev + 1);
      setCorrectCount(prev => prev + 1);

      setTimeout(() => {
        setPreviousProblem(problem);
        setProblem(generateProblem(level, difficulty, problem));
        setUserAnswer('');
        setIsCorrect(null);
      }, 1500);
    } else {
      soundService.playSound('incorrect');
      if (!isMuted) {
        speechService.speakIncorrect();
      }
      setIsCorrect(false);
      setStreak(0);

      if (mode === 'endless') {
        setTimeout(() => {
          onEndGame(score, problemCount, correctCount, maxStreak);
        }, 1500);
      } else {
        setTimeout(() => {
          setUserAnswer('');
          setIsCorrect(null);
        }, 1000);
      }
    }
  }, [userAnswer, problem, streak, level, difficulty, mode, score, problemCount, correctCount, maxStreak, onEndGame, isMuted]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundService.setMuted(newMuted);
    
    if (newMuted) {
      soundService.stopBGM();
      speechService.stop();
    } else {
      soundService.playBGM();
    }
  };

  return (
    <div className="game-screen game-screen-playing">
      <div className="game-header">
        <button className="home-button" onClick={() => {
          problemHistory.clear();
          onGoHome();
        }}>
          <Home size={30} />
        </button>
        
        <div className="score-display">
          <motion.div
            key={score}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            スコア: {score}
          </motion.div>
          {streak > 2 && (
            <motion.div 
              className="streak"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {streak}れんぞく！
            </motion.div>
          )}
        </div>

        {mode === 'timeAttack' && (
          <div className="timer">
            ⏱️ {formatTime(timeRemaining)}
          </div>
        )}

        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? <VolumeX size={25} /> : <Volume2 size={25} />}
        </button>
      </div>

      <div className="game-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${problem.num1}-${problem.num2}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ProblemDisplay 
              problem={problem} 
              isCorrect={isCorrect}
              level={level}
            />
          </motion.div>
        </AnimatePresence>

        <div className="answer-display">
          <motion.div 
            className={`answer-box ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
            animate={isCorrect !== null ? { scale: [1, 1.1, 1] } : {}}
          >
            {userAnswer || '?'}
          </motion.div>
        </div>

        <NumberPad
          onNumberClick={handleNumberClick}
          onClear={handleClear}
          onSubmit={handleSubmit}
          disabled={isCorrect !== null}
        />
      </div>

      {isCorrect === true && (
        <motion.div
          className="celebration"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          🎉 せいかい！ 🎉
        </motion.div>
      )}
    </div>
  );
};