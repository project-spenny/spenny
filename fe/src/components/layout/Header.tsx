'use client';

import { Profile } from '@/schemas/profile';
import ModeToggle from '../common/ModeToggle';
import ProfilePanelTrigger from '../common/ProfilePanelTrigger';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { Button } from '../ui/button';

async function fetchProfile(): Promise<Profile> {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}

const Header = () => {
  const router = useRouter();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
  });

  const isGuest = !!profile?.is_guest;

  const handleExitGuestMode = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <header className="bg-secondary fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b p-2">
      <h1 className="px-4 text-2xl font-bold">Spenny</h1>
      <ModeToggle />
      {isGuest ? (
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-600 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500" />
          </span>

          <div className="flex flex-col leading-tight">
            <span>체험 모드에서는 조회만 가능하며,</span>
            <span>로그인하면 전체 기능을 사용할 수 있어요.</span>
          </div>

          <Button size="sm" variant="outline" onClick={handleExitGuestMode}>
            체험 모드 종료
          </Button>
        </div>
      ) : (
        <ProfilePanelTrigger />
      )}
    </header>
  );
};

export default Header;
