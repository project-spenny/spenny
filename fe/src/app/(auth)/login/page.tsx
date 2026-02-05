import Image from 'next/image';
import { Sparkles, PieChart, CalendarDays } from 'lucide-react';
import FeatureItem from '@/components/login/FeatureItem';
import LoginActions from '@/components/login/LoginActions';

export default function LoginPage() {
  return (
    <div className="bg-brand flex min-h-dvh w-full flex-col lg:flex-row">
      {/* 브랜드 섹션 */}
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center lg:flex-1 lg:items-start lg:p-16 lg:text-left">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tighter text-white lg:text-6xl">
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
              src="/logo_pig.svg"
              alt="logo"
              width={150}
              height={200}
              priority
              className="lg:w-65"
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
          <LoginActions />
        </div>
      </div>
    </div>
  );
}
