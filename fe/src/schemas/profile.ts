import { z } from 'zod';

export const profileSchema = z.object({
  nickname: z.string().trim().min(1, '닉네임을 입력이 필요합니다.'),
  birth_date: z
    .string()
    .trim()
    .min(1, '생년월일 입력이 필요합니다.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요.'),
  gender: z.enum(['male', 'female']),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type Profile = ProfileFormValues & {
  profile_image_url: string | null;
};
