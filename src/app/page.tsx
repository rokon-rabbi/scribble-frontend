'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pencil, Plus, Hash } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';

const logoLetters = 'Scribble'.split('');

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background doodle pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236C5CE7' stroke-width='1.5'%3E%3Ccircle cx='15' cy='15' r='6'/%3E%3Cpath d='M40 10l8 8-8 8'/%3E%3Crect x='8' y='38' width='12' height='12' rx='2'/%3E%3Cpath d='M38 38l12 12M38 50l12-12'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        {/* Animated logo */}
        <div className="flex mb-4">
          {logoLetters.map((char, i) => (
            <motion.span
              key={i}
              className="text-6xl sm:text-7xl md:text-8xl font-bold font-heading text-[var(--color-primary)]"
              initial={{ opacity: 0, y: 30, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                delay: i * 0.08,
                type: 'spring',
                stiffness: 400,
                damping: 15,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Animated pencil drawing a squiggly line */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <svg width="200" height="30" viewBox="0 0 200 30" className="mx-auto">
            <motion.path
              d="M10 15 Q30 5 50 15 Q70 25 90 15 Q110 5 130 15 Q150 25 170 15 Q180 10 190 15"
              fill="none"
              stroke="var(--color-primary-light)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 1.5, ease: 'easeInOut' }}
            />
          </svg>
          <motion.div
            className="flex justify-end -mt-5 mr-1"
            initial={{ opacity: 0, x: -180 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 1.5, ease: 'easeInOut' }}
          >
            <Pencil size={18} className="text-[var(--color-primary-light)]" />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl text-[var(--color-text-muted)] mb-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Draw, guess, and laugh with friends!
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {isAuthenticated ? (
            <>
              <Link href="/lobby">
                <Button size="lg">
                  <Plus size={20} /> Create Room
                </Button>
              </Link>
              <Link href="/lobby">
                <Button variant="secondary" size="lg">
                  <Hash size={20} /> Join Room
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Log In
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-[var(--color-text-muted)] relative z-10">
        A multiplayer drawing game
      </footer>
    </div>
  );
}
