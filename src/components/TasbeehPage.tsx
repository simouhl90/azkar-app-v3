'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { tasbeehTypes } from '@/lib/azkar-data';
import { showToast } from './Toast';
import { playTapSound, playCompletionSound, playTargetReachedSound } from '@/lib/sounds';
import { CelebrationIcon } from './Icons';

export function TasbeehPage() {
  const {
    tasbeehCount,
    tasbeehTarget,
    tasbeehType,
    tapTasbeeh,
    setTasbeehTarget,
    resetTasbeeh,
    setTasbeehType,
    settings,
  } = useStore();

  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const targets = [33, 99, 100, 500, 1000];

  const progressPct = Math.min((tasbeehCount / tasbeehTarget) * 100, 100);

  const handleTap = useCallback(() => {
    tapTasbeeh();

    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    if (settings.soundEnabled) {
      playTapSound();
    }

    if (tasbeehCount + 1 >= tasbeehTarget) {
      setShowCelebration(true);
      showToast('أتممت الهدف بحمد الله!');
      if (settings.soundEnabled) {
        playTargetReachedSound();
      }
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [tapTasbeeh, tasbeehCount, tasbeehTarget, settings.hapticFeedback, settings.soundEnabled]);

  const handleTargetChange = (t: number) => {
    setTasbeehTarget(t);
    setShowTargetPicker(false);
    showToast(`تمّ تعيين الهدف: ${t}`);
  };

  const handleReset = () => {
    resetTasbeeh();
    showToast('تمّ إعادة التعيين');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="pb-4"
    >
      {/* Type Selector */}
      <div className="glass-gold p-4 mb-4 rounded-2xl">
        <label className="text-xs text-[#6B6B6B] dark:text-gray-400 mb-2 block" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
          اختر التسبيح
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tasbeehTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTasbeehType(t.value)}
              className={`p-3 rounded-xl text-sm transition-all ${
                tasbeehType === t.value
                  ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] text-white shadow-lg border border-[#C5A356]/30'
                  : 'glass-btn text-[#2C2C2C] dark:text-gray-300'
              }`}
              style={{ fontFamily: "'Amiri', serif" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Zikr Display */}
      <div className="glass-gold p-5 mb-4 text-center rounded-2xl glass-shimmer">
        <p
          className="text-2xl font-bold text-gradient-animate mb-1"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {tasbeehTypes.find((t) => t.value === tasbeehType)?.label || tasbeehType}
        </p>
      </div>

      {/* Count Display with progress ring */}
      <div className="relative w-56 h-56 mx-auto mb-2">
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(197, 163, 86, 0.1)"
            strokeWidth="4"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#tasbeehProgressGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={2 * Math.PI * 90 - (progressPct / 100) * 2 * Math.PI * 90}
            transition={{ duration: 0.15 }}
          />
          <defs>
            <linearGradient id="tasbeehProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A356" />
              <stop offset="50%" stopColor="#E8D5A3" />
              <stop offset="100%" stopColor="#1A5C42" />
            </linearGradient>
          </defs>
        </svg>

        {/* Count number - perfectly centered */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          key={tasbeehCount}
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <p
            className="text-[80px] font-bold text-gradient-animate leading-none"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            {tasbeehCount.toLocaleString('ar-EG')}
          </p>
          <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mt-1" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
            من {tasbeehTarget}
          </p>
        </motion.div>
      </div>

      {/* Big Tap Button - Massive Glowing Sphere */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Animated pulsing glow ring */}
          <span className="absolute inset-[-12px] rounded-full border-2 border-[#2D8B66]/20 animate-pulse-ring" />
          <span className="absolute inset-[-6px] rounded-full border border-[#C5A356]/15 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />

          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            onClick={handleTap}
            className="relative w-44 h-44 rounded-full tasbeeh-sphere text-white flex items-center justify-center overflow-hidden border border-[#C5A356]/25"
          >
            {/* Ripple effect on tap */}
            <AnimatePresence>
              <motion.div
                key={`ripple-${tasbeehCount}`}
                className="absolute inset-0 rounded-full bg-[#C5A356]/20"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </AnimatePresence>

            {/* Inner highlight */}
            <div className="absolute top-4 left-4 right-4 h-12 rounded-full bg-white/[0.06] blur-md" />

            <span className="relative text-2xl font-bold" style={{ fontFamily: "'Amiri', serif" }}>
              اضغط
            </span>
          </motion.button>
        </div>

        {/* Controls with glass pills */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="glass-pill flex items-center gap-2 text-[#6B6B6B] dark:text-gray-400 hover:text-[#0D3B2E] dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              إعادة تعيين
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTargetPicker(!showTargetPicker)}
            className="glass-pill text-[#6B6B6B] dark:text-gray-400 hover:text-[#0D3B2E] dark:hover:text-white transition-colors"
          >
            <span className="text-sm" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              الهدف: {tasbeehTarget}
            </span>
          </motion.button>
        </div>

        {/* Target Picker with glass pills */}
        <AnimatePresence>
          {showTargetPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden w-full"
            >
              <div className="glass-gold p-4 rounded-2xl">
                <div className="flex gap-2 flex-wrap justify-center">
                  {targets.map((t) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleTargetChange(t)}
                      className={`px-5 py-2 rounded-full text-sm transition-all ${
                        tasbeehTarget === t
                          ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] text-white shadow-lg border border-[#C5A356]/30'
                          : 'glass-pill text-[#2C2C2C] dark:text-gray-300'
                      }`}
                      style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                    >
                      {t.toLocaleString('ar-EG')}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="neo-glass rounded-3xl p-8 text-center shadow-2xl mx-8 max-w-sm"
            >
              <div className="p-1 rounded-[calc(1.5rem-2px)] bg-gradient-to-br from-[#0D3B2E] to-[#1A5C42]">
                <div className="mb-4"><CelebrationIcon className="w-14 h-14 text-[#C5A356] mx-auto" /></div>
                <p
                  className="text-2xl font-bold text-gradient-gold mb-2"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  ما شاء الله!
                </p>
                <p className="text-sm text-[#E8D5A3]/80" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                  أتممت {tasbeehTarget} تسبيحة بحمد الله
                </p>
                <p className="text-xs text-[#C5A356]/60 mt-3" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                  اضغط للإغلاق
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
