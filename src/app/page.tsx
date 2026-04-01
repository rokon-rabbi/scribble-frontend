'use client';

import { useState } from 'react';
import { Mail, Lock, Search, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Timer } from '@/components/ui/Timer';
import { Modal } from '@/components/ui/Modal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen gap-10 p-8 max-w-3xl mx-auto">
      {/* Logo */}
      <h1 className="text-6xl font-bold font-heading text-primary mt-8">
        Scribble
      </h1>
      <p className="text-xl text-text-muted font-body -mt-6">
        UI Primitives Showcase
      </p>

      {/* ── Buttons ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </Card>

      {/* ── Inputs ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Inputs</h2>
        <div className="flex flex-col gap-4">
          <Input label="Email" placeholder="you@example.com" icon={<Mail size={18} />} />
          <Input label="Password" type="password" placeholder="Enter password" icon={<Lock size={18} />} />
          <Input label="With Error" placeholder="Oops" error="This field is required" />
          <Input placeholder="No label, with icon" icon={<Search size={18} />} />
        </div>
      </Card>

      {/* ── Cards ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Cards</h2>
        <div className="flex gap-4 flex-wrap">
          <Card padding="sm" className="flex-1 min-w-[140px]">
            <p className="text-sm text-text-muted">Small padding</p>
          </Card>
          <Card padding="md" className="flex-1 min-w-[140px]">
            <p className="text-sm text-text-muted">Medium padding</p>
          </Card>
          <Card padding="lg" className="flex-1 min-w-[140px]">
            <p className="text-sm text-text-muted">Large padding</p>
          </Card>
        </div>
      </Card>

      {/* ── Avatars ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Avatars</h2>
        <div className="flex items-center gap-4">
          <Avatar username="Alice" size="sm" />
          <Avatar username="Bob" size="md" />
          <Avatar username="Charlie" size="lg" />
          <Avatar username="Diana" size="lg" />
          <Avatar username="Eve" size="md" />
        </div>
      </Card>

      {/* ── Badges ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="success">Correct!</Badge>
          <Badge variant="warning">Drawing</Badge>
          <Badge variant="danger">Wrong</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </Card>

      {/* ── Spinners ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Spinners</h2>
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </Card>

      {/* ── Timer ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Timer</h2>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Timer seconds={45} className="text-3xl" />
            <span className="text-xs text-text-muted">Safe</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Timer seconds={20} className="text-3xl" />
            <span className="text-xs text-text-muted">Warning</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Timer seconds={5} className="text-3xl" />
            <span className="text-xs text-text-muted">Danger</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Timer seconds={90} className="text-3xl" />
            <span className="text-xs text-text-muted">1:30</span>
          </div>
        </div>
      </Card>

      {/* ── Modal ── */}
      <Card className="w-full">
        <h2 className="text-lg font-bold font-heading text-text mb-4">Modal</h2>
        <Button onClick={() => setModalOpen(true)}>
          <Pencil size={16} /> Open Modal
        </Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Pick a Word!">
          <p className="text-text-muted mb-4">
            Choose one of the words below to start drawing.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cat</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Guitar</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Constellation</Button>
          </div>
        </Modal>
      </Card>

      <div className="pb-8" />
    </div>
  );
}
