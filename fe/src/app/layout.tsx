import './globals.css';

import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { Providers } from './provider';

export const metadata: Metadata = {
  title: 'SPENNY',
  description: '하루 지출을 기록하고 소비 흐름을 한눈에 관리하는 가계부 서비스',
};

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920', // 가변 폰트 굵기 범위
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={pretendard.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
