'use client';

import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  nickname: z.string().trim().min(1, '닉네임을 입력이 필요합니다.'),
  birth_date: z
    .string()
    .trim()
    .min(1, '생년월일 입력이 필요합니다.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요.'),
  gender: z.enum(['male', 'female']),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  isSubmitting: boolean;
  onSubmit: (data: ProfileFormValues) => void;
};

export default function ProfileForm({
  isSubmitting,
  onSubmit,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    defaultValues: {
      nickname: '',
      birth_date: '',
      gender: 'male',
    },
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        저장
      </Button>
    </form>
  );
}
