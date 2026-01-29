'use client';

import {
  useForm,
  useWatch,
  Controller,
  type FieldNamesMarkedBoolean,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatBirthDateInput, padBirthDateOnBlur } from '@/utils/birthDate';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  onboardingProfileSchema,
  type OnboardingProfileValues,
} from '@/schemas/profile';
import { Spinner } from '../ui/spinner';

type ProfileFormState = {
  isDirty: boolean;
  isSubmitting: boolean;
  dirtyFields: FieldNamesMarkedBoolean<OnboardingProfileValues>;
};

type ProfileFormProps = {
  defaultValues?: Partial<OnboardingProfileValues>;
  onSubmit: (
    data: OnboardingProfileValues,
    dirtyFields: FieldNamesMarkedBoolean<OnboardingProfileValues>
  ) => Promise<void>;
  children?: (state: ProfileFormState) => React.ReactNode;
};

// 에러 메시지 컴포넌트
function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-500">{message}</p>;
}

export default function ProfileForm({
  defaultValues,
  onSubmit,
  children,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
  } = useForm<OnboardingProfileValues>({
    resolver: zodResolver(onboardingProfileSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const gender = useWatch({ control, name: 'gender' });

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((data) => onSubmit(data, dirtyFields))}
    >
      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          placeholder="닉네임을 입력해주세요."
          {...register('nickname')}
        />
        <FormError message={errors.nickname?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth">생년월일</Label>
        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => (
            <Input
              id="birth"
              placeholder="YYYY-MM-DD"
              inputMode="numeric"
              autoComplete="bday"
              value={field.value ?? ''}
              onChange={(e) => {
                const formatted = formatBirthDateInput(e.target.value);
                field.onChange(formatted);
              }}
              onBlur={(e) => {
                const padded = padBirthDateOnBlur(e.target.value);
                setValue('birth_date', padded, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                field.onBlur();
              }}
            />
          )}
        />
        <FormError message={errors.birth_date?.message} />
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
        <FormError message={errors.gender?.message} />
      </div>

      {children ? (
        children({ isDirty, isSubmitting, dirtyFields })
      ) : (
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting && <Spinner />}
          저장
        </Button>
      )}
    </form>
  );
}
