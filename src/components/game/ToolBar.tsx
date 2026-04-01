'use client';

import { useState } from 'react';
import { Paintbrush, Eraser, PaintBucket, Undo2, Trash2 } from 'lucide-react';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { COLOR_SWATCHES, BRUSH_SIZES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CanvasTool } from '@/lib/types';

interface ToolBarProps {
  onClear: () => void;
}

const tools: { id: CanvasTool; icon: typeof Paintbrush; label: string }[] = [
  { id: 'BRUSH', icon: Paintbrush, label: 'Brush' },
  { id: 'ERASER', icon: Eraser, label: 'Eraser' },
  { id: 'FILL', icon: PaintBucket, label: 'Fill' },
];

export function ToolBar({ onClear }: ToolBarProps) {
  const { tool, color, brushSize, strokes, setTool, setColor, setBrushSize, undoLastStroke } =
    useCanvasStore();

  const [confirmClear, setConfirmClear] = useState(false);

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    onClear();
    setConfirmClear(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Tools */}
      <div className="flex gap-1">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            title={label}
            className={cn(
              'p-2 rounded-lg transition-colors cursor-pointer',
              tool === id
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]',
            )}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-[var(--color-border)]" />

      {/* Color swatches */}
      <div className="flex flex-wrap gap-1.5">
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            title={c}
            className={cn(
              'w-7 h-7 rounded-lg border-2 transition-transform cursor-pointer hover:scale-110',
              color === c && tool !== 'ERASER'
                ? 'border-[var(--color-primary)] scale-110'
                : 'border-[var(--color-border)]',
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-[var(--color-border)]" />

      {/* Brush sizes */}
      <div className="flex items-center gap-2">
        {BRUSH_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setBrushSize(size)}
            title={`${size}px`}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer',
              brushSize === size
                ? 'bg-[var(--color-surface-alt)] border border-[var(--color-primary)]'
                : 'hover:bg-[var(--color-surface-alt)]',
            )}
          >
            <div
              className="rounded-full bg-[var(--color-text)]"
              style={{ width: Math.min(size, 20), height: Math.min(size, 20) }}
            />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-[var(--color-border)]" />

      {/* Undo + Clear */}
      <div className="flex gap-1">
        <button
          onClick={() => undoLastStroke()}
          disabled={strokes.length === 0}
          title="Undo"
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={handleClear}
          disabled={strokes.length === 0}
          title={confirmClear ? 'Click again to confirm' : 'Clear canvas'}
          className={cn(
            'p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed',
            confirmClear
              ? 'bg-[var(--color-accent-red)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]',
          )}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
