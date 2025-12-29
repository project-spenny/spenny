'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import ProfileForm from '@/components/onboarding/ProfileForm';
import { OnboardingProfileValues } from '@/schemas/profile';

import IntroPanel from '@/components/onboarding/IntroPanel';
import { INTRO_STEPS } from '@/constants/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<'form' | 'intro'>('form');
  const [introStep, setIntroStep] = useState(0);

  const [serverError, setServerError] = useState<string | null>(null);

  const exitOnboarding = () => {
    router.replace('/');
  };

  const handleProfileSubmit = async (values: OnboardingProfileValues) => {
    setServerError(null); // 서버 에러 상태 초기화

    // 서버에 프로필 정보 저장
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      setServerError('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 온보딩 소개 단계로 전환
    setIntroStep(0);
    setPhase('intro');
  };

  // 온보딩 단계 이동 함수
  const goPrev = () => setIntroStep((s) => Math.max(0, s - 1));
  const goNext = () =>
    setIntroStep((s) => Math.min(INTRO_STEPS.length - 1, s + 1));

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 클릭 방지 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-lg md:max-w-3xl">
          <Card>
            <CardHeader className="relative space-y-2">
              {phase === 'form' ? (
                <>
                  <CardTitle className="text-xl">기본 정보 설정</CardTitle>
                  <CardDescription>
                    서비스를 시작하기 위해 필수 정보만 먼저 입력해주세요.
                  </CardDescription>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute -top-3 right-2"
                    onClick={exitOnboarding}
                  >
                    건너뛰기
                  </Button>
                  <CardTitle className="text-xl">
                    {INTRO_STEPS[introStep].title}
                  </CardTitle>
                  <CardDescription>
                    {INTRO_STEPS[introStep].description}
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent>
              {phase === 'form' && serverError && (
                <p className="mb-4 text-sm text-red-500">{serverError}</p>
              )}

              {phase === 'form' ? (
                <ProfileForm
                  defaultValues={{
                    nickname: '',
                    birth_date: '',
                    gender: 'male',
                  }}
                  onSubmit={handleProfileSubmit}
                />
              ) : (
                <IntroPanel
                  steps={INTRO_STEPS}
                  introStep={introStep}
                  onPrev={goPrev}
                  onNext={goNext}
                  onExit={exitOnboarding}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
