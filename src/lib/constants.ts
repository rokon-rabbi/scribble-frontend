export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const BRUSH_SIZES = [3, 5, 8, 12, 20] as const;

export const COLOR_SWATCHES = [
  '#2D3436', // black
  '#636E72', // gray
  '#FFFFFF', // white
  '#FF6B6B', // red
  '#FDCB6E', // orange
  '#FFEAA7', // yellow
  '#00B894', // green
  '#00CEC9', // teal
  '#74B9FF', // blue
  '#6C5CE7', // purple
  '#FD79A8', // pink
  '#E17055', // brown
] as const;

export const TURN_TIME_OPTIONS = [30, 60, 80, 120] as const;

export const MAX_PLAYERS_MIN = 2;
export const MAX_PLAYERS_MAX = 12;

export const ROUNDS_PER_PLAYER_MIN = 1;
export const ROUNDS_PER_PLAYER_MAX = 5;

export const MAX_CHAT_MESSAGE_LENGTH = 50;
