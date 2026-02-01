'use client';

import GuestModeNotice from '../common/GuestModeNotice';
import Image from 'next/image';
import Link from 'next/link';
import ProfilePanelTrigger from '../common/ProfilePanelTrigger';
import { useAuth } from '@/providers/AuthProvider';

function HeaderRightSkeleton() {
  return <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />;
}

const Header = () => {
  const { profile, isLoading } = useAuth();
  const isGuest = !!profile?.is_guest;

  return (
    <header className="bg-background fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b p-2">
      <h1 className="shrink-0 px-2 pt-1">
        <Link href="/">
          <Image
            src="/logo_text.svg"
            alt="Spenny"
            width={160}
            height={80}
            draggable="false"
            className="h-auto w-32 md:w-40"
            priority
          />
        </Link>
      </h1>
      {isLoading ? (
        <HeaderRightSkeleton />
      ) : isGuest ? (
        <GuestModeNotice />
      ) : (
        <ProfilePanelTrigger />
      )}
    </header>
  );
};

export default Header;
