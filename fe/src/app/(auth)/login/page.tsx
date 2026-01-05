'use client';

import { supabase } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Provider = 'google' | 'kakao';

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // OAuth 로그인 처리 함수
  const signInWithProvider = async (provider: Provider) => {
    if (isLoading) return; // 중복 클릭 방지
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 게스트 로그인 처리 함수
  const signInAsGuest = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
      const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;

      if (!email || !password) {
        toast.error('현재 게스트 로그인을 사용할 수 없습니다.');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      queryClient.removeQueries({ queryKey: ['profile'] });

      router.replace('/');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => signInWithProvider('google')}
        disabled={isLoading}
        className="relative flex h-[45px] w-[300px] cursor-pointer items-center justify-center rounded-sm border disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Image
          src="/google_logo.svg"
          alt="Google"
          width={20}
          height={20}
          className="absolute left-3"
        />
        <span>구글로 시작하기</span>
      </button>
      <button
        type="button"
        onClick={() => signInWithProvider('kakao')}
        disabled={isLoading}
        className="relative flex h-[45px] w-[300px] cursor-pointer items-center justify-center rounded-sm bg-[#FEE500] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Image
          src="/kakao_symbol.svg"
          alt="Kakao"
          width={20}
          height={20}
          className="absolute left-3"
        />
        <span>카카오로 시작하기</span>
      </button>
      <button
        type="button"
        onClick={signInAsGuest}
        disabled={isLoading}
        className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        게스트로 둘러보기
      </button>
    </div>
  );
}
