'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Type,
  Trash2,
  Info,
  Bell,
  BellOff,
  Download,
  WifiOff,
  Wifi,
  Clock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { showToast } from './Toast';
import { CrescentIcon } from './Icons';
import {
  requestPermission,
  scheduleMorningReminder,
  scheduleEveningReminder,
  cancelReminders,
  isNotificationSupported,
  getNotificationPermission,
} from '@/lib/notifications';

function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl glass-btn flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
        </div>
        <div>
          <p
            className="text-sm font-medium text-[#2C2C2C] dark:text-gray-200"
            style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          >
            {label}
          </p>
          {description && (
            <p
              className="text-[11px] text-[#6B6B6B] dark:text-gray-500"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-gold p-4 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [swActive, setSwActive] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    isNotificationSupported() ? getNotificationPermission() : 'default'
  );
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        setSwActive(!!reg);
      });
    }

    const handler = () => setCanInstall(true);
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => setCanInstall(false);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleResetProgress = () => {
    localStorage.removeItem('azkar-app-storage');
    showToast('تمّ إعادة تعيين جميع البيانات');
    setShowConfirmReset(false);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleInstallApp = async () => {
    const event = (window as unknown as Record<string, { prompt: () => Promise<void> }>).deferredPrompt;
    if (event) {
      try {
        await event.prompt();
      } catch {
        // User dismissed
      }
    } else {
      showToast('يرجى استخدام زر التثبيت في شريط المتصفح', 'info');
    }
  };

  const handleToggleMorning = async (enabled: boolean) => {
    if (enabled) {
      if (notificationPermission !== 'granted') {
        const perm = await requestPermission();
        setNotificationPermission(perm);
        if (perm !== 'granted') {
          showToast('يرجى السماح بالإشعارات أولاً', 'error');
          return;
        }
      }
      scheduleMorningReminder();
      showToast('تم تفعيل تذكير أذكار الصباح');
    } else {
      cancelReminders();
      if (settings.eveningReminder) {
        scheduleEveningReminder();
      }
      showToast('تم إيقاف تذكير أذكار الصباح');
    }
    updateSettings({ morningReminder: enabled });
  };

  const handleToggleEvening = async (enabled: boolean) => {
    if (enabled) {
      if (notificationPermission !== 'granted') {
        const perm = await requestPermission();
        setNotificationPermission(perm);
        if (perm !== 'granted') {
          showToast('يرجى السماح بالإشعارات أولاً', 'error');
          return;
        }
      }
      scheduleEveningReminder();
      showToast('تم تفعيل تذكير أذكار المساء');
    } else {
      cancelReminders();
      if (settings.morningReminder) {
        scheduleMorningReminder();
      }
      showToast('تم إيقاف تذكير أذكار المساء');
    }
    updateSettings({ eveningReminder: enabled });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4"
    >
      <h2
        className="text-lg font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-4"
        style={{ fontFamily: "'Amiri', serif" }}
      >
        الإعدادات
      </h2>

      {/* Display Section */}
      <GlassCard>
        <h3
          className="text-sm font-bold text-[#1A5C42] dark:text-[#E8D5A3] mb-3"
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
        >
          العرض
        </h3>

        <div className="mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl glass-btn flex items-center justify-center">
              <Type className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
            </div>
            <p
              className="text-sm font-medium text-[#2C2C2C] dark:text-gray-200"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
            >
              حجم الخط
            </p>
          </div>
          <div className="flex gap-2 mr-12">
            {(['small', 'medium', 'large'] as const).map((size) => {
              const labels = { small: 'صغير', medium: 'متوسط', large: 'كبير' };
              return (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className={`px-4 py-2 rounded-xl text-xs transition-all ${
                    settings.fontSize === size
                      ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] text-white shadow-md border border-[#C5A356]/30'
                      : 'glass-btn text-[#2C2C2C] dark:text-gray-300'
                  }`}
                  style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                >
                  {labels[size]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#C5A356]/20 to-transparent my-2" />

        <SettingRow
          icon={Info}
          label="إظهار الفوائد"
          description="عرض تفسير فضل كل ذكر"
        >
          <div className="relative">
            <div className="w-11 h-6 rounded-full bg-[#1A5C42]/10 dark:bg-[#1A5C42]/20 transition-colors">
              <motion.div
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors ${
                  settings.showTranslation
                    ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] left-[22px]'
                    : 'bg-gray-300 dark:bg-gray-600 left-0.5'
                }`}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </div>
            <input
              type="checkbox"
              className="absolute inset-0 opacity-0 cursor-pointer"
              checked={settings.showTranslation}
              onChange={(v) => updateSettings({ showTranslation: v.target.checked })}
            />
          </div>
        </SettingRow>
      </GlassCard>

      {/* Feedback Section */}
      <GlassCard>
        <h3
          className="text-sm font-bold text-[#1A5C42] dark:text-[#E8D5A3] mb-3"
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
        >
          التغذية الراجعة
        </h3>

        <SettingRow
          icon={Smartphone}
          label="الاهتزاز"
          description="اهتزاز عند الضغط"
        >
          <div className="relative">
            <div className="w-11 h-6 rounded-full bg-[#1A5C42]/10 dark:bg-[#1A5C42]/20 transition-colors">
              <motion.div
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors ${
                  settings.hapticFeedback
                    ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] left-[22px]'
                    : 'bg-gray-300 dark:bg-gray-600 left-0.5'
                }`}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </div>
            <input
              type="checkbox"
              className="absolute inset-0 opacity-0 cursor-pointer"
              checked={settings.hapticFeedback}
              onChange={(v) => updateSettings({ hapticFeedback: v.target.checked })}
            />
          </div>
        </SettingRow>

        <div className="h-px bg-gradient-to-r from-transparent via-[#C5A356]/20 to-transparent my-2" />

        <SettingRow
          icon={settings.soundEnabled ? Volume2 : VolumeX}
          label="الأصوات"
          description="تشغيل الأصوات"
        >
          <div className="relative">
            <div className="w-11 h-6 rounded-full bg-[#1A5C42]/10 dark:bg-[#1A5C42]/20 transition-colors">
              <motion.div
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors ${
                  settings.soundEnabled
                    ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] left-[22px]'
                    : 'bg-gray-300 dark:bg-gray-600 left-0.5'
                }`}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </div>
            <input
              type="checkbox"
              className="absolute inset-0 opacity-0 cursor-pointer"
              checked={settings.soundEnabled}
              onChange={(v) => updateSettings({ soundEnabled: v.target.checked })}
            />
          </div>
        </SettingRow>

        <div className="h-px bg-gradient-to-r from-transparent via-[#C5A356]/20 to-transparent my-2" />

        <SettingRow
          icon={Moon}
          label="الوضع الداكن"
          description="تبديل بين الوضع الفاتح والداكن"
        >
          <ThemeToggle />
        </SettingRow>
      </GlassCard>

      {/* Notifications Section */}
      {isNotificationSupported() && (
        <GlassCard>
          <h3
            className="text-sm font-bold text-[#1A5C42] dark:text-[#E8D5A3] mb-3"
            style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          >
            التذكيرات
          </h3>

          {notificationPermission === 'denied' && (
            <div className="mb-3 p-2.5 rounded-xl glass-btn border border-amber-400/30">
              <p
                className="text-[11px] text-amber-600 dark:text-amber-400"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                تم رفض إذن الإشعارات. يرجى تفعيله من إعدادات المتصفح.
              </p>
            </div>
          )}

          <SettingRow
            icon={settings.morningReminder ? Bell : BellOff}
            label="تذكير أذكار الصباح"
            description="تذكير يومي عند الفجر (~٥:٣٠ ص)"
          >
            <div className="relative">
              <div className="w-11 h-6 rounded-full bg-[#1A5C42]/10 dark:bg-[#1A5C42]/20 transition-colors">
                <motion.div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors ${
                    settings.morningReminder
                      ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] left-[22px]'
                      : 'bg-gray-300 dark:bg-gray-600 left-0.5'
                  }`}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </div>
              <input
                type="checkbox"
                className="absolute inset-0 opacity-0 cursor-pointer"
                checked={settings.morningReminder}
                onChange={(v) => handleToggleMorning(v.target.checked)}
              />
            </div>
          </SettingRow>

          <div className="h-px bg-gradient-to-r from-transparent via-[#C5A356]/20 to-transparent my-2" />

          <SettingRow
            icon={settings.eveningReminder ? Bell : BellOff}
            label="تذكير أذكار المساء"
            description="تذكير يومي عند المغرب (~٦:٣٠ م)"
          >
            <div className="relative">
              <div className="w-11 h-6 rounded-full bg-[#1A5C42]/10 dark:bg-[#1A5C42]/20 transition-colors">
                <motion.div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors ${
                    settings.eveningReminder
                      ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] left-[22px]'
                      : 'bg-gray-300 dark:bg-gray-600 left-0.5'
                  }`}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </div>
              <input
                type="checkbox"
                className="absolute inset-0 opacity-0 cursor-pointer"
                checked={settings.eveningReminder}
                onChange={(v) => handleToggleEvening(v.target.checked)}
              />
            </div>
          </SettingRow>
        </GlassCard>
      )}

      {/* App & PWA Section */}
      <GlassCard>
        <h3
          className="text-sm font-bold text-[#1A5C42] dark:text-[#E8D5A3] mb-3"
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
        >
          التطبيق
        </h3>

        {canInstall && (
          <>
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-3 w-full py-3 rounded-xl transition-all hover:bg-[#1A5C42]/5 dark:hover:bg-[#1A5C42]/10"
            >
              <div className="w-9 h-9 rounded-xl glass-btn flex items-center justify-center">
                <Download className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-medium text-[#2C2C2C] dark:text-gray-200"
                  style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                >
                  تثبيت التطبيق
                </p>
                <p
                  className="text-[11px] text-[#6B6B6B] dark:text-gray-500"
                  style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
                >
                  أضف التطبيق إلى شاشتك الرئيسية
                </p>
              </div>
            </button>
            <div className="h-px bg-gradient-to-r from-transparent via-[#C5A356]/20 to-transparent my-2" />
          </>
        )}

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-btn flex items-center justify-center">
              {isOffline ? (
                <WifiOff className="w-4 h-4 text-amber-500" />
              ) : (
                <Wifi className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
              )}
            </div>
            <div>
              <p
                className="text-sm font-medium text-[#2C2C2C] dark:text-gray-200"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                حالة الاتصال
              </p>
              <p
                className="text-[11px] text-[#6B6B6B] dark:text-gray-500"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                {isOffline ? 'غير متصل - الوضع Offline' : 'متصل بالإنترنت'}
              </p>
            </div>
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isOffline ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#C5A356]/20 to-transparent my-2" />

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-btn flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
            </div>
            <div>
              <p
                className="text-sm font-medium text-[#2C2C2C] dark:text-gray-200"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                الوضع المتاح
              </p>
              <p
                className="text-[11px] text-[#6B6B6B] dark:text-gray-500"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                {swActive ? 'يعمل بدون إنترنت ✓' : 'يتطلب اتصال بالإنترنت'}
              </p>
            </div>
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              swActive ? 'bg-emerald-400' : 'bg-gray-300'
            }`}
          />
        </div>
      </GlassCard>

      {/* Behavior Section */}
      <GlassCard>
        <h3
          className="text-sm font-bold text-[#1A5C42] dark:text-[#E8D5A3] mb-3"
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
        >
          السلوك
        </h3>
        <SettingRow
          icon={Sun}
          label="التمرير التلقائي"
          description="الانتقال للذكر التالي تلقائياً"
        >
          <div className="relative">
            <div className="w-11 h-6 rounded-full bg-[#1A5C42]/10 dark:bg-[#1A5C42]/20 transition-colors">
              <motion.div
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-colors ${
                  settings.autoScroll
                    ? 'bg-gradient-to-r from-[#0D3B2E] to-[#1A5C42] left-[22px]'
                    : 'bg-gray-300 dark:bg-gray-600 left-0.5'
                }`}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            </div>
            <input
              type="checkbox"
              className="absolute inset-0 opacity-0 cursor-pointer"
              checked={settings.autoScroll}
              onChange={(v) => updateSettings({ autoScroll: v.target.checked })}
            />
          </div>
        </SettingRow>
      </GlassCard>

      {/* Data Section */}
      <GlassCard className="border-red-200/30">
        <h3
          className="text-sm font-bold text-red-500 mb-3"
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
        >
          البيانات
        </h3>
        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center gap-3 w-full py-3 text-red-500 hover:text-red-600 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <div className="text-right">
            <p
              className="text-sm font-medium"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
            >
              إعادة تعيين جميع البيانات
            </p>
            <p
              className="text-[11px] text-[#6B6B6B] dark:text-gray-500"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
            >
              مسح التقدم والمفضلة والإعدادات
            </p>
          </div>
        </button>
      </GlassCard>

      {/* About Section */}
      <GlassCard>
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl glass-header flex items-center justify-center"><CrescentIcon className="w-7 h-7 text-[#E8D5A3]" /></div>
          <p
            className="text-base font-bold text-[#0D3B2E] dark:text-[#E8D5A3]"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            أذكار المسلم
          </p>
          <p
            className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-1"
            style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          >
            الإصدار 2.0.0
          </p>
          <p
            className="text-[10px] text-[#6B6B6B] dark:text-gray-500 mt-2"
            style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          >
            حصّن نفسك بذكر الله
          </p>
          <p
            className="text-[10px] text-[#6B6B6B] dark:text-gray-500 mt-1"
            style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          >
            الأذكار من مصادر صحيحة (البخاري، مسلم، الترمذي، أبي داود، النسائي)
          </p>
        </div>
      </GlassCard>

      {/* Confirm Reset Dialog */}
      {showConfirmReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowConfirmReset(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-gold rounded-3xl p-6 shadow-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-lg font-bold text-[#0D3B2E] dark:text-[#E8D5A3] mb-2"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              تأكيد إعادة التعيين
            </h3>
            <p
              className="text-sm text-[#6B6B6B] dark:text-gray-400 mb-6"
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
            >
              هل أنت متأكد من إعادة تعيين جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResetProgress}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                نعم، إعادة تعيين
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl glass-btn text-[#2C2C2C] dark:text-gray-200 text-sm font-medium transition-colors"
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
      }}
      className="p-2 rounded-xl glass-btn"
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
      ) : (
        <Sun className="w-4 h-4 text-[#1A5C42] dark:text-[#E8D5A3]" />
      )}
    </button>
  );
}
