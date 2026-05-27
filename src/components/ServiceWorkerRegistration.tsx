'use client';

import { useEffect } from 'react';
import { showToast } from '@/components/Toast';

/**
 * Service Worker Registration Component
 * Registers the SW on mount, handles updates, shows toast on update available
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered successfully:', registration.scope);

          // Check for updates periodically
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available
                  showToast('تحديث متوفر! اضغط لتحديث التطبيق', 'info');

                  // Listen for the user to interact, then reload
                  const handleUpdate = () => {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.removeEventListener('click', handleUpdate);
                  };
                  window.addEventListener('click', handleUpdate);
                }
              });
            }
          });

          // Handle controller change (when new SW takes over)
          let refreshing = false;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
              refreshing = true;
              window.location.reload();
            }
          });
        })
        .catch((error) => {
          console.warn('[SW] Registration failed:', error);
        });
    }
  }, []);

  return null;
}
