'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fi } from 'zod/v4/locales';

type Gender = 'male' | 'female' | 'none';
type FormErrors = Partial<{
  nickname: string;
  birth_date: string;
  gender: string;
}>;

export default function OnboardingPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<'form' | 'intro'>('form');
  const [introStep, setIntroStep] = useState(0);

  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('none');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 온보딩 설명 단계 내용
  const introSteps = [
    {
      title: 'spendy와 함께 소비 관리',
      description: '간편한 소비 기록과 분석으로 현명한 소비 습관을 길러보세요.',
    },
    {
      title: '캘린더로 빠르게 기록',
      description: '날짜를 선택해서 거래를 바로 기록하고 확인할 수 있습니다.',
    },
    {
      title: '전체 거래 내역 확인',
      description: '모든 거래 내역을 한눈에 확인할 수 있습니다.',
    },
    {
      title: '월간 분석으로 소비 점검',
      description: '카테고리/월별 흐름을 보고 과소비를 확인할 수 있습니다.',
    },
  ] as const;
  const isLastIntro = introStep === introSteps.length - 1;

  const clearError = (key: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const isValidBirthDate = (v: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return false;
    return d.toISOString().slice(0, 10) === v;
  };

  // 제출 전 검증
  const validate = () => {
    const next: FormErrors = {};

    if (!nickname.trim()) next.nickname = '닉네임을 입력해주세요.';

    if (!birthDate.trim()) next.birth_date = '생년월일을 입력해주세요.';
    else if (!isValidBirthDate(birthDate.trim()))
      next.birth_date = 'YYYY-MM-DD 형식으로 입력해주세요.';
    if (gender === 'none') next.gender = '성별을 선택해주세요.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // 서버에 프로필 정보 저장
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          birth_date: birthDate,
          gender,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        return;
      }

      // 온보딩 소개 단계로 전환
      setIntroStep(0);
      setPhase('intro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goPrev = () => setIntroStep((s) => Math.max(0, s - 1));
  const goNext = () =>
    setIntroStep((s) => Math.min(introSteps.length - 1, s + 1));
  const finishOnboarding = () => router.replace('/');

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
                    onClick={finishOnboarding}
                  >
                    건너뛰기
                  </Button>
                  <CardTitle className="text-xl">
                    {introSteps[introStep].title}
                  </CardTitle>
                  <CardDescription>
                    {introSteps[introStep].description}
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent>
              {phase === 'form' ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input
                      id="nickname"
                      placeholder="닉네임을 입력해주세요."
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        clearError('nickname');
                      }}
                    />
                    {errors.nickname ? (
                      <p className="text-sm text-red-500">{errors.nickname}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth">생년월일</Label>
                    <Input
                      id="birth"
                      placeholder="YYYY-MM-DD"
                      value={birthDate}
                      onChange={(e) => {
                        setBirthDate(e.target.value);
                        clearError('birth_date');
                      }}
                    />
                    {errors.birth_date ? (
                      <p className="text-sm text-red-500">
                        {errors.birth_date}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-6">
                      <Label>성별</Label>
                      <RadioGroup
                        value={gender}
                        onValueChange={(v) => {
                          setGender(v as Gender);
                          clearError('gender');
                        }}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">남</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">여</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {errors.gender ? (
                      <p className="text-sm text-red-500">{errors.gender}</p>
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    저장
                  </Button>
                </form>
              ) : (
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
                        onClick={goPrev}
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
                        {introSteps.map((_, index) => {
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
                        <Button type="button" onClick={finishOnboarding}>
                          시작하기
                        </Button>
                      ) : (
                        <Button type="button" onClick={goNext}>
                          다음
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
