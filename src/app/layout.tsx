import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "스티커 메모",
  description: "간단한 메모 앱 - 로컬에 저장되는 스티커 메모",
};

const themeScript = `
(function(){
  var k='sticker-memo-app-theme';
  var s=localStorage.getItem(k);
  var d=window.matchMedia('(prefers-color-scheme:dark)').matches;
  if(s==='dark'||(s!=='light'&&d)) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
