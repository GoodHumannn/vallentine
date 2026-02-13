export interface LevelData {
  id: number;
  name: string;
  unlockDate: string; // ISO String with Timezone preferred
  theme: string;
  bgGradient: string; // CSS class for background gradient
  paragraph: string;
  loveNotes: string[];
  minigameType: 'bloomRose' | 'steadyHeart' | 'memoryJar' | 'protectHeart' | 'connectHearts' | 'hugRhythm' | 'catchKisses' | 'mysteryUnlock';
  icon: string;
  audioSrc: string; // URL to audio file
}

export interface GameResult {
  levelId: number;
  score: number;
  completed: boolean;
  timestamp: number;
}

export interface AppState {
  introShown: boolean;
  unlockedLevels: number[];
  gameResults: GameResult[];
}

export enum GameStatus {
  IDLE,
  PLAYING,
  WON,
  LOST
}