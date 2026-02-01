'use client';

import { BarChart3, Home, Repeat, Wallet } from 'lucide-react';

import NavItem from '@/components/common/NavItem';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { label: '홈', href: '/', icon: Home },
    { label: '고정비', href: '/fixed-costs', icon: Repeat },
    { label: '분석', href: '/analysis', icon: BarChart3 },
    { label: '예산', href: '/budget', icon: Wallet },
  ];

  return (
    <nav
      className={cn(
        'bg-background fixed z-50 border px-2 py-2 shadow-xl backdrop-blur-lg',
        'bottom-0 w-full rounded-t-2xl',
        'md:top-1/2 md:left-0 md:h-fit md:w-24 md:-translate-y-1/2 md:rounded-t-none md:rounded-r-2xl md:py-4'
      )}
    >
      <div className="flex h-14 items-center justify-center gap-2 md:h-auto md:flex-col md:gap-4">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            itemIcon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
