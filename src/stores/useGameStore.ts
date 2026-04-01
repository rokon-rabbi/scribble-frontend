import { create } from 'zustand';
import type {
  RoomPlayer, GameStatus, RoundStatus,
  RoundScoreEntry, LeaderboardEntry, WordChoice,
} from '@/lib/types';

interface GameState {
  // Room info
  roomCode: string | null;
  gameStatus: GameStatus;
  ownerId: string | null;

  // Players
  players: RoomPlayer[];

  // Round info
  currentRound: number;
  totalRounds: number;
  roundStatus: RoundStatus;
  drawerId: string | null;
  drawerUsername: string | null;
  wordHint: string;
  timeLimit: number;
  timeRemaining: number;

  // Drawer-only
  wordChoices: WordChoice[];
  isPickingWord: boolean;

  // Scores
  roundScores: RoundScoreEntry[];
  showRoundScoreboard: boolean;
  revealedWord: string | null;

  // Final
  leaderboard: LeaderboardEntry[];
  showFinalLeaderboard: boolean;

  // Actions
  setRoomCode: (code: string) => void;
  setGameStatus: (status: GameStatus) => void;
  setOwnerId: (id: string) => void;
  setPlayers: (players: RoomPlayer[]) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  markPlayerGuessedCorrectly: (playerId: string) => void;
  setRoundInfo: (info: {
    roundNumber: number;
    drawerId: string;
    drawerUsername: string;
    wordHint: string;
    timeLimit: number;
  }) => void;
  setTimeRemaining: (time: number) => void;
  setWordChoices: (words: WordChoice[]) => void;
  setIsPickingWord: (picking: boolean) => void;
  showRoundEnd: (word: string, scores: RoundScoreEntry[]) => void;
  hideRoundScoreboard: () => void;
  showGameEnd: (leaderboard: LeaderboardEntry[]) => void;
  resetGame: () => void;
}

const initialState = {
  roomCode: null,
  gameStatus: 'WAITING' as GameStatus,
  ownerId: null,
  players: [],
  currentRound: 0,
  totalRounds: 0,
  roundStatus: 'PENDING' as RoundStatus,
  drawerId: null,
  drawerUsername: null,
  wordHint: '',
  timeLimit: 80,
  timeRemaining: 80,
  wordChoices: [],
  isPickingWord: false,
  roundScores: [],
  showRoundScoreboard: false,
  revealedWord: null,
  leaderboard: [],
  showFinalLeaderboard: false,
};

export const useGameStore = create<GameState>()((set) => ({
  ...initialState,

  setRoomCode: (code) => set({ roomCode: code }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setOwnerId: (id) => set({ ownerId: id }),
  setPlayers: (players) => set({ players }),
  updatePlayerScore: (playerId, score) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, score } : p
      ),
    })),
  markPlayerGuessedCorrectly: (playerId) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, hasGuessedCorrectly: true } : p
      ),
    })),
  setRoundInfo: (info) =>
    set({
      currentRound: info.roundNumber,
      drawerId: info.drawerId,
      drawerUsername: info.drawerUsername,
      wordHint: info.wordHint,
      timeLimit: info.timeLimit,
      timeRemaining: info.timeLimit,
      roundStatus: 'DRAWING',
      roundScores: [],
      showRoundScoreboard: false,
      revealedWord: null,
    }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setWordChoices: (words) => set({ wordChoices: words, isPickingWord: true }),
  setIsPickingWord: (picking) =>
    set({ isPickingWord: picking, wordChoices: [] }),
  showRoundEnd: (word, scores) =>
    set({
      roundStatus: 'ENDED',
      revealedWord: word,
      roundScores: scores,
      showRoundScoreboard: true,
    }),
  hideRoundScoreboard: () => set({ showRoundScoreboard: false }),
  showGameEnd: (leaderboard) =>
    set({
      gameStatus: 'FINISHED',
      leaderboard,
      showFinalLeaderboard: true,
    }),
  resetGame: () => set(initialState),
}));
