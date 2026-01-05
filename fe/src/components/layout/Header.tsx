'use client';

import { Profile } from '@/schemas/profile';
import ModeToggle from '../common/ModeToggle';
import ProfilePanelTrigger from '../common/ProfilePanelTrigger';
import { useQuery } from '@tanstack/react-query';
import GuestModeNotice from '../common/GuestModeNotice';

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
      <h1 className="px-4 text-2xl font-bold">Spenny</h1>
      <ModeToggle />
      {isGuest ? <GuestModeNotice /> : <ProfilePanelTrigger />}
    </header>
  );
};

export default Header;
