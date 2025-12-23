'use client';

import NavItem from '../common/NavItem';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname(); // 현재 경로 가져오기
  const navItems = [
    { label: '홈', href: '/' },
    { label: '내역', href: '/history' },
    { label: '분석', href: '/analysis' },
    { label: '고정비', href: '/fixed-costs' },
    { label: '마이페이지', href: '/mypage' },
  ];

  return (
    <nav className="sticky top-16 w-full border-b p-2 md:fixed md:h-full md:w-28 md:border-r">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm md:flex-col">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
