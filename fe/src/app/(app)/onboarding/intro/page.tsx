'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IntroPanel from '@/components/onboarding/IntroPanel';
import { INTRO_STEPS } from '@/constants/onboarding';

const INTRO_STEP_KEY = 'spenny:introStep';

export default function OnboardingIntroPage() {
  const [introStep, setIntroStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(INTRO_STEP_KEY);
    if (!raw) return;

    const saved = Number(raw);
    if (Number.isNaN(saved)) return;

    const safeStep = Math.min(Math.max(0, saved), INTRO_STEPS.length - 1);

    setIntroStep(safeStep);
  }, []);

  useEffect(() => {
    localStorage.setItem(INTRO_STEP_KEY, String(introStep));
  }, [introStep]);

  const clearStep = () => {
    localStorage.removeItem(INTRO_STEP_KEY);
  };

  const exit = () => {
    if (isExiting) return;
    setIsExiting(true);
    clearStep();
    window.location.replace('/');
  };

  // 온보딩 단계 이동 함수
  const goPrev = () => setIntroStep((s) => Math.max(0, s - 1));
  const goNext = () =>
    setIntroStep((s) => Math.min(INTRO_STEPS.length - 1, s + 1));

  const isLastIntro = introStep === INTRO_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-lg md:max-w-3xl">
          <Card className="max-h-[90dvh] overflow-hidden">
            <CardHeader className="relative space-y-2">
              {!isLastIntro && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isExiting}
                  className="absolute -top-3 right-2"
                  onClick={exit}
                >
                  건너뛰기
                </Button>
              )}
              <CardTitle className="text-xl">
                {INTRO_STEPS[introStep].title}
              </CardTitle>
              <CardDescription>
                {INTRO_STEPS[introStep].description}
              </CardDescription>
            </CardHeader>

            <CardContent className="max-h-[70dvh] overflow-y-auto">
              <IntroPanel
                steps={INTRO_STEPS}
                introStep={introStep}
                isLastIntro={isLastIntro}
                isExiting={isExiting}
                onPrev={goPrev}
                onNext={goNext}
                onExit={exit}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
