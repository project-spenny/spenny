'use client';

import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    queryClient.removeQueries({ queryKey: ['profile'] });
    router.replace('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
    router.refresh();
  };

  return (
    <Button type="button" onClick={handleLogout} variant="destructive">
      로그아웃
    </Button>
  );
}
