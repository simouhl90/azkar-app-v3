'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { azkarData } from '@/lib/azkar-data';
import { showToast } from './Toast';

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useStore();

  const handleRemove = (cat: string, index: number) => {
    toggleFavorite(cat, index);
    showToast('تمّ الإزالة من المفضلة');
  };

  const handleQuickAccess = (cat: string, index: number) => {
    const store = useStore.getState();
    store.setActiveTab('home');
    store.setOpenCategory(cat);
  };

  if (favorites.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="w-24 h-24 rounded-full glass-gold flex items-center justify-center mb-6 glow-gold">
          <Heart className="w-12 h-12 text-[#C5A356]/40" />
        </div>
        <p
          className="text-xl font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-3"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          لا توجد أذكار مفضلة
        </p>
        <p className="text-sm text-[#6B6B6B] dark:text-gray-400 text-center max-w-[250px]" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
          اضغط على أيقونة القلب ❤️ بجانب أي ذكر لإضافته هنا
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2
        className="text-lg font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-4"
        style={{ fontFamily: "'Amiri', serif" }}
      >
        المفضلة ({favorites.length})
      </h2>

      <div className="space-y-3">
        <AnimatePresence>
          {favorites.map((fav, idx) => {
            const cat = azkarData.find((c) => c.id === fav.cat);
            if (!cat) return null;
            const zikr = cat.azkar[fav.index];
            if (!zikr) return null;

            return (
              <motion.div
                key={`${fav.cat}-${fav.index}`}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                layout
              >
                <div
                  className="glass-gold p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg gradient-accent-gold-left"
                  onClick={() => handleQuickAccess(fav.cat, fav.index)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-white/5 flex items-center justify-center border border-white/40 dark:border-white/10">
                      <span className="text-lg">{cat.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full glass-btn text-[#1A5C42] dark:text-[#E8D5A3] whitespace-nowrap" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                          {cat.title}
                        </span>
                        <span className="text-[10px] text-[#6B6B6B] dark:text-gray-500" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                          {zikr.ref}
                        </span>
                      </div>
                      <p
                        className="text-[14px] text-[#2C2C2C] dark:text-gray-200 leading-[1.9] line-clamp-3"
                        style={{ fontFamily: "'Amiri', serif" }}
                        dir="rtl"
                      >
                        {zikr.text}
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(fav.cat, fav.index);
                      }}
                      className="shrink-0 p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
