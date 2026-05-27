'use client';

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// ─── Sunrise Icon (Morning Azkar) ───
export function SunriseIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Horizon line */}
      <path d="M2 18h20" />
      {/* Sun body */}
      <circle cx="12" cy="11" r="4" />
      {/* Sun rays - upper */}
      <line x1="12" y1="3" x2="12" y2="5" />
      <line x1="17.2" y1="5.8" x2="15.8" y2="7.2" />
      <line x1="6.8" y1="5.8" x2="8.2" y2="7.2" />
      {/* Sun rays - sides */}
      <line x1="19" y1="11" x2="17" y2="11" />
      <line x1="5" y1="11" x2="7" y2="11" />
      {/* Sunrise arc / horizon glow */}
      <path d="M4 18c0-4.4 3.6-8 8-8s8 3.6 8 8" opacity="0.4" />
    </svg>
  );
}

// ─── Moon Icon (Evening Azkar) ───
export function MoonIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Crescent moon - outer arc */}
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      {/* Small stars */}
      <circle cx="8" cy="6" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="4" r="0.5" fill="currentColor" stroke="none" />
      {/* Sparkle stars */}
      <path d="M17 8l0.5 1 1 0.5-1 0.5-0.5 1-0.5-1-1-0.5 1-0.5z" fill="currentColor" stroke="none" />
      <path d="M5 14l0.4 0.8 0.8 0.4-0.8 0.4-0.4 0.8-0.4-0.8-0.8-0.4 0.8-0.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Moon Sleep Icon (Sleep Azkar) ───
export function MoonSleepIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Crescent moon */}
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      {/* Closed eyelashes / sleep curves */}
      <path d="M3 8c1-0.5 2-0.5 3 0" />
      <path d="M7 6.5c1-0.5 2-0.5 3 0" />
      {/* Zzz letters */}
      <path d="M17 2l1.5 2.5h-2l1.5 2.5" strokeWidth="1.3" />
      <path d="M20 6l0.8 1.3h-1.1L20.5 8.6" strokeWidth="1" opacity="0.6" />
      {/* Small star */}
      <path d="M14 7l0.3 0.6 0.6 0.3-0.6 0.3-0.3 0.6-0.3-0.6-0.6-0.3 0.6-0.3z" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

// ─── Prayer Hands Icon (Dua / After Prayer) ───
export function PrayerHandsIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Outer glow circle */}
      <circle cx="12" cy="12" r="10" opacity="0.08" fill="currentColor" stroke="none" />
      {/* Left palm */}
      <path d="M8 21V12a3 3 0 0 1 3-3v0" />
      <path d="M8 16h3" />
      {/* Right palm */}
      <path d="M16 21V12a3 3 0 0 0-3-3v0" />
      <path d="M16 16h-3" />
      {/* Fingertips touching at top */}
      <path d="M11 5.5c0-0.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5" />
      <path d="M11 7.5c0-0.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5" />
      {/* Connecting line between hands */}
      <path d="M11 9h2" />
      {/* Wrists spread apart */}
      <path d="M8 21c-1-0.5-2-1.5-2-3" />
      <path d="M16 21c1-0.5 2-1.5 2-3" />
      {/* Top glow */}
      <path d="M9 4c1-1 2.5-1.5 3.5-1.5s2 .5 2.5 1.5" opacity="0.3" />
    </svg>
  );
}

// ─── Sparkles Icon (Miscellaneous Azkar) ───
export function SparklesIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Large sparkle */}
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
      {/* Small sparkle top right */}
      <path d="M19 11l0.7 2 2 0.7-2 0.7-0.7 2-0.7-2-2-0.7 2-0.7z" />
      {/* Small sparkle bottom left */}
      <path d="M5 15l0.7 2 2 0.7-2 0.7-0.7 2-0.7-2-2-0.7 2-0.7z" />
    </svg>
  );
}

// ─── Open Book Icon (Quran Duas) ───
export function OpenBookIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Book spine */}
      <path d="M2 4v16" />
      <path d="M22 4v16" />
      {/* Left page */}
      <path d="M2 4c2-1 4-1 6 0s4 1 6 0" />
      {/* Right page */}
      <path d="M22 4c-2-1-4-1-6 0s-4 1-6 0" />
      {/* Left page lines */}
      <path d="M2 20c2-1 4-1 6 0s4 1 6 0" />
      {/* Right page lines */}
      <path d="M22 20c-2-1-4-1-6 0s-4 1-6 0" />
      {/* Page content lines left */}
      <line x1="5" y1="9" x2="9" y2="9" opacity="0.5" />
      <line x1="6" y1="11.5" x2="10" y2="11.5" opacity="0.5" />
      <line x1="5" y1="14" x2="9" y2="14" opacity="0.5" />
      {/* Page content lines right */}
      <line x1="15" y1="9" x2="19" y2="9" opacity="0.5" />
      <line x1="14" y1="11.5" x2="18" y2="11.5" opacity="0.5" />
      <line x1="15" y1="14" x2="19" y2="14" opacity="0.5" />
    </svg>
  );
}

// ─── Water Drop Icon (Wudu Azkar) ───
export function WaterDropIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Main water drop */}
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      {/* Drop highlight */}
      <path d="M12 6.5v5" opacity="0.4" />
      {/* Ripple lines */}
      <path d="M5 20c-0.5-0.3-1-0.8-1-1.5" opacity="0.3" />
      <path d="M19 20c0.5-0.3 1-0.8 1-1.5" opacity="0.3" />
      {/* Small secondary drop */}
      <path d="M18 10l1.5 1.5a2.5 2.5 0 1 1-3.5 0z" opacity="0.3" />
    </svg>
  );
}

// ─── Food Icon (Eating Azkar) ───
export function FoodIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Plate / bowl arc */}
      <path d="M3 14h18" />
      <path d="M4 14c0 3.3 3.6 6 8 6s8-2.7 8-6" />
      {/* Date / olive shapes on plate */}
      <ellipse cx="9" cy="11" rx="1.5" ry="2.2" />
      <ellipse cx="12" cy="10.5" rx="1.5" ry="2.2" />
      <ellipse cx="15" cy="11" rx="1.5" ry="2.2" />
      {/* Steam wisps */}
      <path d="M8 6c0.5-1 0-2 0.5-3" opacity="0.5" />
      <path d="M12 5c0.5-1 0-2 0.5-3" opacity="0.5" />
      <path d="M16 6c0.5-1 0-2 0.5-3" opacity="0.5" />
    </svg>
  );
}

// ─── Crescent Icon (Islamic Symbol) ───
export function CrescentIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Crescent moon - clean arc */}
      <path d="M20.35 12.35A8 8 0 1 1 12 4a6 6 0 0 0 8.35 8.35z" />
      {/* Star to the right of crescent */}
      <path d="M18 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Check Icon ───
export function CheckIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-5" />
    </svg>
  );
}

// ─── Celebration Icon ───
export function CelebrationIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Central star burst */}
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" />
      {/* Radiating lines */}
      <line x1="12" y1="17" x2="12" y2="22" />
      <line x1="4.5" y1="5" x2="2" y2="3" />
      <line x1="19.5" y1="5" x2="22" y2="3" />
      <line x1="3" y1="13" x2="1" y2="14" />
      <line x1="21" y1="13" x2="23" y2="14" />
      <line x1="7" y1="18" x2="5.5" y2="20" />
      <line x1="17" y1="18" x2="18.5" y2="20" />
      {/* Small dots / confetti */}
      <circle cx="4" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="20" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="9" cy="20" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="20" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Lightbulb Icon (Benefits) ───
export function LightbulbIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Bulb top */}
      <path d="M9 21h6" />
      <path d="M9 18h6" />
      {/* Bulb body */}
      <path d="M10 14.5a5 5 0 1 1 4 0c-.5 1-1 2-1 3.5h-2c0-1.5-.5-2.5-1-3.5z" />
      {/* Filament rays */}
      <line x1="12" y1="2" x2="12" y2="4" opacity="0.5" />
      <line x1="4.5" y1="6.5" x2="6" y2="8" opacity="0.5" />
      <line x1="19.5" y1="6.5" x2="18" y2="8" opacity="0.5" />
      <line x1="3" y1="12" x2="5" y2="12" opacity="0.5" />
      <line x1="19" y1="12" x2="21" y2="12" opacity="0.5" />
    </svg>
  );
}

// ─── Calendar Icon ───
export function CalendarIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Calendar body */}
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      {/* Top bar */}
      <line x1="3" y1="9" x2="21" y2="9" />
      {/* Hanging pins */}
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      {/* Date grid dots */}
      <circle cx="8" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
