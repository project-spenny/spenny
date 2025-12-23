'use client';

import { supabase } from '@/utils/supabase/client';
import { useState } from 'react';

type Provider = 'google' | 'kakao';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  // OAuth 로그인 처리 함수
  const signInWithProvider = async (provider: Provider) => {
    if (isLoading) return; // 중복 클릭 방지
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => signInWithProvider('google')}
        disabled={isLoading}
        className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Google 로그인
      </button>
      <button
        type="button"
        onClick={() => signInWithProvider('kakao')}
        disabled={isLoading}
        className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Kakao 로그인
      </button>
    </div>
  );
}
