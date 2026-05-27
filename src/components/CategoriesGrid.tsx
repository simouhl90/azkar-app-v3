'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { azkarData } from '@/lib/azkar-data';

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

  const categoryGradients = {
    morning: 'from-amber-400/80 via-orange-300/60 to-yellow-300/80',
    evening: 'from-indigo-400/80 via-purple-300/60 to-violet-300/80',
    sleep: 'from-violet-400/80 via-purple-300/60 to-indigo-300/80',
    prayer: 'from-emerald-400/80 via-green-300/60 to-teal-300/80',
    morningEvening: 'from-yellow-400/80 via-amber-300/60 to-orange-300/80',
    quran: 'from-pink-400/80 via-rose-300/60 to-red-300/80',
    wudu: 'from-cyan-400/80 via-sky-300/60 to-blue-300/80',
    eating: 'from-orange-400/80 via-amber-300/60 to-yellow-300/80',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {azkarData.map((cat, idx) => {
        const pct = getCompletionPercent(cat.id);
        const gradClass = categoryGradients[cat.id as keyof typeof categoryGradients] || categoryGradients.morning;
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05, duration: 0.4 }}
            whileTap={{ scale: 0.96 }}
          >
            <div
              className="glass-category relative overflow-hidden cursor-pointer p-4 rounded-2xl"
              onClick={() => setOpenCategory(cat.id)}
            >
              {/* Background gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradClass} opacity-20 dark:opacity-10`} />

              {/* Completion badge */}
              {pct > 0 && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="text-[10px] font-bold glass-gold text-[#0D3B2E] dark:text-[#E8D5A3] rounded-full px-2.5 py-0.5 backdrop-blur-sm">
                    {pct}%
                  </div>
                </div>
              )}

              <div className="relative z-10 text-center">
                <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-white/5 flex items-center justify-center border border-white/40 dark:border-white/10 shadow-sm">
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <h3
                  className="text-sm font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-1"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {cat.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] dark:text-gray-400">
                  {cat.azkar.length} ذكر
                </p>
              </div>

              {/* Progress bar */}
              {pct > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1A5C42] to-[#C5A356]"
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
