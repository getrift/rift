'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  title: string;
  children: ReactNode;
  isDimmed?: boolean;
}

export default function Section({ title, children, isDimmed = false }: SectionProps) {
  return (
    <motion.section
      animate={{ 
        opacity: isDimmed ? 0.35 : 1,
        scale: isDimmed ? 0.99 : 1,
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="space-y-1.5"
    >
      <h3 
        className="text-text-subheading text-[10px] font-medium uppercase px-0.5 tracking-wide select-none"
      >
        {title}
      </h3>
      <div className="bg-bg-card border border-border-hairline rounded-md px-2 py-1.5 space-y-0">
        {children}
      </div>
    </motion.section>
  );
}
