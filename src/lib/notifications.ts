/**
 * Notification System for Azkar App
 * Handles permission requests and scheduling reminders
 */

const MORNING_TIME = { hours: 5, minutes: 30 };  // ~5:30 AM Fajr
const EVENING_TIME = { hours: 18, minutes: 30 }; // ~6:30 PM Maghrib

let morningTimerId: ReturnType<typeof setTimeout> | null = null;
let eveningTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Calculate milliseconds until the next occurrence of a given time
 */
function msUntilTime(hours: number, minutes: number): number {
  const now = new Date();
  const target = new Date();

  target.setHours(hours, minutes, 0, 0);

  // If the target time has already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

/**
 * Show a notification
 */
function showNotification(title: string, body: string, tag: string): void {
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      dir: 'rtl',
      lang: 'ar',
      tag,
      renotify: true,
    });
  } catch {
    // Service worker might handle notifications in some contexts
    console.warn('[Notifications] Could not show notification');
  }
}

/**
 * Schedule a reminder that fires once, then reschedules for the next day
 */
function scheduleRecurringReminder(
  hours: number,
  minutes: number,
  title: string,
  body: string,
  tag: string,
  timerIdRef: { current: ReturnType<typeof setTimeout> | null }
): void {
  // Clear existing timer
  if (timerIdRef.current) {
    clearTimeout(timerIdRef.current);
  }

  const ms = msUntilTime(hours, minutes);

  const callback = () => {
    showNotification(title, body, tag);
    // Reschedule for next day
    scheduleRecurringReminder(hours, minutes, title, body, tag, timerIdRef);
  };

  timerIdRef.current = setTimeout(callback, ms);
}

// Timer refs using mutable objects for closure
const morningTimerRef = { current: morningTimerId };
const eveningTimerRef = { current: eveningTimerId };

/**
 * Schedule morning azkar reminder (Fajr time ~5:30 AM)
 */
export function scheduleMorningReminder(): void {
  scheduleRecurringReminder(
    MORNING_TIME.hours,
    MORNING_TIME.minutes,
    'أذكار الصباح ☀️',
    'حان وقت أذكار الصباح، حصّن نفسك بذكر الله',
    'morning-azkar'
  );
}

/**
 * Schedule evening azkar reminder (Maghrib time ~6:30 PM)
 */
export function scheduleEveningReminder(): void {
  scheduleRecurringReminder(
    EVENING_TIME.hours,
    EVENING_TIME.minutes,
    'أذكار المساء 🌙',
    'حان وقت أذكار المساء، حصّن نفسك بذكر الله',
    'evening-azkar'
  );
}

/**
 * Cancel all active reminders
 */
export function cancelReminders(): void {
  if (morningTimerRef.current) {
    clearTimeout(morningTimerRef.current);
    morningTimerRef.current = null;
  }
  if (eveningTimerRef.current) {
    clearTimeout(eveningTimerRef.current);
    eveningTimerRef.current = null;
  }
}

/**
 * Check if a specific reminder is active
 */
export function isMorningReminderActive(): boolean {
  return morningTimerRef.current !== null;
}

export function isEveningReminderActive(): boolean {
  return eveningTimerRef.current !== null;
}
