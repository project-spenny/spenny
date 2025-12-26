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
import IntroPanel from '@/components/onboarding/IntroPanel';
import { FormErrors, Gender } from '@/types/onboarding';
import { INTRO_STEPS } from '@/constants/onboarding';

export default function OnboardingPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<'form' | 'intro'>('form');
  const [introStep, setIntroStep] = useState(0);

  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exitOnboarding = () => {
    router.replace('/');
  };

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

  // 온보딩 단계 이동 함수
  const goPrev = () => setIntroStep((s) => Math.max(0, s - 1));
  const goNext = () =>
    setIntroStep((s) => Math.min(INTRO_STEPS.length - 1, s + 1));

  // 입력값 변경 핸들러
  const handleChangeNickname = (v: string) => {
    setNickname(v);
    clearError('nickname');
  };
  const handleChangeBirthDate = (v: string) => {
    setBirthDate(v);
    clearError('birth_date');
  };
  const handleChangeGender = (v: Gender) => {
    setGender(v);
    clearError('gender');
  };

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
              {phase === 'form' ? (
                <ProfileForm
                  nickname={nickname}
                  birthDate={birthDate}
                  gender={gender}
                  errors={errors}
                  onChangeNickname={handleChangeNickname}
                  onChangeBirthDate={handleChangeBirthDate}
                  onChangeGender={handleChangeGender}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
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
