import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HYPER CHAT 2003 - 最強のAIチャット',
  description: '2003年スタイルの究極AIチャットアプリケーション。レトロだけど最新のAI技術を搭載！',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ff00ff" />
      </head>
      <body>{children}</body>
    </html>
  );
}
