'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { azkarData, quickAccessAzkar } from '@/lib/azkar-data';
import { ChevronLeft } from 'lucide-react';
import { SunriseIcon, MoonIcon, MoonSleepIcon, PrayerHandsIcon, SparklesIcon, OpenBookIcon, WaterDropIcon, FoodIcon } from './Icons';

const iconMap: Record<string, React.ComponentType<{className?: string; size?: number}>> = {
  SunriseIcon, MoonIcon, MoonSleepIcon, PrayerHandsIcon, SparklesIcon, OpenBookIcon, WaterDropIcon, FoodIcon,
};

export function QuickAccess() {
  const { setOpenCategory, setActiveTab } = useStore();

  const handleQuickAccess = (catId: string, index: number) => {
    setActiveTab('home');
    setOpenCategory(catId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.15 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-base font-bold text-[#0D3B2E] dark:text-[#E8D5A3]"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          أذكار مختصرة
        </h2>
        <div className="flex items-center gap-1 text-[#C5A356] text-xs">
          <span style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>اسحب للمزيد</span>
          <ChevronLeft className="w-3 h-3" />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {quickAccessAzkar.map((qa, idx) => {
          const cat = azkarData.find((c) => c.id === qa.catId);
          if (!cat) return null;
          const zikr = cat.azkar[qa.index];
          if (!zikr) return null;

          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.97 }}
              className="snap-start shrink-0 w-[220px]"
            >
              <div
                className="glass-gold cursor-pointer h-full p-5 rounded-2xl glass-shimmer gradient-accent-left"
                onClick={() => handleQuickAccess(qa.catId, qa.index)}
              >
                <div className="flex items-start gap-2.5 mb-3">
                  {(() => { const IconComponent = iconMap[cat.icon]; return IconComponent ? <IconComponent className="w-5 h-5" /> : <span className="text-lg">{cat.icon}</span>; })()}
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full glass-btn text-[#1A5C42] dark:text-[#E8D5A3] whitespace-nowrap" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                    {cat.title}
                  </span>
                </div>
                <p
                  className="text-[13px] text-[#2C2C2C] dark:text-gray-300 leading-[1.8] line-clamp-3"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  {zikr.text}
                </p>
                <p className="mt-2.5 text-[10px] text-[#C5A356] font-medium" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                  {qa.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
