'use client';

import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SocialButton from './SocialButton';
import { Spinner } from '../ui/spinner';

type Provider = 'google' | 'kakao';
type LoadingAction = 'google' | 'kakao' | 'guest' | null;

export default function LoginActions() {
  const router = useRouter();
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

      router.replace('/');
      router.refresh();
    } finally {
      setLoadingAction(null);
    }
  };

  // 페이지 복원 시 로딩 상태 초기화
  useEffect(() => {
    const reset = () => setLoadingAction(null);
    window.addEventListener('pageshow', reset);
    window.addEventListener('popstate', reset);
    return () => {
      window.removeEventListener('pageshow', reset);
      window.removeEventListener('popstate', reset);
    };
  }, []);

  return (
    <>
      {/* 소셜 로그인 */}
      <div className="space-y-3">
        <SocialButton
          label="구글로 시작하기"
          icon="/google_logo.svg"
          onClick={() => signInWithProvider('google')}
          isLoading={loadingAction === 'google'}
          disabled={isLoading}
          className="border-slate-200 bg-white hover:bg-slate-100"
        />
        <SocialButton
          label="카카오톡로 시작하기"
          icon="/kakao_symbol.svg"
          onClick={() => signInWithProvider('kakao')}
          isLoading={loadingAction === 'kakao'}
          disabled={isLoading}
          className="border-none bg-[#FEE500] hover:bg-[#F4DC00]"
        />
      </div>

      {/* 구분선 */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="absolute w-full border-t border-slate-200"></div>
        <span className="relative bg-white px-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          OR
        </span>
      </div>

      {/* 게스트 로그인 */}
      <div className="space-y-1">
        <button
          onClick={signInAsGuest}
          disabled={isLoading}
          className="bg-brand-subtle text-brand-strong hover:bg-brand-soft/30 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {loadingAction === 'guest' && <Spinner />}
          <span className="ml-2">서비스 둘러보기</span>
        </button>
        <p className="text-center text-xs leading-relaxed text-gray-400">
          체험 계정은 읽기 전용 모드입니다.
        </p>
      </div>
    </>
  );
}
