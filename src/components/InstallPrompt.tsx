'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt Component
 * Shows an install banner at the top of the page when the browser supports it
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsInstalled(true);
      return;
    }

    // Check if already in standalone mode (installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      // Prevent the default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-install-dismissed', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
    } catch {
      // User cancelled or error
    } finally {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    setDeferredPrompt(null);
  }, []);

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[150] p-3 sm:p-4"
        >
          <div
            className="max-w-lg mx-auto rounded-2xl p-4 shadow-xl border border-[#C5A356]/30"
            style={{
              background:
                'linear-gradient(135deg, #0D3B2E 0%, #1A5C42 50%, #0D3B2E 100%)',
            }}
          >
            {/* Gold decorative top line */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C5A356] to-transparent rounded-full" />

            <div className="flex items-start gap-3">
              {/* App Icon */}
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#C5A356]/20 flex items-center justify-center mt-0.5">
                <Smartphone className="w-5 h-5 text-[#C5A356]" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#E8D5A3] mb-1" style={{ fontFamily: "'Amiri', serif" }}>
                  ثبّت أذكار المسلم
                </p>
                <p className="text-xs text-[#C5A356]/70 leading-relaxed" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
                  أضف التطبيق إلى شاشتك الرئيسية لسهولة الوصول السريع
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                    style={{
                      fontFamily: "'Noto Kufi Arabic', sans-serif",
                      background: 'linear-gradient(135deg, #C5A356 0%, #D4B96A 100%)',
                      color: '#0D3B2E',
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    تثبيت
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-xl text-xs text-[#C5A356]/60 hover:text-[#C5A356] hover:bg-[#C5A356]/10 transition-all"
                    style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                  >
                    لاحقاً
                  </button>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-[#C5A356]/10 transition-colors"
              >
                <X className="w-4 h-4 text-[#C5A356]/50" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
