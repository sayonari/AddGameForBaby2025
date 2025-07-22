import type { Achievement, Player, PlayerStats } from '../types/game';

// 実績の定義
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_correct',
    name: 'はじめてのせいかい',
    description: 'はじめて正解しました！',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'ten_correct',
    name: '10もんせいかい',
    description: '10問正解しました！',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'fifty_correct',
    name: '50もんせいかい',
    description: '50問正解しました！',
    icon: '🌠',
    unlocked: false,
  },
  {
    id: 'hundred_correct',
    name: '100もんせいかい',
    description: '100問正解しました！',
    icon: '💫',
    unlocked: false,
  },
  {
    id: 'streak_5',
    name: '5れんぞく',
    description: '5問連続で正解！',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'streak_10',
    name: '10れんぞく',
    description: '10問連続で正解！',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'streak_20',
    name: '20れんぞく',
    description: '20問連続で正解！',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'score_100',
    name: '100てんとっぱ',
    description: 'スコアが100点を超えました！',
    icon: '💯',
    unlocked: false,
  },
  {
    id: 'score_500',
    name: '500てんとっぱ',
    description: 'スコアが500点を超えました！',
    icon: '🎖️',
    unlocked: false,
  },
  {
    id: 'score_1000',
    name: '1000てんとっぱ',
    description: 'スコアが1000点を超えました！',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'coins_100',
    name: 'コインあつめ',
    description: '100コイン集めました！',
    icon: '💰',
    unlocked: false,
  },
  {
    id: 'coins_500',
    name: 'コインマスター',
    description: '500コイン集めました！',
    icon: '💎',
    unlocked: false,
  },
  {
    id: 'perfect_accuracy',
    name: 'かんぺき',
    description: '10問連続で全問正解！',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    name: 'スピードスター',
    description: '30秒チャレンジで20問以上正解！',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'voice_master',
    name: 'こえのたつじん',
    description: '声で10問正解！',
    icon: '🎤',
    unlocked: false,
  },
  {
    id: 'shop_lover',
    name: 'おかいものだいすき',
    description: '初めてアイテムを買いました！',
    icon: '🛍️',
    unlocked: false,
  },
  {
    id: 'item_collector',
    name: 'アイテムコレクター',
    description: 'すべてのアイテムを集めました！',
    icon: '🎁',
    unlocked: false,
  },
  {
    id: 'play_time_30',
    name: '30ぷんプレイ',
    description: '合計30分プレイしました！',
    icon: '⏰',
    unlocked: false,
  },
  {
    id: 'play_time_60',
    name: '1じかんプレイ',
    description: '合計1時間プレイしました！',
    icon: '⏳',
    unlocked: false,
  },
  {
    id: 'early_bird',
    name: 'あさがたキッズ',
    description: '朝6時～9時にプレイ！',
    icon: '🌅',
    unlocked: false,
  },
];

// 実績のチェックと解除
export function checkAchievements(player: Player, gameMode?: string, sessionScore?: number): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  const now = new Date();
  const hour = now.getHours();

  // 初回正解
  if (!player.achievements.find(a => a.id === 'first_correct')?.unlocked && 
      player.stats.correctAnswers >= 1) {
    newlyUnlocked.push(unlockAchievement('first_correct', player));
  }

  // 正解数による実績
  const correctAnswers = player.stats.correctAnswers;
  if (correctAnswers >= 10 && !player.achievements.find(a => a.id === 'ten_correct')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('ten_correct', player));
  }
  if (correctAnswers >= 50 && !player.achievements.find(a => a.id === 'fifty_correct')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('fifty_correct', player));
  }
  if (correctAnswers >= 100 && !player.achievements.find(a => a.id === 'hundred_correct')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('hundred_correct', player));
  }

  // 連続正解による実績
  const bestStreak = player.stats.bestStreak;
  if (bestStreak >= 5 && !player.achievements.find(a => a.id === 'streak_5')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('streak_5', player));
  }
  if (bestStreak >= 10 && !player.achievements.find(a => a.id === 'streak_10')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('streak_10', player));
  }
  if (bestStreak >= 20 && !player.achievements.find(a => a.id === 'streak_20')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('streak_20', player));
  }

  // スコアによる実績
  const bestScore = player.stats.bestScore;
  if (bestScore >= 100 && !player.achievements.find(a => a.id === 'score_100')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('score_100', player));
  }
  if (bestScore >= 500 && !player.achievements.find(a => a.id === 'score_500')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('score_500', player));
  }
  if (bestScore >= 1000 && !player.achievements.find(a => a.id === 'score_1000')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('score_1000', player));
  }

  // コインによる実績
  if (player.coins >= 100 && !player.achievements.find(a => a.id === 'coins_100')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('coins_100', player));
  }
  if (player.coins >= 500 && !player.achievements.find(a => a.id === 'coins_500')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('coins_500', player));
  }

  // プレイ時間による実績
  const playTimeMinutes = Math.floor(player.stats.totalPlayTime / 60);
  if (playTimeMinutes >= 30 && !player.achievements.find(a => a.id === 'play_time_30')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('play_time_30', player));
  }
  if (playTimeMinutes >= 60 && !player.achievements.find(a => a.id === 'play_time_60')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('play_time_60', player));
  }

  // 朝型キッズ実績
  if (hour >= 6 && hour < 9 && !player.achievements.find(a => a.id === 'early_bird')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('early_bird', player));
  }

  // アイテムコレクター実績
  if (player.items.length === 6 && !player.achievements.find(a => a.id === 'item_collector')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('item_collector', player));
  }

  // ゲームモード固有の実績
  if (gameMode === 'timeAttack' && sessionScore && sessionScore >= 200 && 
      !player.achievements.find(a => a.id === 'speed_demon')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('speed_demon', player));
  }

  return newlyUnlocked;
}

// 実績を解除する
function unlockAchievement(achievementId: string, player: Player): Achievement {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) throw new Error(`Achievement ${achievementId} not found`);

  const unlockedAchievement = {
    ...achievement,
    unlocked: true,
    unlockedAt: new Date(),
  };

  // プレイヤーの実績リストを更新
  const existingIndex = player.achievements.findIndex(a => a.id === achievementId);
  if (existingIndex >= 0) {
    player.achievements[existingIndex] = unlockedAchievement;
  } else {
    player.achievements.push(unlockedAchievement);
  }

  return unlockedAchievement;
}

// 実績の進捗を取得
export function getAchievementProgress(achievement: Achievement, stats: PlayerStats): number {
  switch (achievement.id) {
    case 'first_correct':
      return Math.min(stats.correctAnswers, 1);
    case 'ten_correct':
      return Math.min(stats.correctAnswers / 10, 1);
    case 'fifty_correct':
      return Math.min(stats.correctAnswers / 50, 1);
    case 'hundred_correct':
      return Math.min(stats.correctAnswers / 100, 1);
    case 'streak_5':
      return Math.min(stats.bestStreak / 5, 1);
    case 'streak_10':
      return Math.min(stats.bestStreak / 10, 1);
    case 'streak_20':
      return Math.min(stats.bestStreak / 20, 1);
    case 'score_100':
      return Math.min(stats.bestScore / 100, 1);
    case 'score_500':
      return Math.min(stats.bestScore / 500, 1);
    case 'score_1000':
      return Math.min(stats.bestScore / 1000, 1);
    case 'play_time_30':
      return Math.min(stats.totalPlayTime / (30 * 60), 1);
    case 'play_time_60':
      return Math.min(stats.totalPlayTime / (60 * 60), 1);
    default:
      return achievement.unlocked ? 1 : 0;
  }
}

// 購入時の実績チェック
export function checkPurchaseAchievements(player: Player): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  
  if (player.items.length === 1 && !player.achievements.find(a => a.id === 'shop_lover')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('shop_lover', player));
  }
  
  return newlyUnlocked;
}

// 音声認識モードの実績チェック
export function checkVoiceAchievements(player: Player, voiceCorrectCount: number): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  
  if (voiceCorrectCount >= 10 && !player.achievements.find(a => a.id === 'voice_master')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('voice_master', player));
  }
  
  return newlyUnlocked;
}

// 完璧な正解率の実績チェック
export function checkPerfectAccuracy(player: Player): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  
  const recentProblems = player.stats.totalProblems % 10;
  const recentCorrect = player.stats.correctAnswers % 10;
  
  if (recentProblems >= 10 && recentProblems === recentCorrect && 
      !player.achievements.find(a => a.id === 'perfect_accuracy')?.unlocked) {
    newlyUnlocked.push(unlockAchievement('perfect_accuracy', player));
  }
  
  return newlyUnlocked;
}