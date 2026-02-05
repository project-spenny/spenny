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
    <div className="text-xs">
      <Button size="sm" variant="outline" onClick={handleExitGuestMode}>
        체험 모드 종료
      </Button>
    </div>
  );
}
