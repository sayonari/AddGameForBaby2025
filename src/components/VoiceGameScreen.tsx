import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Mic, MicOff } from 'lucide-react';
import type { Problem, Player } from '../types/game';
import { generateProblem, checkAnswer } from '../utils/gameLogic';
import { speechService } from '../utils/speech';
import { soundService } from '../utils/sound';
import { voiceRecognitionService } from '../utils/voiceRecognition';
import { ProblemDisplay } from './ProblemDisplay';

interface VoiceGameScreenProps {
  difficulty: number;
  player: Player;
  onEndGame: (score: number, problemsSolved: number, correctAnswers: number, maxStreak: number) => void;
  onGoHome: () => void;
}

export const VoiceGameScreen: React.FC<VoiceGameScreenProps> = ({ difficulty, onGoHome }) => {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(1, difficulty));
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [problemCount, setProblemCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!voiceRecognitionService.isSupported()) {
      setIsSupported(false);
    }
    
    speechService.speakProblem(problem.num1, problem.num2);
    
    return () => {
      voiceRecognitionService.stopListening();
    };
  }, []);

  useEffect(() => {
    speechService.speakProblem(problem.num1, problem.num2);
  }, [problem]);

  useEffect(() => {
    const newLevel = Math.min(4, Math.floor(problemCount / 5) + 1);
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [problemCount, level]);

  const handleVoiceResult = useCallback((text: string) => {
    setUserAnswer(text);
    speechService.speakNumber(parseInt(text));
    
    // 自動的に答え合わせ
    setTimeout(() => {
      const answer = parseInt(text);
      const correct = checkAnswer(problem, answer);
      
      if (correct) {
        soundService.playSound('correct');
        speechService.speakCorrect();
        setIsCorrect(true);
        setScore(prev => prev + 10 + streak);
        setStreak(prev => prev + 1);
        setProblemCount(prev => prev + 1);

        setTimeout(() => {
          setProblem(generateProblem(level, difficulty));
          setUserAnswer('');
          setIsCorrect(null);
        }, 2000);
      } else {
        soundService.playSound('incorrect');
        speechService.speakIncorrect();
        setIsCorrect(false);
        setStreak(0);

        setTimeout(() => {
          setUserAnswer('');
          setIsCorrect(null);
        }, 1500);
      }
    }, 500);
  }, [problem, streak, level]);

  const toggleListening = () => {
    if (isListening) {
      voiceRecognitionService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceRecognitionService.startListening(
        handleVoiceResult,
        () => setIsListening(false)
      );
    }
  };

  if (!isSupported) {
    return (
      <div className="game-screen">
        <div className="game-header">
          <button className="home-button" onClick={onGoHome}>
            <Home size={30} />
          </button>
        </div>
        <div className="not-supported">
          <h2>音声認識がサポートされていません</h2>
          <p>お使いのブラウザでは音声認識機能が利用できません。</p>
          <p>ChromeまたはSafariをお使いください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen voice-mode">
      <div className="game-header">
        <button className="home-button" onClick={onGoHome}>
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

        <div className="voice-controls">
          <div className="answer-display">
            <motion.div 
              className={`answer-box ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}
              animate={isCorrect !== null ? { scale: [1, 1.1, 1] } : {}}
            >
              {userAnswer || '?'}
            </motion.div>
          </div>

          <motion.button
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCorrect !== null}
          >
            {isListening ? <Mic size={60} /> : <MicOff size={60} />}
            <span>{isListening ? 'きいています...' : 'マイクをタップ'}</span>
          </motion.button>

          {isListening && (
            <motion.div
              className="listening-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
            </motion.div>
          )}

          <div className="voice-tips">
            <p>こたえを こえで いってね！</p>
            <p>「いち」「にー」「さん」「よん」「ご」など</p>
            <p className="voice-tip-small">※「に」は「にー」と のばして いってみて</p>
          </div>
        </div>
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