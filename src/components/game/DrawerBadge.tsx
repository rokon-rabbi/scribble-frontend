'use client';

import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

export function DrawerBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-orange)] text-[var(--color-text)] font-bold text-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Pencil size={16} />
      You are drawing!
    </motion.div>
  );
}
