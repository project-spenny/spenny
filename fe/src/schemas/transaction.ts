import { z } from 'zod';

const transactionTypeSchema = z.enum(['income', 'expense'], {
  message: '거래 유형을 선택해주세요',
});

const titleSchema = z
  .string()
  .trim()
  .min(1, '제목을 입력해주세요')
  .max(20, '제목은 20자 이내로 입력해주세요');

const categoryIdSchema = z.string().min(1, '카테고리를 선택해주세요');

const amountSchema = z
  .string()
  .min(1, '금액을 입력해주세요')
  .refine((v) => Number(v) > 0, '금액은 0보다 커야 합니다');

const dateSchema = z.date({
  message: '날짜를 선택해주세요',
});

const tagSchema = z
  .string()
  .trim()
  .max(10, '태그는 최대 10자까지 입력 가능합니다');

const tagsSchema = z
  .array(tagSchema)
  .max(5, '태그는 최대 5개까지 추가할 수 있습니다')
  .default([]);

export const transactionFormSchema = z.object({
  title: titleSchema,
  type: transactionTypeSchema,
  category_id: categoryIdSchema,
  amount: amountSchema,
  date: dateSchema,
  tags: tagsSchema,
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const transactionFormDefaultValues: TransactionFormValues = {
  title: '',
  type: 'expense',
  category_id: '',
  amount: '',
  date: new Date(),
  tags: [],
};
