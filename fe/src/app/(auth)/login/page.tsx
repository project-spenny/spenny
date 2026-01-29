'use client';

import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, PieChart, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="bg-brand flex h-screen w-full flex-col overflow-hidden lg:flex-row">
      {/* 브랜드 섹션 */}
      <div className="flex flex-col items-center px-6 py-10 lg:flex-1 lg:items-start lg:justify-center lg:p-16">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tighter text-white lg:text-6xl">
          어제보다 더 나은
          <br className="hidden lg:block" />
          <span className="text-brand-soft ml-2 text-4xl lg:ml-0 lg:text-6xl">
            소비 생활
          </span>
        </h1>

        <div className="text-brand-subtle mt-2 flex flex-col items-center text-sm lg:mt-8 lg:items-start lg:text-xl">
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

        {/* 기능 소개 (데스크탑 전용) */}
        <div className="mt-15 hidden space-y-6 border-l-2 border-white/15 pl-6 lg:block">
          <FeatureItem
            icon={<CalendarDays className="h-5 w-5" />}
            title="직접 기록하는 수입과 지출"
            desc="최소한의 입력으로 매일 기록해요"
          />
          <FeatureItem
            icon={<Sparkles className="h-5 w-5" />}
            title="데이터 기반의 소비 패턴 분석"
            desc="패턴을 분석해 오늘 사용 가능한 권장 금액을 제안해요"
          />
          <FeatureItem
            icon={<PieChart className="h-5 w-5" />}
            title="세분화된 예산 설정과 관리"
            desc="나에게 딱 맞는 예산을 설정하고 습관을 만들어요"
          />
        </div>
      </div>

      {/* 로그인 섹션 */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-t-[40px] bg-white p-6 lg:flex-[0.8] lg:rounded-t-none lg:rounded-l-[40px]">
        <div className="flex h-full w-full max-w-[340px] flex-col justify-center">
          <div className="mb-3 flex justify-center lg:mb-10">
            <Image
              src="/logo_vertical.svg"
              alt="logo"
              width={180}
              height={200}
              priority
              className="lg:w-75"
            />
          </div>
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="text-brand-strong text-xl font-extrabold tracking-tight lg:text-3xl">
              환영합니다
            </h2>
            <p className="mt-1 text-xs text-slate-500 lg:text-sm">
              간편 로그인으로 서비스를 시작하세요.
            </p>
          </div>

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
        </div>
      </div>
    </div>
  );
}

// 소셜 로그인 버튼
function SocialButton({
  label,
  icon,
  onClick,
  isLoading,
  disabled,
  className,
}: {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  icon: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold text-black disabled:opacity-50',
        className
      )}
    >
      <Image
        src={icon}
        alt={label}
        width={20}
        height={20}
        className="absolute left-5"
      />
      {isLoading && <Spinner />}
      <span className="ml-2">{label}</span>
    </button>
  );
}

// 기능 소개 아이템
function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 text-white">
      <div className="text-brand-subtle flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
        {icon}
      </div>
      <div>
        <h4 className="flex items-center gap-2 font-bold text-white">
          {title}
        </h4>
        <p className="text-brand-subtle mt-0.5 text-sm opacity-80">{desc}</p>
      </div>
    </div>
  );
}
