import { z } from 'zod';
import { transactionFormSchema } from './transaction';

const cycleSchema = z.enum(['WEEKLY', 'MONTHLY'], {
  message: '반복 주기를 선택해주세요',
});

export const fixedCostFormSchema = transactionFormSchema
  // 고정비에서 공통으로 쓰는 필드만 재사용
  .pick({
    title: true,
    type: true,
    category_id: true,
    amount: true,
  })

  // 고정비 전용 필드 추가
  .extend({
    cycle: cycleSchema,
    weekday: z.number().int().min(1).max(7).nullable(),
    monthday: z.number().int().min(1).max(31).nullable(),
    start_date: z.date({ message: '시작일을 선택해주세요' }),
    end_date: z.date().nullable(),
  })

  // cycle 조건부 검증 + 기간 검증
  .superRefine((val, ctx) => {
    if (val.cycle === 'WEEKLY' && !val.weekday) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekday'],
        message: '반복 요일을 선택해주세요',
      });
    }

    if (val.cycle === 'MONTHLY' && !val.monthday) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthday'],
        message: '반복 날짜를 선택해주세요',
      });
    }

    if (val.end_date && val.end_date < val.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_date'],
        message: '종료일은 시작일 이후여야 합니다',
      });
    }
  });

export type FixedCostFormValues = z.infer<typeof fixedCostFormSchema>;

export const fixedCostFormDefaultValues: FixedCostFormValues = {
  title: '',
  type: 'expense',
  category_id: '',
  amount: '',

  cycle: 'MONTHLY',
  weekday: null,
  monthday: 1,

  start_date: new Date(),
  end_date: null,
};
