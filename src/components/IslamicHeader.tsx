'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-header relative overflow-hidden rounded-3xl p-6 text-white"
    >
      {/* Islamic geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
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

      {/* Decorative shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A356]/40 to-transparent" />

      {/* Decorative corners */}
      <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-[#C5A356]/25 rounded-tl-lg" />
      <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-[#C5A356]/25 rounded-br-lg" />

      <div className="relative z-10">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A356]/15 backdrop-blur-sm flex items-center justify-center text-2xl border border-[#C5A356]/20">
            ☪
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-gradient-gold"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              أذكار المسلم
            </h1>
            <p
              className="text-sm text-[#C5A356]/80"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              حصّن نفسك بذكر الله
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-xs text-[#E8D5A3]/70" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
            {hijriDate}
          </p>
          <p className="text-xs text-white/40" style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}>
            {gregDate}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
