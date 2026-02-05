'use client';

import GuestModeNotice from '../common/GuestModeNotice';
import Image from 'next/image';
import Link from 'next/link';
import ProfilePanelTrigger from '../common/ProfilePanelTrigger';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

function HeaderRightSkeleton() {
  return <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />;
}

const Header = () => {
  const { profile, isLoading } = useAuth();
  const isGuest = !!profile?.is_guest;

  // 오늘 날짜 포맷팅
  const today = new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date());

  return (
    <header
      className={cn(
        'border-border/50 fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b p-2 shadow-[0_1px_12px_rgba(0,0,0,0.03)]',
        'bg-background/80 backdrop-blur-lg',
        'md:px-4'
      )}
    >
      <div className="flex items-center gap-4">
        <h1 className="shrink-0 px-2 pt-1">
          <Link href="/">
            <Image
              src="/logo_text.svg"
              alt="Spenny"
              width={160}
              height={80}
              draggable="false"
              className="h-auto w-32 md:w-36"
              priority
            />
          </Link>
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {!isLoading && !isGuest && profile?.nickname && (
          <div className="hidden flex-col items-end gap-1 md:flex">
            <span className="text-brand text-xs leading-none font-semibold">
              {today}
            </span>
            <span className="text-foreground text-sm leading-none font-bold">
              {profile.nickname}님
            </span>
          </div>
        )}

        {/* 세로 구분선 */}
        {!isLoading && !isGuest && (
          <div className="bg-border hidden h-6 w-px md:block" />
        )}

        <div className="flex items-center">
          {isLoading ? (
            <HeaderRightSkeleton />
          ) : isGuest ? (
            <GuestModeNotice />
          ) : (
            <ProfilePanelTrigger />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
