import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Navigation
  activeTab: 'home' | 'tasbeeh' | 'fav' | 'settings';
  setActiveTab: (tab: AppState['activeTab']) => void;

  // Azkar browsing
  openCategory: string | null;
  setOpenCategory: (id: string | null) => void;

  // Zikr progress - persisted in localStorage
  zikrProgress: Record<string, { remaining: number; completed: boolean }[]>;
  tapZikr: (categoryId: string, index: number, totalCount: number) => void;
  resetCategory: (categoryId: string) => void;

  // Favorites - persisted
  favorites: { cat: string; index: number }[];
  toggleFavorite: (cat: string, index: number) => void;

  // Tasbeeh
  tasbeehCount: number;
  tasbeehTarget: number;
  tasbeehType: string;
  tapTasbeeh: () => void;
  setTasbeehTarget: (target: number) => void;
  resetTasbeeh: () => void;
  setTasbeehType: (type: string) => void;

  // Stats - persisted
  stats: { today: number; streak: number; allTime: number; lastDate: string };
  incrementStats: () => void;
  checkStreak: () => void;

  // Settings - persisted
  settings: {
    fontSize: 'small' | 'medium' | 'large';
    hapticFeedback: boolean;
    soundEnabled: boolean;
    autoScroll: boolean;
    showTranslation: boolean;
    morningReminder: boolean;
    eveningReminder: boolean;
  };
  updateSettings: (s: Partial<AppState['settings']>) => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Azkar browsing
      openCategory: null,
      setOpenCategory: (id) => set({ openCategory: id }),

      // Zikr progress
      zikrProgress: {},
      tapZikr: (categoryId, index, totalCount) => {
        set((state) => {
          const current = state.zikrProgress[categoryId] || [];
          const newProgress = [...current];
          if (!newProgress[index]) {
            newProgress[index] = { remaining: totalCount - 1, completed: false };
          } else if (!newProgress[index].completed) {
            const newRemaining = newProgress[index].remaining - 1;
            newProgress[index] = {
              remaining: Math.max(0, newRemaining),
              completed: newRemaining <= 0,
            };
          }
          return { zikrProgress: { ...state.zikrProgress, [categoryId]: newProgress } };
        });
        // Also increment stats
        get().incrementStats();
      },
      resetCategory: (categoryId) => {
        set((state) => {
          const newProgress = { ...state.zikrProgress };
          delete newProgress[categoryId];
          return { zikrProgress: newProgress };
        });
      },

      // Favorites
      favorites: [],
      toggleFavorite: (cat, index) => {
        set((state) => {
          const exists = state.favorites.some((f) => f.cat === cat && f.index === index);
          if (exists) {
            return { favorites: state.favorites.filter((f) => !(f.cat === cat && f.index === index)) };
          }
          return { favorites: [...state.favorites, { cat, index }] };
        });
      },

      // Tasbeeh
      tasbeehCount: 0,
      tasbeehTarget: 33,
      tasbeehType: 'سبحان الله',
      tapTasbeeh: () => {
        set((state) => ({ tasbeehCount: state.tasbeehCount + 1 }));
        get().incrementStats();
      },
      setTasbeehTarget: (target) => set({ tasbeehTarget: target, tasbeehCount: 0 }),
      resetTasbeeh: () => set({ tasbeehCount: 0 }),
      setTasbeehType: (type) => set({ tasbeehType: type, tasbeehCount: 0 }),

      // Stats
      stats: { today: 0, streak: 0, allTime: 0, lastDate: '' },
      incrementStats: () => {
        set((state) => {
          const today = getToday();
          if (state.stats.lastDate === today) {
            return {
              stats: {
                ...state.stats,
                today: state.stats.today + 1,
                allTime: state.stats.allTime + 1,
              },
            };
          }
          // New day, reset today counter but preserve streak
          const yesterday = getYesterday();
          const newStreak = state.stats.lastDate === yesterday ? state.stats.streak + 1 : 1;
          return {
            stats: {
              today: 1,
              streak: newStreak,
              allTime: state.stats.allTime + 1,
              lastDate: today,
            },
          };
        });
      },
      checkStreak: () => {
        set((state) => {
          const today = getToday();
          if (state.stats.lastDate === today) return state;
          const yesterday = getYesterday();
          if (state.stats.lastDate !== yesterday && state.stats.lastDate !== '') {
            return {
              stats: {
                today: 0,
                streak: 0,
                allTime: state.stats.allTime,
                lastDate: today,
              },
            };
          }
          return state;
        });
      },

      // Settings
      settings: {
        fontSize: 'medium',
        hapticFeedback: true,
        soundEnabled: false,
        autoScroll: true,
        showTranslation: true,
        morningReminder: false,
        eveningReminder: false,
      },
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),
    }),
    {
      name: 'azkar-app-storage',
      partialize: (state) => ({
        zikrProgress: state.zikrProgress,
        favorites: state.favorites,
        tasbeehCount: state.tasbeehCount,
        tasbeehTarget: state.tasbeehTarget,
        tasbeehType: state.tasbeehType,
        stats: state.stats,
        settings: state.settings,
      }),
    }
  )
);
