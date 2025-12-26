'use client';

import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border px-4 py-2 hover:bg-gray-100"
    >
      로그아웃
    </button>
  );
}
