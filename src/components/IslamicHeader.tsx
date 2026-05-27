'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CrescentIcon, CalendarIcon } from './Icons';

function getHijriDate() {
  try {
    const now = new Date();
    const intl = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return intl.format(now);
  } catch {
    return '';
  }
}

function getGregorianDate() {
  const now = new Date();
  const intl = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return intl.format(now);
}

export function IslamicHeader() {
  const hijriDate = useMemo(() => getHijriDate(), []);
  const gregDate = useMemo(() => getGregorianDate(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="neo-glass relative overflow-hidden rounded-3xl p-6"
    >
      {/* Inner content wrapper */}
      <div className="relative z-10 rounded-[calc(1.5rem-2px)] overflow-hidden bg-gradient-to-br from-[#0D3B2E]/[0.93] via-[#1A5C42]/[0.90] to-[#0D3B2E]/[0.93] dark:from-[#060b14]/[0.95] dark:via-[#0D3B2E]/[0.88] dark:to-[#060b14]/[0.95]">
        {/* Bismillah watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] text-[120px] leading-none select-none pointer-events-none"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          بسم الله
        </div>

        {/* Islamic geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(197, 163, 86, 0.4) 20px,
                rgba(197, 163, 86, 0.4) 21px
              ),
              repeating-linear-gradient(
                60deg,
                transparent,
                transparent 20px,
                rgba(197, 163, 86, 0.4) 20px,
                rgba(197, 163, 86, 0.4) 21px
              ),
              repeating-linear-gradient(
                120deg,
                transparent,
                transparent 20px,
                rgba(197, 163, 86, 0.4) 20px,
                rgba(197, 163, 86, 0.4) 21px
              )
            `,
          }}
        />

        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A356]/50 to-transparent" />

        {/* Bottom shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A356]/30 to-transparent" />

        {/* Dramatic corner decorations */}
        <div className="absolute top-3 left-3 w-14 h-14 border-t-2 border-l-2 border-[#C5A356]/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-14 h-14 border-t-2 border-r-2 border-[#C5A356]/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-14 h-14 border-b-2 border-l-2 border-[#C5A356]/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-14 h-14 border-b-2 border-r-2 border-[#C5A356]/30 rounded-br-lg" />

        <div className="relative z-10 p-1">
          {/* Logo + Title */}
          <div className="flex items-center gap-4 mb-3">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 15px rgba(197,163,86,0.2), 0 0 30px rgba(197,163,86,0.1)',
                  '0 0 25px rgba(197,163,86,0.35), 0 0 50px rgba(197,163,86,0.15)',
                  '0 0 15px rgba(197,163,86,0.2), 0 0 30px rgba(197,163,86,0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-[#C5A356]/15 backdrop-blur-sm flex items-center justify-center text-3xl border border-[#C5A356]/25"
            >
              <CrescentIcon className="w-7 h-7 text-[#E8D5A3]" />
            </motion.div>
            <div>
              <h1
                className="text-3xl font-bold text-gradient-animate leading-tight"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                أذكار المسلم
              </h1>
              <p
                className="text-sm text-[#C5A356]/80 mt-0.5"
                style={{ fontFamily: "'Amiri', serif" }}
              >
                حصّن نفسك بذكر الله
              </p>
            </div>
          </div>

          {/* Dates in glass pill badges */}
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex self-start">
              <div className="glass-pill text-xs text-[#E8D5A3]/80 border-[#C5A356]/15">
                <CalendarIcon className="w-3 h-3 text-[#E8D5A3]/80 inline ml-1" /> {hijriDate}
              </div>
            </div>
            <p className="text-[11px] text-white/35" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
              {gregDate}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
