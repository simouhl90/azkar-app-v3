'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { azkarData } from '@/lib/azkar-data';
import { SunriseIcon, MoonIcon, MoonSleepIcon, PrayerHandsIcon, SparklesIcon, OpenBookIcon, WaterDropIcon, FoodIcon } from './Icons';

const iconMap: Record<string, React.ComponentType<{className?: string; size?: number}>> = {
  SunriseIcon, MoonIcon, MoonSleepIcon, PrayerHandsIcon, SparklesIcon, OpenBookIcon, WaterDropIcon, FoodIcon,
};

export function CategoriesGrid() {
  const { openCategory, setOpenCategory, zikrProgress } = useStore();

  const getCompletionPercent = (catId: string) => {
    const cat = azkarData.find((c) => c.id === catId);
    if (!cat) return 0;
    const progress = zikrProgress[catId];
    if (!progress || progress.length === 0) return 0;
    const completed = progress.filter((p) => p && p.completed).length;
    return Math.round((completed / cat.azkar.length) * 100);
  };

  const categoryStyles: Record<string, {
    gradient: string;
    glowClass: string;
    iconBg: string;
    accent: string;
  }> = {
    morning: {
      gradient: 'from-amber-400/20 via-orange-300/15 to-yellow-300/20',
      glowClass: 'glow-amber',
      iconBg: 'bg-amber-400/10 dark:bg-amber-400/15 border-amber-400/20',
      accent: 'from-amber-400 to-orange-400',
    },
    evening: {
      gradient: 'from-indigo-400/20 via-purple-300/15 to-violet-300/20',
      glowClass: 'glow-indigo',
      iconBg: 'bg-indigo-400/10 dark:bg-indigo-400/15 border-indigo-400/20',
      accent: 'from-indigo-400 to-violet-400',
    },
    sleep: {
      gradient: 'from-violet-400/20 via-purple-300/15 to-indigo-300/20',
      glowClass: 'glow-violet',
      iconBg: 'bg-violet-400/10 dark:bg-violet-400/15 border-violet-400/20',
      accent: 'from-violet-400 to-purple-400',
    },
    prayer: {
      gradient: 'from-emerald-400/20 via-green-300/15 to-teal-300/20',
      glowClass: 'glow-emerald',
      iconBg: 'bg-emerald-400/10 dark:bg-emerald-400/15 border-emerald-400/20',
      accent: 'from-emerald-400 to-teal-400',
    },
    morningEvening: {
      gradient: 'from-amber-400/20 via-orange-300/15 to-orange-400/20',
      glowClass: 'glow-amber',
      iconBg: 'bg-orange-400/10 dark:bg-orange-400/15 border-orange-400/20',
      accent: 'from-amber-400 to-orange-400',
    },
    quran: {
      gradient: 'from-rose-400/20 via-pink-300/15 to-red-300/20',
      glowClass: 'glow-violet',
      iconBg: 'bg-rose-400/10 dark:bg-rose-400/15 border-rose-400/20',
      accent: 'from-rose-400 to-pink-400',
    },
    wudu: {
      gradient: 'from-cyan-400/20 via-sky-300/15 to-blue-300/20',
      glowClass: 'glow-indigo',
      iconBg: 'bg-cyan-400/10 dark:bg-cyan-400/15 border-cyan-400/20',
      accent: 'from-cyan-400 to-blue-400',
    },
    eating: {
      gradient: 'from-orange-400/20 via-amber-300/15 to-yellow-300/20',
      glowClass: 'glow-amber',
      iconBg: 'bg-orange-400/10 dark:bg-orange-400/15 border-orange-400/20',
      accent: 'from-orange-400 to-yellow-400',
    },
  };

  const defaultStyle = categoryStyles.morning;

  return (
    <div className="grid grid-cols-2 gap-3">
      {azkarData.map((cat, idx) => {
        const pct = getCompletionPercent(cat.id);
        const style = categoryStyles[cat.id] || defaultStyle;

        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05 + idx * 0.03, duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`glass-category relative overflow-hidden cursor-pointer p-4 rounded-2xl glass-shimmer ${style.glowClass}`}
              onClick={() => setOpenCategory(cat.id)}
            >
              {/* Background gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} dark:opacity-60`} />

              {/* Completion badge */}
              {pct > 0 && (
                <div className="absolute top-2.5 left-2.5 z-10">
                  <div className="text-[10px] font-bold glass-gold text-[#0D3B2E] dark:text-[#E8D5A3] rounded-full px-2.5 py-0.5 backdrop-blur-sm">
                    {pct}%
                  </div>
                </div>
              )}

              <div className="relative z-10 text-center">
                {/* Icon in glowing circle */}
                <motion.div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full ${style.iconBg} flex items-center justify-center border backdrop-blur-sm shadow-sm`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {(() => { const IconComponent = iconMap[cat.icon]; return IconComponent ? <IconComponent className="w-8 h-8" /> : <span className="text-3xl">{cat.icon}</span>; })()}
                </motion.div>

                {/* Title */}
                <h3
                  className="text-sm font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-1"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {cat.title}
                </h3>

                {/* Zikr count */}
                <p className="text-[11px] text-[#6B6B6B] dark:text-gray-400" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                  {cat.azkar.length} ذكر
                </p>
              </div>

              {/* Progress bar with gradient accent */}
              {pct > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${style.accent}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
