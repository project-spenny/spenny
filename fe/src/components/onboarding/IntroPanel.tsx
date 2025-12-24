'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type IntroStep = {
  title: string;
  description: string;
};

type IntroPanelProps = {
  steps: readonly IntroStep[];
  introStep: number;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
};

export default function IntroPanel({
  steps,
  introStep,
  onPrev,
  onNext,
  onExit,
}: IntroPanelProps) {
  const isLastIntro = introStep === steps.length - 1;

  return (
    <div className="space-y-6">
      <div className="h-100">설명 내용</div>
      {/* 하단 컨트롤 */}
      <div className="grid grid-cols-3 items-center">
        {/* 왼쪽 */}
        <div className="justify-self-start">
          <Button
            type="button"
            variant="outline"
            disabled={introStep === 0}
            onClick={onPrev}
          >
            이전
          </Button>
        </div>

        {/* 중앙 */}
        <div className="justify-self-center">
          <div
            className="flex items-center justify-center gap-2"
            aria-label="온보딩 진행 상태"
          >
            {steps.map((_, index) => {
              const active = introStep === index;
              return (
                <span
                  key={index}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    active ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="justify-self-end">
          {isLastIntro ? (
            <Button type="button" onClick={onExit}>
              시작하기
            </Button>
          ) : (
            <Button type="button" onClick={onNext}>
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
