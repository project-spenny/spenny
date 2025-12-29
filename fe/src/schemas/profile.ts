import { z } from 'zod';

const genderSchema = z.enum(['male', 'female']);

const nicknameSchema = z.string().trim().min(1, '닉네임 입력이 필요합니다.');

const birthDateSchema = z
  .string()
  .trim()
  .min(1, '생년월일 입력이 필요합니다.')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요.')
  .refine((v) => {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return false;
    return d.toISOString().slice(0, 10) === v;
  }, '유효한 날짜를 입력해주세요.');

// onboarding - 전체 입력
export const onboardingProfileSchema = z.object({
  nickname: nicknameSchema,
  birth_date: birthDateSchema,
  gender: genderSchema,
});

export type OnboardingProfileValues = z.infer<typeof onboardingProfileSchema>;

// profile - 부분 입력 (수정)
export const profilePatchSchema = z.object({
  nickname: nicknameSchema.optional(),
  birth_date: birthDateSchema.optional(),
  gender: genderSchema.optional(),
});

export type ProfilePatchValues = z.infer<typeof profilePatchSchema> & {
  profile_image_url: string | null;
};
