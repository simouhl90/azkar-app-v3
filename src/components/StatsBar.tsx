'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

function AnimatedCounter({ target, duration = 1000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const diff = target - prevTarget.current;
    if (diff === 0) return;
    const steps = 30;
    const increment = diff / steps;
    let current = prevTarget.current;
    const interval = setInterval(() => {
      current += increment;
      setCount(Math.round(current));
      if (Math.abs(current - target) < 1) {
        setCount(target);
        prevTarget.current = target;
        clearInterval(interval);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{count.toLocaleString('ar-EG')}</span>;
}

export function StatsBar() {
  const { stats, checkStreak } = useStore();

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  const statItems = [
    {
      label: 'أذكار اليوم',
      value: stats.today,
      icon: BookOpen,
      color: 'text-[#1A5C42] dark:text-[#34D399]',
      bg: 'bg-[#1A5C42]/10 dark:bg-[#34D399]/10',
      borderClass: 'gradient-border-top-green',
      glowClass: 'glow-emerald',
    },
    {
      label: 'أيام متتالية',
      value: stats.streak,
      icon: Flame,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-500/10 dark:bg-orange-500/10',
      borderClass: 'gradient-border-top-amber',
      glowClass: 'glow-amber',
    },
    {
      label: 'إجمالي الأذكار',
      value: stats.allTime,
      icon: Star,
      color: 'text-[#C5A356] dark:text-[#E8D5A3]',
      bg: 'bg-[#C5A356]/10 dark:bg-[#C5A356]/10',
      borderClass: 'gradient-border-top-gold',
      glowClass: 'glow-gold',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {statItems.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 + idx * 0.1, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={`glass-gold rounded-2xl p-4 text-center glass-shimmer ${item.borderClass} ${item.glowClass}`}>
            <motion.div
              className={`mx-auto mb-2 w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center backdrop-blur-sm`}
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: idx * 0.5,
                ease: 'easeInOut',
              }}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </motion.div>
            <p
              className="text-2xl font-bold text-gradient-animate"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              <AnimatedCounter target={item.value} />
            </p>
            <p className="text-[11px] text-[#6B6B6B] dark:text-gray-400 mt-1" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              {item.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
