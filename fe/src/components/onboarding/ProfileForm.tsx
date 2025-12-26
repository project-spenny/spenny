'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { profileSchema, type ProfileFormValues } from '@/schemas/profile';

type ProfileFormProps = {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => void;
};

export default function ProfileForm({
  defaultValues,
  onSubmit,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const gender = useWatch({ control, name: 'gender' });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          placeholder="닉네임을 입력해주세요."
          {...register('nickname')}
        />
        {errors.nickname?.message ? (
          <p className="text-sm text-red-500">{errors.nickname.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth">생년월일</Label>
        <Input
          id="birth"
          placeholder="YYYY-MM-DD"
          {...register('birth_date')}
        />
        {errors.birth_date?.message ? (
          <p className="text-sm text-red-500">{errors.birth_date.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-6">
          <Label>성별</Label>
          <RadioGroup
            value={gender}
            onValueChange={(v) =>
              setValue('gender', v as 'male' | 'female', {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
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
        {errors.gender?.message ? (
          <p className="text-sm text-red-500">{errors.gender.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !isDirty}
      >
        저장
      </Button>
    </form>
  );
}
