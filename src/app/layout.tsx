import type { Metadata, Viewport } from "next";
import { Amiri, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0D3B2E" },
    { media: "(prefers-color-scheme: dark)", color: "#0D3B2E" },
  ],
};

export const metadata: Metadata = {
  title: "أذكار المسلم - حصّن نفسك بذكر الله",
  description: "تطبيق الأذكار والأدعية - حصّن نفسك بذكر الله. يشمل أذكار الصباح والمساء والنوم وبعد الصلاة وأدعية قرآنية والمزيد.",
  keywords: ["أذكار", "أدعية", "إسلام", "تسبيح", "ذكر", "مسلم", "قرآن"],
  authors: [{ name: "أذكار المسلم" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "أذكار المسلم",
    description: "حصّن نفسك بذكر الله - تطبيق الأذكار والأدعية",
    type: "website",
    locale: "ar_SA",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "أذكار المسلم",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="أذكار المسلم" />
        <meta name="description" content="تطبيق الأذكار والأدعية - حصّن نفسك بذكر الله" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#0D3B2E" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${amiri.variable} ${notoKufi.variable} antialiased bg-background text-foreground font-[family-name:var(--font-noto-kufi)]`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
