'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Spinner } from '../ui/spinner';

type IntroMedia =
  | {
      src: string;
      alt?: string;
    }
  | {
      src: string;
      alt?: string;
      caption?: string;
    };

type IntroStep = {
  title: string;
  description: string;
  media: readonly IntroMedia[];
};

type IntroPanelProps = {
  steps: readonly IntroStep[];
  introStep: number;
  isLastIntro: boolean;
  isExiting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
};

export default function IntroPanel({
  steps,
  introStep,
  isLastIntro,
  isExiting,
  onPrev,
  onNext,
  onExit,
}: IntroPanelProps) {
  const step = steps[introStep];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-hidden">
        {step.media.map((item, index) => (
          <div
            key={`${introStep}-${index}`}
            className="relative h-70 w-full md:h-90"
          >
            <Image
              src={item.src}
              alt={item.alt ?? step.title}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        ))}
      </div>
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
            className="flex items-center justify-center gap-3"
            aria-label="온보딩 진행 상태"
          >
            {steps.map((_, index) => {
              const active = introStep === index;
              return active ? (
                <span
                  key={index}
                  aria-current="step"
                  className="flex items-center"
                >
                  <Image
                    src="/logo_pig.svg"
                    alt="logo pig"
                    width={25}
                    height={25}
                    className="animate-bounce"
                  />
                </span>
              ) : (
                <span
                  key={index}
                  className={cn('h-2 w-2 rounded-full', 'bg-gray-200')}
                />
              );
            })}
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="justify-self-end">
          {isLastIntro ? (
            <Button type="button" onClick={onExit} disabled={isExiting}>
              {isExiting && <Spinner />}
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
