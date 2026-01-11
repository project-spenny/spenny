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
    <header className="bg-secondary fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b p-2">
      <h1 className="px-2">
        <Link href="/" className="block">
          <Image
            src="/logo_horizontal.svg"
            alt="Spenny"
            width={200}
            height={100}
          />
        </Link>
      </h1>
      <ModeToggle />
      {isGuest ? <GuestModeNotice /> : <ProfilePanelTrigger />}
    </header>
  );
};

export default Header;
