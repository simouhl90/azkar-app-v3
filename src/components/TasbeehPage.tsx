'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { tasbeehTypes } from '@/lib/azkar-data';
import { showToast } from './Toast';

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

    if (tasbeehCount + 1 >= tasbeehTarget) {
      setShowCelebration(true);
      showToast('🎉 أتممت الهدف بحمد الله!');
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [tapTasbeeh, tasbeehCount, tasbeehTarget, settings.hapticFeedback]);

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
      transition={{ duration: 0.4 }}
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
      <div className="glass-gold p-6 mb-4 text-center rounded-2xl glass-shimmer">
        <p
          className="text-2xl font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-2"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {tasbeehTypes.find((t) => t.value === tasbeehType)?.label || tasbeehType}
        </p>
      </div>

      {/* Count Display */}
      <motion.div
        className="text-center mb-4"
        key={tasbeehCount}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <p
          className="text-[72px] font-bold text-gradient-green dark:text-gradient-gold leading-none"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          {tasbeehCount.toLocaleString('ar-EG')}
        </p>
        <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mt-1" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
          من {tasbeehTarget}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="h-2 glass rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0D3B2E] via-[#1A5C42] to-[#C5A356] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-xs text-[#6B6B6B] dark:text-gray-500 mt-1" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
          {Math.round(progressPct)}%
        </p>
      </div>

      {/* Big Tap Button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          onClick={handleTap}
          className="w-40 h-40 rounded-full bg-gradient-to-br from-[#0D3B2E] to-[#1A5C42] text-white counter-glow flex items-center justify-center border-2 border-[#C5A356]/30 hover:border-[#C5A356]/60 active:shadow-lg transition-all relative overflow-hidden"
        >
          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#C5A356]/15"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          />
          <span className="relative text-2xl font-bold" style={{ fontFamily: "'Amiri', serif" }}>
            اضغط
          </span>
        </motion.button>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-btn text-[#6B6B6B] dark:text-gray-400 hover:text-[#0D3B2E] dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              إعادة تعيين
            </span>
          </button>

          <button
            onClick={() => setShowTargetPicker(!showTargetPicker)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-btn text-[#6B6B6B] dark:text-gray-400 hover:text-[#0D3B2E] dark:hover:text-white transition-colors"
          >
            <span className="text-sm" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              الهدف: {tasbeehTarget}
            </span>
          </button>
        </div>

        {/* Target Picker */}
        <AnimatePresence>
          {showTargetPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden w-full"
            >
              <div className="glass-gold p-3 rounded-2xl">
                <div className="flex gap-2 flex-wrap justify-center">
                  {targets.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTargetChange(t)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${
                        tasbeehTarget === t
                          ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] text-white shadow-md border border-[#C5A356]/30'
                          : 'glass-btn text-[#2C2C2C] dark:text-gray-300'
                      }`}
                      style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                    >
                      {t.toLocaleString('ar-EG')}
                    </button>
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
              className="glass-gold rounded-3xl p-8 text-center shadow-2xl mx-8 max-w-sm"
            >
              <div className="text-6xl mb-4">🎊</div>
              <p
                className="text-2xl font-bold text-[#1A5C42] dark:text-[#E8D5A3] mb-2"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                ما شاء الله!
              </p>
              <p className="text-sm text-[#6B6B6B] dark:text-gray-400" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                أتممت {tasbeehTarget} تسبيحة بحمد الله
              </p>
              <p className="text-xs text-[#C5A356] mt-2" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                اضغط للإغلاق
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
