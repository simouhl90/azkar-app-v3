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
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-md mx-3 mb-2"
        style={{ marginBottom: 'max(0.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.25rem))' }}
      >
        {/* Floating pill container with gradient border */}
        <div className="relative rounded-[1.75rem] p-[1.5px] overflow-hidden">
          {/* Gradient border background */}
          <div
            className="absolute inset-0 rounded-[1.75rem]"
            style={{
              background: 'linear-gradient(135deg, rgba(197,163,86,0.25), rgba(26,92,66,0.15), rgba(197,163,86,0.15), rgba(26,92,66,0.25))',
            }}
          />

          {/* Inner glass fill */}
          <div className="relative rounded-[calc(1.75rem-2px)] glass-nav border-0 py-2 px-2">
            <div className="flex items-center justify-around">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex flex-col items-center gap-0.5 px-5 py-2 rounded-full transition-all"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-gradient-to-t from-[#0D3B2E]/[0.08] to-[#1A5C42]/[0.04] dark:from-[#C5A356]/[0.15] dark:to-[#0D3B2E]/[0.08] rounded-full"
                        style={{
                          boxShadow: isActive
                            ? '0 0 20px rgba(197,163,86,0.15), 0 0 40px rgba(26,92,66,0.08)'
                            : 'none',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Active glow circle */}
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C5A356]"
                        style={{
                          boxShadow: '0 0 8px rgba(197,163,86,0.5), 0 0 16px rgba(197,163,86,0.3)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <motion.div
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        y: isActive ? -1 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <tab.icon
                        className={`w-[22px] h-[22px] transition-colors ${
                          isActive
                            ? 'text-[#1A5C42] dark:text-[#E8D5A3]'
                            : 'text-[#6B6B6B] dark:text-gray-500'
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.8}
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

                    {/* Golden dot indicator under active tab */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#C5A356]"
                        style={{
                          boxShadow: '0 0 6px rgba(197,163,86,0.4)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
