'use client';

import { motion } from 'framer-motion';
import { BookOpen, CircleDot, Heart, Settings } from 'lucide-react';
import { useStore } from '@/store/useStore';

const tabs = [
  { id: 'home' as const, label: 'الأذكار', icon: BookOpen },
  { id: 'tasbeeh' as const, label: 'السبحة', icon: CircleDot },
  { id: 'fav' as const, label: 'المفضلة', icon: Heart },
  { id: 'settings' as const, label: 'الإعدادات', icon: Settings },
];

export function BottomNav() {
  const { activeTab, setActiveTab, openCategory } = useStore();

  if (openCategory) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5" style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-t from-[#0D3B2E]/8 to-[#1A5C42]/5 dark:from-[#1A5C42]/25 dark:to-[#0D3B2E]/15 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <tab.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-[#1A5C42] dark:text-[#E8D5A3]'
                      : 'text-[#6B6B6B] dark:text-gray-500'
                  }`}
                />
              </motion.div>
              <span
                className={`text-[10px] transition-colors ${
                  isActive
                    ? 'text-[#1A5C42] dark:text-[#E8D5A3] font-bold'
                    : 'text-[#6B6B6B] dark:text-gray-500'
                }`}
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#C5A356]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
