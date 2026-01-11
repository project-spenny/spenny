import './globals.css';

import type { Metadata } from 'next';
import { Providers } from './provider';

export const metadata: Metadata = {
  title: 'SPENNY',
  description: '하루 지출을 기록하고 소비 흐름을 한눈에 관리하는 가계부 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
