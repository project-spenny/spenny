import './globals.css';

import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { Providers } from './provider';

export const metadata: Metadata = {
  title: 'SPENNY',
  description: '하루 지출을 기록하고 소비 흐름을 한눈에 관리하는 가계부 서비스',
  metadataBase: new URL('https://project-spenny.vercel.app'),

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SPENNY',
    title: '어제보다 더 나은 소비 생활, SPENNY',
    description:
      '하루 지출을 기록하고 소비 흐름을 한눈에 관리하는 가계부 서비스',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
  },
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
