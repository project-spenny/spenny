'use client';

import { useEffect, useState } from 'react';

interface ResponsiveWrapperProps {
  mobile: React.ReactNode; // 모바일용 컴포넌트
  desktop: React.ReactNode; // 데스크탑용 컴포넌트
}

const ResponsiveWrapper = ({ mobile, desktop }: ResponsiveWrapperProps) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // 브라우저 크기 체크

    checkMobile(); // 초기 실행
    window.addEventListener('resize', checkMobile); // 창 크기 바뀔 때마다 체크

    // 메모리 누수 방지
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 하이드레이션 오류 방지
  if (isMobile === null) return null;

  return isMobile ? mobile : desktop;
};

export default ResponsiveWrapper;
