// ============ Auth ============
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  totalGamesPlayed: number;
  totalWins: number;
  totalScore: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============ Room/Game ============
export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';
export type RoundStatus = 'PENDING' | 'DRAWING' | 'ENDED';
export type PlayerRole = 'DRAWER' | 'GUESSER' | 'SPECTATOR';

export interface RoomInfo {
  id: string;
  roomCode: string;
  status: GameStatus;
  maxPlayers: number;
  currentPlayerCount: number;
  ownerUsername: string;
  roundsPerPlayer: number;
  turnTimeSeconds: number;
}

export interface CreateRoomRequest {
  maxPlayers: number;
  roundsPerPlayer: number;
  turnTimeSeconds: number;
}

export interface RoomPlayer {
  id: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  isConnected: boolean;
  isDrawing: boolean;
  hasGuessedCorrectly: boolean;
}

// ============ Game Events (WebSocket payloads) ============
export interface PlayerJoinedEvent {
  username: string;
  players: RoomPlayer[];
}

export interface GameStartEvent {
  drawerId: string;
  roundNumber: number;
  totalRounds: number;
}

export interface RoundStartEvent {
  drawerId: string;
  drawerUsername: string;
  wordHint: string;
  roundNumber: number;
  timeLimit: number;
}

export interface WordChoicesEvent {
  words: WordChoice[];
}

export interface WordChoice {
  id: string;
  word: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface GuessResultEvent {
  playerId: string;
  username: string;
  isCorrect: boolean;
}

export interface RoundEndEvent {
  word: string;
  scores: RoundScoreEntry[];
  roundNumber: number;
}

export interface RoundScoreEntry {
  playerId: string;
  username: string;
  pointsEarned: number;
  role: 'DRAWER' | 'GUESSER';
  totalScore: number;
}

export interface GameEndEvent {
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  playerId: string;
  username: string;
  avatarUrl: string | null;
  finalScore: number;
  rank: number;
}

// ============ Canvas ============
export type CanvasTool = 'BRUSH' | 'ERASER' | 'FILL';

export interface StrokeData {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  tool: CanvasTool;
}

export interface StrokeMessage {
  strokeOrder: number;
  pointsData: { x: number; y: number }[];
  color: string;
  brushSize: number;
  tool: CanvasTool;
}

// ============ Chat ============
export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  type: 'guess' | 'correct' | 'system' | 'chat';
  timestamp: number;
}

// ============ API Response ============
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}
