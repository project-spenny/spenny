'use client';

import AnimatedLogo from '@/components/login/AnimatedLogo';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Provider = 'google' | 'kakao';
type LoadingAction = 'google' | 'kakao' | 'guest' | null;

export default function LoginPage() {
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

  return (
    <div className="bg-brand min-h-screen w-full overflow-hidden lg:flex">
      {/* 브랜드 섹션 */}
      <div className="px-6 pt-14 pb-10 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:p-16">
        <h1 className="text-4xl leading-tight font-extrabold tracking-tighter text-white lg:text-6xl lg:leading-[1.05]">
          어제보다 더 나은 <br />
          <span className="text-brand-soft">소비 생활</span>
        </h1>

        <div className="text-brand-subtle mt-5 text-base lg:mt-8 lg:text-xl">
          <span className="mb-2 flex items-center">
            <Image
              src="/logo_text.svg"
              alt="SPENNY"
              width={120}
              height={225}
              priority
              className="mr-2 lg:w-38"
            />
            와 함께
          </span>
          똑똑한 자산 관리 습관을 만들어보세요.
        </div>
      </div>

      <AnimatedLogo />
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => signInWithProvider('google')}
          disabled={isLoading}
          className="relative flex h-11 w-75 cursor-pointer items-center justify-center rounded-sm border disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src="/google_logo.svg"
            alt="Google"
            width={20}
            height={20}
            className="absolute left-3"
          />
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span>{loadingAction === 'google' && <Spinner />}</span>
            구글로 시작하기
          </span>
        </button>
        <button
          type="button"
          onClick={() => signInWithProvider('kakao')}
          disabled={isLoading}
          className="relative flex h-11 w-75 cursor-pointer items-center justify-center rounded-sm bg-[#FEE500] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src="/kakao_symbol.svg"
            alt="Kakao"
            width={20}
            height={20}
            className="absolute left-3"
          />
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span>{loadingAction === 'kakao' && <Spinner />}</span>
            카카오로 시작하기
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
          className="flex h-11 w-75 items-center justify-center rounded-sm border text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <span>{loadingAction === 'guest' && <Spinner />}</span>
            체험해보기
          </span>
        </button>

        <p className="mt-1 text-xs text-gray-400">
          회원가입 없이 데모 계정으로 서비스를 체험할 수 있어요.
        </p>
      </div>
    </div>
  );
}
