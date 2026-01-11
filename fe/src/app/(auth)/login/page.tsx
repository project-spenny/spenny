'use client';

import { supabase } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Provider = 'google' | 'kakao';
type LoadingAction = 'google' | 'kakao' | 'guest' | null;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const isLoading = loadingAction !== null;

  // OAuth 로그인 처리 함수
  const signInWithProvider = async (provider: Provider) => {
    if (isLoading) return; // 중복 클릭 방지
    setLoadingAction(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        setLoadingAction(null);
        return;
      }
    } catch {
      toast.error('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setLoadingAction(null);
    }
  };

  // 게스트 로그인 처리 함수
  const signInAsGuest = async () => {
    if (isLoading) return;
    setLoadingAction('guest');

    try {
      const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
      const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;

      if (!email || !password) {
        toast.error('현재 체험 로그인을 사용할 수 없습니다.');
        setLoadingAction(null);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setLoadingAction(null);
        return;
      }

      queryClient.removeQueries({ queryKey: ['profile'] });

      router.replace('/');
      router.refresh();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Image
        src="/logo_vertical.svg"
        alt="SPENNY logo"
        width={400}
        height={400}
      />

      <div className="flex flex-col gap-4">
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
          <span>
            {loadingAction === 'google' ? '구글 로그인 중…' : '구글로 시작하기'}
          </span>
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
          <span>
            {loadingAction === 'kakao'
              ? '카카오 로그인 중…'
              : '카카오로 시작하기'}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="h-px w-12 bg-gray-200" />
        또는
        <span className="h-px w-12 bg-gray-200" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={signInAsGuest}
          disabled={isLoading}
          className="flex h-[45px] w-[300px] items-center justify-center rounded-sm border text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === 'guest' ? '체험 계정 접속 중…' : '체험해보기'}
        </button>

        <p className="mt-1 text-xs text-gray-400">
          회원가입 없이 데모 계정으로 서비스를 체험할 수 있어요.
        </p>
      </div>
    </div>
  );
}
