'use client';

import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function GuestModeNotice() {
  const router = useRouter();

  const handleExitGuestMode = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
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
  );
}
