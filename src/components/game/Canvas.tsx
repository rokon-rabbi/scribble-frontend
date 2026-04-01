'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { useCanvas } from '@/hooks/useCanvas';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import type { StrokeMessage } from '@/lib/types';

interface CanvasProps {
  isDrawer: boolean;
  onStrokeSend?: (stroke: StrokeMessage) => void;
}

export function Canvas({ isDrawer, onStrokeSend }: CanvasProps) {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const prevStrokesLenRef = useRef(0);

  const {
    tool, color, brushSize, strokes,
    isDrawing, setIsDrawing, addStroke,
  } = useCanvasStore();

  const {
    drawStroke, floodFill, redrawAll,
    startStroke, continueStroke, endStroke,
    getStrokeOrder,
  } = useCanvas();

  // ── Get canvas coordinate from mouse/touch event ──
  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = mainCanvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    },
    [],
  );

  // ── Redraw main canvas whenever strokes change (viewer mode) ──
  useEffect(() => {
    const ctx = mainCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    // If a new stroke was appended (common case), draw only the new one
    if (strokes.length > prevStrokesLenRef.current && strokes.length > 0) {
      const newStroke = strokes[strokes.length - 1];
      if (newStroke.tool === 'FILL' && newStroke.points.length > 0) {
        // For fill, we need full redraw since fill depends on existing pixels
        redrawAll(ctx, strokes);
      } else {
        drawStroke(ctx, newStroke);
      }
    } else {
      // Stroke removed (undo) or bulk update — full redraw
      redrawAll(ctx, strokes);
    }
    prevStrokesLenRef.current = strokes.length;
  }, [strokes, drawStroke, redrawAll]);

  // ── Mouse handlers (drawer only) ──
  const handlePointerDown = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDrawer) return;
      const coords = getCanvasCoords(clientX, clientY);
      if (!coords) return;

      const mainCtx = mainCanvasRef.current?.getContext('2d');

      // Fill tool — immediate action
      if (tool === 'FILL' && mainCtx) {
        floodFill(mainCtx, coords.x, coords.y, color);
        const fillStroke = {
          points: [coords],
          color,
          size: brushSize,
          tool: 'FILL' as const,
        };
        addStroke(fillStroke);
        onStrokeSend?.({
          strokeOrder: getStrokeOrder(),
          pointsData: [coords],
          color,
          brushSize,
          tool: 'FILL',
        });
        return;
      }

      setIsDrawing(true);
      startStroke(coords.x, coords.y, tool, color, brushSize);
    },
    [isDrawer, tool, color, brushSize, getCanvasCoords, startStroke, setIsDrawing, addStroke, floodFill, onStrokeSend, getStrokeOrder],
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDrawer || !isDrawing) return;
      const coords = getCanvasCoords(clientX, clientY);
      if (!coords) return;

      const previewCtx = previewCanvasRef.current?.getContext('2d');
      if (!previewCtx) return;

      continueStroke(coords.x, coords.y, previewCtx);
    },
    [isDrawer, isDrawing, getCanvasCoords, continueStroke],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawer || !isDrawing) return;
    setIsDrawing(false);

    const completed = endStroke();
    if (!completed) return;

    // Draw completed stroke to main canvas
    const mainCtx = mainCanvasRef.current?.getContext('2d');
    if (mainCtx) {
      drawStroke(mainCtx, completed);
    }

    // Clear preview canvas
    const previewCtx = previewCanvasRef.current?.getContext('2d');
    previewCtx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Add to store
    addStroke(completed);

    // Send via WebSocket
    onStrokeSend?.({
      strokeOrder: getStrokeOrder(),
      pointsData: completed.points,
      color: completed.color,
      brushSize: completed.size,
      tool: completed.tool,
    });
  }, [isDrawer, isDrawing, setIsDrawing, endStroke, drawStroke, addStroke, onStrokeSend, getStrokeOrder]);

  // ── Mouse events ──
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => handlePointerDown(e.clientX, e.clientY),
    [handlePointerDown],
  );
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => handlePointerMove(e.clientX, e.clientY),
    [handlePointerMove],
  );
  const onMouseUp = useCallback(() => handlePointerUp(), [handlePointerUp]);
  const onMouseLeave = useCallback(() => handlePointerUp(), [handlePointerUp]);

  // ── Touch events ──
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerDown(touch.clientX, touch.clientY);
    },
    [handlePointerDown],
  );
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    },
    [handlePointerMove],
  );
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handlePointerUp();
    },
    [handlePointerUp],
  );

  return (
    <div
      className="relative w-full"
      style={{
        maxWidth: CANVAS_WIDTH,
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
      }}
    >
      {/* Main (persistent) canvas */}
      <canvas
        ref={mainCanvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute inset-0 w-full h-full rounded-xl border-2 border-[var(--canvas-border)] bg-[var(--canvas-bg)]"
      />

      {/* Preview (in-progress stroke) canvas — on top */}
      <canvas
        ref={previewCanvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute inset-0 w-full h-full rounded-xl"
        style={{ cursor: isDrawer ? 'crosshair' : 'default' }}
        onMouseDown={isDrawer ? onMouseDown : undefined}
        onMouseMove={isDrawer ? onMouseMove : undefined}
        onMouseUp={isDrawer ? onMouseUp : undefined}
        onMouseLeave={isDrawer ? onMouseLeave : undefined}
        onTouchStart={isDrawer ? onTouchStart : undefined}
        onTouchMove={isDrawer ? onTouchMove : undefined}
        onTouchEnd={isDrawer ? onTouchEnd : undefined}
      />
    </div>
  );
}
