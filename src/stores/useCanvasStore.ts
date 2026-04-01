import { create } from 'zustand';
import type { CanvasTool, StrokeData } from '@/lib/types';

interface CanvasState {
  tool: CanvasTool;
  color: string;
  brushSize: number;
  strokes: StrokeData[];
  isDrawing: boolean;

  setTool: (tool: CanvasTool) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addStroke: (stroke: StrokeData) => void;
  undoLastStroke: () => StrokeData | undefined;
  setStrokes: (strokes: StrokeData[]) => void;
  clearStrokes: () => void;
  setIsDrawing: (drawing: boolean) => void;
}

export const useCanvasStore = create<CanvasState>()((set, get) => ({
  tool: 'BRUSH',
  color: '#2D3436',
  brushSize: 5,
  strokes: [],
  isDrawing: false,

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color, tool: 'BRUSH' }),
  setBrushSize: (size) => set({ brushSize: size }),
  addStroke: (stroke) =>
    set((state) => ({ strokes: [...state.strokes, stroke] })),
  undoLastStroke: () => {
    const strokes = get().strokes;
    if (strokes.length === 0) return undefined;
    const removed = strokes[strokes.length - 1];
    set({ strokes: strokes.slice(0, -1) });
    return removed;
  },
  setStrokes: (strokes) => set({ strokes }),
  clearStrokes: () => set({ strokes: [] }),
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
}));
