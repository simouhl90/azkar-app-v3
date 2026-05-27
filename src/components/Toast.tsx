'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

let toastId = 0;
const listeners: Array<(t: ToastItem) => void> = [];

export function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
  const t: ToastItem = { id: ++toastId, message, type };
  listeners.forEach((l) => l(t));
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
        timers.current.delete(t.id);
      }, 2500);
      timers.current.set(t.id, timer);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          className={`
            pointer-events-auto px-5 py-3 rounded-xl shadow-lg text-sm font-medium
            transition-all duration-300 animate-slide-down
            max-w-sm text-center cursor-pointer
            ${
              t.type === 'success'
                ? 'bg-[#1A5C42] text-white'
                : t.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-[#2C2C2C] text-white'
            }
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
