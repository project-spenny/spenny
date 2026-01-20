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
import { toast } from 'sonner';
import ProfileForm from '@/components/onboarding/ProfileForm';
import { OnboardingProfileValues } from '@/schemas/profile';
import { useAuth } from '@/providers/AuthProvider';

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

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

    toast.success('기본 정보가 저장되었어요');

    // 전역 Auth 상태(profile) 동기화
    await refresh();

    // 온보딩 소개 단계로 전환
    router.replace('/onboarding/intro');
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 클릭 방지 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-lg md:max-w-3xl">
          <Card className="max-h-[90dvh] overflow-hidden">
            <CardHeader className="relative space-y-2">
              <CardTitle className="text-xl">기본 정보 설정</CardTitle>
              <CardDescription>
                서비스를 시작하기 위해 필수 정보만 먼저 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[70dvh] overflow-y-auto">
              {serverError && (
                <p className="mb-4 text-sm text-red-500">{serverError}</p>
              )}
              <ProfileForm
                defaultValues={{
                  nickname: '',
                  birth_date: '',
                  gender: 'male',
                }}
                onSubmit={handleProfileSubmit}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
