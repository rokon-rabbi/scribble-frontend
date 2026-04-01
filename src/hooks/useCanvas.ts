'use client';

import { useRef, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import type { CanvasTool, StrokeData } from '@/lib/types';

interface CurrentStroke {
  points: { x: number; y: number }[];
  color: string;
  size: number;
  tool: CanvasTool;
}

export function useCanvas() {
  const currentStrokeRef = useRef<CurrentStroke | null>(null);
  const strokeCounterRef = useRef(0);

  // ── Draw a single stroke onto a context ──
  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, stroke: StrokeData) => {
      const { points, color, size, tool } = stroke;
      if (points.length === 0) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size;

      if (tool === 'ERASER') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
      }

      if (points.length === 1) {
        // Single dot
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = tool === 'ERASER' ? 'rgba(0,0,0,1)' : color;
        if (tool === 'ERASER') {
          ctx.globalCompositeOperation = 'destination-out';
        }
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const midX = (points[i - 1].x + points[i].x) / 2;
          const midY = (points[i - 1].y + points[i].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, midX, midY);
        }
        ctx.stroke();
      }

      ctx.restore();
    },
    [],
  );

  // ── Fill tool ──
  const floodFill = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) => {
      const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const data = imageData.data;
      const targetIdx = (Math.floor(y) * CANVAS_WIDTH + Math.floor(x)) * 4;
      const targetR = data[targetIdx];
      const targetG = data[targetIdx + 1];
      const targetB = data[targetIdx + 2];
      const targetA = data[targetIdx + 3];

      // Parse fill color
      const temp = document.createElement('canvas');
      temp.width = 1;
      temp.height = 1;
      const tmpCtx = temp.getContext('2d')!;
      tmpCtx.fillStyle = fillColor;
      tmpCtx.fillRect(0, 0, 1, 1);
      const [fillR, fillG, fillB] = tmpCtx.getImageData(0, 0, 1, 1).data;

      // Don't fill if same color
      if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === 255) return;

      const stack: [number, number][] = [[Math.floor(x), Math.floor(y)]];
      const visited = new Set<number>();

      function matches(idx: number) {
        return (
          Math.abs(data[idx] - targetR) < 10 &&
          Math.abs(data[idx + 1] - targetG) < 10 &&
          Math.abs(data[idx + 2] - targetB) < 10 &&
          Math.abs(data[idx + 3] - targetA) < 10
        );
      }

      while (stack.length > 0) {
        const [px, py] = stack.pop()!;
        const idx = (py * CANVAS_WIDTH + px) * 4;

        if (px < 0 || px >= CANVAS_WIDTH || py < 0 || py >= CANVAS_HEIGHT) continue;
        if (visited.has(idx)) continue;
        if (!matches(idx)) continue;

        visited.add(idx);
        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;

        stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
      }

      ctx.putImageData(imageData, 0, 0);
    },
    [],
  );

  // ── Redraw all strokes (clear + replay) ──
  const redrawAll = useCallback(
    (ctx: CanvasRenderingContext2D, strokes: StrokeData[]) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      for (const stroke of strokes) {
        if (stroke.tool === 'FILL') {
          if (stroke.points.length > 0) {
            floodFill(ctx, stroke.points[0].x, stroke.points[0].y, stroke.color);
          }
        } else {
          drawStroke(ctx, stroke);
        }
      }
    },
    [drawStroke, floodFill],
  );

  // ── Start a new stroke ──
  const startStroke = useCallback(
    (x: number, y: number, tool: CanvasTool, color: string, size: number) => {
      currentStrokeRef.current = {
        points: [{ x, y }],
        color,
        size,
        tool,
      };
    },
    [],
  );

  // ── Continue current stroke (add point, draw segment on preview canvas) ──
  const continueStroke = useCallback(
    (x: number, y: number, previewCtx: CanvasRenderingContext2D) => {
      const stroke = currentStrokeRef.current;
      if (!stroke) return;

      stroke.points.push({ x, y });

      // Draw the latest segment on the preview canvas
      previewCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawStroke(previewCtx, stroke as StrokeData);
    },
    [drawStroke],
  );

  // ── End stroke: finalize, return StrokeData, increment counter ──
  const endStroke = useCallback((): StrokeData | null => {
    const stroke = currentStrokeRef.current;
    if (!stroke || stroke.points.length === 0) {
      currentStrokeRef.current = null;
      return null;
    }

    const completed: StrokeData = {
      points: stroke.points,
      color: stroke.color,
      size: stroke.size,
      tool: stroke.tool,
    };

    strokeCounterRef.current += 1;
    currentStrokeRef.current = null;
    return completed;
  }, []);

  // ── Get current stroke order number ──
  const getStrokeOrder = useCallback(() => strokeCounterRef.current, []);

  // ── Reset counter ──
  const resetStrokeCounter = useCallback(() => {
    strokeCounterRef.current = 0;
  }, []);

  return {
    drawStroke,
    floodFill,
    redrawAll,
    startStroke,
    continueStroke,
    endStroke,
    getStrokeOrder,
    resetStrokeCounter,
  };
}
