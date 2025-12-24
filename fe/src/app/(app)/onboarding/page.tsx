'use client';
import { useState } from 'react';
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

type Gender = 'male' | 'female' | 'none';
type FormErrors = Partial<{
  nickname: string;
  birth_date: string;
  gender: string;
}>;

export default function OnboardingPage() {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('none');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      console.log('profile 저장 성공');
      console.log('final url:', res.url);
      console.log('content-type:', res.headers.get('content-type'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 클릭 방지 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* 기본 정보 입력 영역 */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">기본 정보 설정</CardTitle>
              <CardDescription>
                서비스를 시작하기 위해 필수 정보만 먼저 입력해주세요.
              </CardDescription>
            </CardHeader>

            <CardContent>
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
                    <p className="text-sm text-red-500">{errors.birth_date}</p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
