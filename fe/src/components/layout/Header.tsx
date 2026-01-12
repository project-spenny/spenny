'use client';

import GuestModeNotice from '../common/GuestModeNotice';
import Image from 'next/image';
import Link from 'next/link';
import ModeToggle from '../common/ModeToggle';
import { Profile } from '@/schemas/profile';
import ProfilePanelTrigger from '../common/ProfilePanelTrigger';
import { useQuery } from '@tanstack/react-query';

async function fetchProfile(): Promise<Profile> {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}

const Header = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
  });

  const isGuest = !!profile?.is_guest;

  return (
    <header className="bg-background fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b p-2">
      <h1 className="shrink-0 px-2 pt-1">
        <Link href="/">
          <Image
            src="/logo_horizontal.svg"
            alt="Spenny"
            width={180}
            height={80}
            draggable="false"
            className="h-auto w-36 md:w-[180px]"
            priority
          />
        </Link>
      </h1>
      <ModeToggle />
      {isGuest ? <GuestModeNotice /> : <ProfilePanelTrigger />}
    </header>
  );
};

export default Header;
