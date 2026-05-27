'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { azkarData } from '@/lib/azkar-data';
import { showToast } from './Toast';

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
        showToast('✅ تمّ بحمد الله');
      }

      if (allCompleted()) {
        setTimeout(() => {
          showToast('🎉 ما شاء الله! أتممت جميع الأذكار');
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
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-mesh-light dark:bg-mesh-dark flex flex-col overflow-hidden"
    >
      {/* Sticky Header */}
      <div className="shrink-0 glass-header text-white p-4 shadow-xl rounded-b-3xl">
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A356]/40 to-transparent" />

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
              <circle
                cx="25"
                cy="25"
                r="22"
                fill="none"
                stroke="#C5A356"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
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
          <span className="text-xl">{category.icon}</span>
          <h2
            className="text-lg font-bold text-gradient-gold"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            {category.title}
          </h2>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: completed ? 0.6 : 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
                className={`glass-gold rounded-3xl p-5 transition-all ${
                  completed ? 'relative' : ''
                }`}
              >
                {/* Completed overlay */}
                {completed && (
                  <div className="absolute inset-0 rounded-3xl bg-[#1A5C42]/5 dark:bg-[#1A5C42]/10 backdrop-blur-sm flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-[#1A5C42] dark:text-[#2D8B66]" />
                  </div>
                )}

                <div className={completed ? 'pointer-events-none' : ''}>
                  {/* Favorite Button */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-[#6B6B6B] dark:text-gray-500">
                      {idx + 1} / {category.azkar.length}
                    </span>
                    <button
                      onClick={() => toggleFavorite(category.id, idx)}
                      className="p-1 transition-transform active:scale-125"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          isFavorite
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Zikr Text */}
                  <p
                    className={`${getFontSize()} leading-[2] text-[#2C2C2C] dark:text-gray-200 mb-4 ${completed ? 'line-through opacity-50' : ''}`}
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
                        💡 {zikr.benefit}
                      </p>
                    </div>
                  )}

                  {/* Counter Button */}
                  {!completed && (
                    <div className="flex flex-col items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        onClick={() => handleTap(category.id, idx, zikr.count)}
                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0D3B2E] to-[#1A5C42] text-white counter-glow flex flex-col items-center justify-center border border-[#C5A356]/30 hover:border-[#C5A356]/60 active:shadow-lg transition-all"
                      >
                        <span
                          className="text-2xl font-bold"
                          style={{ fontFamily: "'Amiri', serif" }}
                        >
                          {remaining}
                        </span>
                        <span className="text-[9px] text-[#E8D5A3]/70">متبقي</span>
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
                    <div className="text-center">
                      <span className="text-sm text-[#1A5C42] dark:text-[#2D8B66] font-bold" style={{ fontFamily: "'Amiri', serif" }}>
                        تمّ ✅
                      </span>
                    </div>
                  )}
                </div>
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
              🎉 ما شاء الله! بارك الله فيك
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
