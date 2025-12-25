'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormErrors, Gender } from '@/types/onboarding';

type ProfileFormProps = {
  nickname: string;
  birthDate: string;
  gender: Gender;
  errors: FormErrors;
  isSubmitting: boolean;

  onChangeNickname: (v: string) => void;
  onChangeBirthDate: (v: string) => void;
  onChangeGender: (v: Gender) => void;

  onSubmit: (e: React.FormEvent) => void;
};

export default function ProfileForm({
  nickname,
  birthDate,
  gender,
  errors,
  isSubmitting,
  onChangeNickname,
  onChangeBirthDate,
  onChangeGender,
  onSubmit,
}: ProfileFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          placeholder="닉네임을 입력해주세요."
          value={nickname}
          onChange={(e) => {
            onChangeNickname(e.target.value);
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
            onChangeBirthDate(e.target.value);
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
              onChangeGender(v as Gender);
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        저장
      </Button>
    </form>
  );
}
