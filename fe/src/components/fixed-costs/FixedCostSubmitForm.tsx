'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TitleInput } from '../transaction/common/TitleInput';
import { TypeSelector } from '../transaction/common/TypeSelector';
import { CategorySelector } from '../transaction/common/CategorySelector';
import { AmountInput } from '../transaction/common/AmountInput';
import { toast } from 'sonner';
import FixedCostScheduleFields from './FixedCostsScheduleFields';
import { CreateFixedRuleInput } from '@/types/fixed-costs';
import { formatLocalDate } from '@/utils/date';
import {
  createFixedRule,
  deleteFixedRule,
  updateFixedRuleWithScope,
} from '@/services/fixed-costs/fixedCostsClient';
import { useRef, useState } from 'react';
import FixedCostEditConfirmDialog from './FixedCostEditConfirmDialog';
import FixedCostDeleteDialog from './FixedCostDeleteDialog';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/providers/AuthProvider';
import { isEndedFixedRule } from '@/utils/fixed-costs/rule';
import {
  fixedCostFormSchema,
  fixedCostFormDefaultValues,
  type FixedCostFormValues,
} from '@/schemas/fixedCosts';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type FixedCostSubmitFormProps = {
  mode: 'create' | 'edit';
  initialData?: Partial<FixedCostFormValues>;
  ruleId?: string;
  onSuccess: () => void;
};

export default function FixedCostSubmitForm({
  mode,
  initialData,
  ruleId,
  onSuccess,
}: FixedCostSubmitFormProps) {
  const { userId, isLoading: authLoading } = useAuth();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreateFixedRuleInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const isEndedRule = mode === 'edit' && isEndedFixedRule(initialData);

  const form = useForm<FixedCostFormValues>({
    resolver: zodResolver(fixedCostFormSchema),
    defaultValues: {
      ...fixedCostFormDefaultValues,
      ...(initialData ?? {}),
    },
    mode: 'onSubmit',
  });

  const { control, handleSubmit, watch, formState } = form;
  const { isDirty } = form.formState;

  const cycle = watch('cycle');
  const weekday = watch('weekday');
  const monthday = watch('monthday');

  const initialScheduleRef = useRef({
    cycle: initialData?.cycle ?? null,
    weekday: initialData?.weekday ?? null,
    monthday: initialData?.monthday ?? null,
  });

  const hasScheduleChange = () => {
    const init = initialScheduleRef.current;
    return (
      init.cycle !== cycle ||
      (cycle === 'WEEKLY' && init.weekday !== weekday) ||
      (cycle === 'MONTHLY' && init.monthday !== monthday)
    );
  };

  const onValid = async (data: FixedCostFormValues) => {
    if (isEndedRule) {
      toast.error('종료된 고정비 규칙은 수정할 수 없습니다.');
      return;
    }
    if (isSubmitting) return; // 중복 제출 방지
    if (authLoading) return;
    if (!userId) return;

    const payload: CreateFixedRuleInput = {
      title: data.title.trim(),
      type: data.type,
      amount: Number(data.amount), // 팀원 스키마 재사용(문자열)이라 그대로 Number()
      category_id: data.category_id,

      cycle: data.cycle,
      weekday: data.weekday,
      monthday: data.monthday,

      start_date: formatLocalDate(data.start_date),
      end_date: data.end_date ? formatLocalDate(data.end_date) : null,
    };

    if (mode === 'edit') {
      setPendingPayload(payload);
      setConfirmOpen(true);
      return;
    }
    setIsSubmitting(true);

    try {
      await createFixedRule(userId, payload);
      toast.success('고정비가 추가되었습니다.');
      onSuccess(); // 고정비 목록 갱신
    } catch {
      toast.error('고정비 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = () => {
    const err =
      formState.errors.title?.message ||
      formState.errors.type?.message ||
      formState.errors.category_id?.message ||
      formState.errors.amount?.message ||
      formState.errors.cycle?.message ||
      formState.errors.weekday?.message ||
      formState.errors.monthday?.message ||
      formState.errors.start_date?.message ||
      formState.errors.end_date?.message;

    if (err) toast.error(String(err));
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingPayload(null);
  };

  const handleApplyIncludeCurrent = async () => {
    if (!ruleId || !pendingPayload) return;
    if (isSubmitting) return;
    if (authLoading) return;
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await updateFixedRuleWithScope({
        userId,
        id: ruleId,
        ruleInput: pendingPayload,
        scope: 'INCLUDE_CURRENT',
      });

      toast.success('고정비가 수정되었습니다.');
      closeConfirm();
      onSuccess();
    } catch {
      toast.error('고정비 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyExcludeCurrent = async () => {
    if (!ruleId || !pendingPayload) return;
    if (isSubmitting) return;
    if (authLoading) return;
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await updateFixedRuleWithScope({
        userId,
        id: ruleId,
        ruleInput: pendingPayload,
        scope: 'EXCLUDE_CURRENT',
      });

      toast.success('고정비가 수정되었습니다.');
      closeConfirm();
      onSuccess();
    } catch {
      toast.error('고정비 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = async () => {
    if (!ruleId) return;
    if (isSubmitting) return;
    if (authLoading) return;
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await deleteFixedRule(userId, ruleId);
      toast.success('고정비 규칙이 삭제되었습니다.');
      onSuccess();
    } catch {
      toast.error(
        '고정비 규칙 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="mx-auto flex min-h-full w-full flex-1 flex-col px-10"
      >
        <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b pb-4">
          <Label className="text-xl">
            {mode === 'create' ? '고정비 추가' : '고정비 수정'}
          </Label>
          {isEndedRule && (
            <div className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm">
              종료된 고정비 규칙은 수정할 수 없습니다.
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 space-y-6 py-6">
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TitleInput value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <TypeSelector
                value={field.value}
                onChange={(type) => {
                  field.onChange(type);
                  form.setValue('category_id', '');
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <CategorySelector
                transactionType={watch('type')}
                value={field.value}
                open={categoryOpen}
                onOpenChange={setCategoryOpen}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <AmountInput value={field.value} onChange={field.onChange} />
            )}
          />
          {/* 고정비 영역 */}
          <FixedCostScheduleFields form={form} />
        </div>

        <div className="bg-background sticky bottom-0 z-10 border-t py-4">
          {mode === 'create' ? (
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting && <Spinner />}
              저장
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {ruleId && (
                <FixedCostDeleteDialog
                  onDelete={handleDeleteRule}
                  disabled={isSubmitting}
                />
              )}
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || isEndedRule || !isDirty}
              >
                {isSubmitting && <Spinner />}
                수정
              </Button>
            </div>
          )}
        </div>
      </form>

      <FixedCostEditConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        hasScheduleChange={hasScheduleChange()}
        cycle={cycle}
        onApplyIncludeCurrent={handleApplyIncludeCurrent}
        onApplyExcludeCurrent={handleApplyExcludeCurrent}
        pending={isSubmitting}
      />
    </div>
  );
}
