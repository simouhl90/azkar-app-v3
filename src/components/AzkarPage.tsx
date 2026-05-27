'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { azkarData } from '@/lib/azkar-data';
import { showToast } from './Toast';
import { SunriseIcon, MoonIcon, MoonSleepIcon, PrayerHandsIcon, SparklesIcon, OpenBookIcon, WaterDropIcon, FoodIcon, LightbulbIcon, CheckIcon, CelebrationIcon } from './Icons';

const iconMap: Record<string, React.ComponentType<{className?: string; size?: number}>> = {
  SunriseIcon, MoonIcon, MoonSleepIcon, PrayerHandsIcon, SparklesIcon, OpenBookIcon, WaterDropIcon, FoodIcon,
};

export function AzkarPage() {
  const {
    openCategory,
    setOpenCategory,
    zikrProgress,
    tapZikr,
    resetCategory,
    favorites,
    toggleFavorite,
    settings,
  } = useStore();

  const category = azkarData.find((c) => c.id === openCategory);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const progress = openCategory ? zikrProgress[openCategory] || [] : [];

  const getCompletionPercent = () => {
    if (!category || !openCategory) return 0;
    const p = zikrProgress[openCategory];
    if (!p || p.length === 0) return 0;
    const completed = p.filter((x) => x && x.completed).length;
    return Math.round((completed / category.azkar.length) * 100);
  };

  const allCompleted = useCallback(() => {
    if (!category || !openCategory) return false;
    const p = zikrProgress[openCategory];
    if (!p || p.length === 0) return false;
    return category.azkar.every((_, i) => p[i] && p[i].completed);
  }, [category, openCategory, zikrProgress]);

  const handleTap = useCallback(
    (catId: string, index: number, totalCount: number) => {
      tapZikr(catId, index, totalCount);

      if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }

      const p = zikrProgress[catId];
      const currentProgress = p?.[index];
      if (currentProgress && currentProgress.remaining <= 1) {
        showToast('تمّ بحمد الله');
      }

      if (allCompleted()) {
        setTimeout(() => {
          showToast('ما شاء الله! أتممت جميع الأذكار');
        }, 500);
      }

      if (settings.autoScroll) {
        setTimeout(() => {
          const nextIncomplete = category?.azkar.findIndex((_, i) => {
            const pp = zikrProgress[catId];
            return !pp || !pp[i] || !pp[i].completed;
          });
          if (nextIncomplete !== undefined && nextIncomplete > index) {
            const el = cardRefs.current.get(nextIncomplete);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 300);
      }
    },
    [tapZikr, settings.hapticFeedback, settings.autoScroll, zikrProgress, category, allCompleted]
  );

  const handleReset = () => {
    if (openCategory) {
      resetCategory(openCategory);
      showToast('تمّ إعادة التعيين');
    }
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-base';
      case 'large':
        return 'text-2xl';
      default:
        return 'text-xl';
    }
  };

  if (!category) return null;

  const completionPct = getCompletionPercent();
  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (completionPct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 bg-mesh-light dark:bg-mesh-dark flex flex-col overflow-hidden"
    >
      {/* Sticky Header with animated gradient border */}
      <div className="shrink-0 relative">
        <div className="glass-header text-white p-4 rounded-b-3xl relative overflow-hidden">
          {/* Animated gradient border line at top */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #C5A356, #E8D5A3, #1A5C42, #C5A356, transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setOpenCategory(null)}
              className="flex items-center gap-2 text-[#E8D5A3] hover:text-white transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                رجوع
              </span>
            </button>

            {/* Progress Ring */}
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="22"
                  fill="none"
                  stroke="rgba(197, 163, 86, 0.2)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="25"
                  cy="25"
                  r="22"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transition={{ duration: 0.2 }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5A356" />
                    <stop offset="100%" stopColor="#E8D5A3" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#E8D5A3]">{completionPct}%</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-[#E8D5A3]/70 hover:text-[#E8D5A3] transition-colors p-2"
              title="إعادة تعيين"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mt-2">
            {(() => { const IconComponent = iconMap[category.icon]; return IconComponent ? <IconComponent className="w-5 h-5" /> : <span className="text-xl">{category.icon}</span>; })()}
            <h2
              className="text-lg font-bold text-gradient-animate"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              {category.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Zikr Cards */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {category.azkar.map((zikr, idx) => {
            const p = progress[idx];
            const remaining = p ? p.remaining : zikr.count;
            const completed = p ? p.completed : false;
            const isFavorite = favorites.some((f) => f.cat === category.id && f.index === idx);

            return (
              <motion.div
                key={idx}
                ref={(el) => {
                  if (el) cardRefs.current.set(idx, el);
                }}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: completed ? 0.65 : 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.015, duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="neo-glass"
              >
                <div className="p-5 rounded-[calc(1.5rem-2px)]">
                  {/* Accent line at top */}
                  <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#C5A356]/50 to-transparent rounded-b-sm" />

                  {/* Completed overlay */}
                  {completed && (
                    <div className="absolute inset-0 rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-[#1A5C42]/10 to-[#2D8B66]/5 dark:from-[#1A5C42]/15 dark:to-[#2D8B66]/10 backdrop-blur-[2px] flex items-center justify-center z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A5C42] to-[#2D8B66] flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                  )}

                  <div className={completed ? 'pointer-events-none relative' : 'relative'}>
                    {/* Favorite Button */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-[#6B6B6B] dark:text-gray-500" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                        {idx + 1} / {category.azkar.length}
                      </span>
                      <motion.button
                        whileTap={{ scale: 1.3 }}
                        onClick={() => toggleFavorite(category.id, idx)}
                        className="p-1 transition-transform"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            isFavorite
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </motion.button>
                    </div>

                    {/* Zikr Text */}
                    <p
                      className={`${getFontSize()} leading-[2.2] text-[#2C2C2C] dark:text-gray-200 mb-4 ${completed ? 'line-through opacity-50' : ''}`}
                      style={{ fontFamily: "'Amiri', serif" }}
                      dir="rtl"
                    >
                      {zikr.text}
                    </p>

                    {/* Reference */}
                    <p className="text-[10px] text-[#C5A356] mb-2" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                      {zikr.ref}
                    </p>

                    {/* Benefit */}
                    {zikr.benefit && settings.showTranslation && (
                      <div className="glass-btn rounded-xl p-3 mb-3">
                        <p className="text-xs text-[#1A5C42] dark:text-[#E8D5A3] leading-relaxed" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                          <LightbulbIcon className="w-3.5 h-3.5 inline text-[#C5A356]" /> {zikr.benefit}
                        </p>
                      </div>
                    )}

                    {/* Counter Button - Glowing Orb */}
                    {!completed && (
                      <div className="flex flex-col items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                          onClick={() => handleTap(category.id, idx, zikr.count)}
                          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#0D3B2E] to-[#1A5C42] text-white flex flex-col items-center justify-center border border-[#C5A356]/30 hover:border-[#C5A356]/60 active:shadow-lg transition-all"
                          style={{
                            boxShadow: `
                              0 0 20px rgba(13, 59, 46, 0.25),
                              0 0 40px rgba(197, 163, 86, 0.1),
                              0 0 60px rgba(13, 59, 46, 0.08),
                              inset 0 -3px 8px rgba(0, 0, 0, 0.15),
                              inset 0 3px 8px rgba(255, 255, 255, 0.08)
                            `,
                          }}
                        >
                          {/* Pulsing glow ring */}
                          <span className="absolute inset-[-4px] rounded-full border border-[#C5A356]/20 animate-pulse-ring" />
                          <span
                            className="relative text-2xl font-bold"
                            style={{ fontFamily: "'Amiri', serif" }}
                          >
                            {remaining}
                          </span>
                          <span className="relative text-[9px] text-[#E8D5A3]/70">متبقي</span>
                        </motion.button>

                        {zikr.count > 1 && (
                          <span className="text-[10px] text-[#6B6B6B] dark:text-gray-500" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                            العدد الكلي: {zikr.count}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Completed indicator */}
                    {completed && (
                      <div className="text-center mt-2">
                        <span className="text-sm text-[#1A5C42] dark:text-[#2D8B66] font-bold" style={{ fontFamily: "'Amiri', serif" }}>
                          <CheckIcon className="w-4 h-4 inline" /> تمّ
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress wave at bottom */}
                {pct => {
                  const currentPct = completed ? 100 : Math.round(((zikr.count - remaining) / zikr.count) * 100);
                  if (currentPct === 0) return null;
                  return (
                    <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[calc(1.5rem-2px)] overflow-hidden bg-black/5 dark:bg-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#1A5C42] via-[#C5A356] to-[#2D8B66] progress-wave"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentPct}%` }}
                        transition={{ duration: 0.15 }}
                      />
                    </div>
                  );
                }}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div className="h-8" />
      </div>

      {/* All Completed Celebration */}
      <AnimatePresence>
        {allCompleted() && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="shrink-0 bg-gradient-to-l from-[#C5A356] to-[#E8D5A3] p-4 text-center rounded-t-3xl shadow-xl"
          >
            <p className="text-[#0D3B2E] font-bold text-lg" style={{ fontFamily: "'Amiri', serif" }}>
              <CelebrationIcon className="w-5 h-5 inline" /> ما شاء الله! بارك الله فيك
            </p>
            <p className="text-[#0D3B2E]/70 text-sm mt-1" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              أتممت جميع أذكار {category.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
