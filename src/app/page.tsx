'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { IslamicHeader } from '@/components/IslamicHeader';
import { StatsBar } from '@/components/StatsBar';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { QuickAccess } from '@/components/QuickAccess';
import { AzkarPage } from '@/components/AzkarPage';
import { TasbeehPage } from '@/components/TasbeehPage';
import { FavoritesPage } from '@/components/FavoritesPage';
import { SettingsPage } from '@/components/SettingsPage';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { Toast } from '@/components/Toast';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { InstallPrompt } from '@/components/InstallPrompt';

export default function Home() {
  const { activeTab, openCategory, checkStreak } = useStore();

  useEffect(() => {
    checkStreak();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [checkStreak]);

  return (
    <main className="min-h-screen bg-mesh-light dark:bg-mesh-dark transition-colors">
      <ServiceWorkerRegistration />
      <InstallPrompt />
      <FloatingParticles />
      <Toast />

      {/* AzkarPage - Full screen overlay */}
      <AnimatePresence>
        {openCategory && <AzkarPage />}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`max-w-lg mx-auto px-4 pt-4 ${
          openCategory ? 'pointer-events-none' : ''
        }`}
        style={{
          paddingBottom: openCategory
            ? '1rem'
            : 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'home' && !openCategory && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.12 }}
              className="space-y-6"
            >
              <IslamicHeader />
              <StatsBar />
              <div>
                <h2
                  className="text-base font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-3"
                  style={{ fontFamily: "'Amiri', serif" }}
                >
                  فئات الأذكار
                </h2>
                <CategoriesGrid />
              </div>
              <QuickAccess />
            </motion.div>
          )}

          {activeTab === 'tasbeeh' && !openCategory && (
            <motion.div
              key="tasbeeh"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.12 }}
              className="pt-4"
            >
              <TasbeehPage />
            </motion.div>
          )}

          {activeTab === 'fav' && !openCategory && (
            <motion.div
              key="fav"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.12 }}
              className="pt-4"
            >
              <FavoritesPage />
            </motion.div>
          )}

          {activeTab === 'settings' && !openCategory && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.12 }}
              className="pt-4"
            >
              <SettingsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
