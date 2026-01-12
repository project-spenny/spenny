'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TitleInput } from '../transaction/common/TitleInput';
import { TypeSelector } from '../transaction/common/TypeSelector';
import { CategorySelector } from '../transaction/common/CategorySelector';
import { AmountInput } from '../transaction/common/AmountInput';
import { IFixedCostFormData, useFixedCostForm } from '@/hooks/useFixedCostForm';
import { toast } from 'sonner';
import FixedCostScheduleFields from './FixedCostsScheduleFields';
import { CreateFixedRuleInput } from '@/types/fixed-costs';
import { formatLocalDate } from '@/utils/date';
import {
  createFixedRule,
  deleteFixedRule,
  updateFixedRuleWithScope,
} from '@/services/fixed-costs/fixed-costs';
import { useState } from 'react';
import FixedCostEditConfirmDialog from './FixedCostEditConfirmDialog';
import FixedCostDeleteDialog from './FixedCostDeleteDialog';
import { Spinner } from '../ui/spinner';

type FixedCostSubmitFormProps = {
  mode: 'create' | 'edit';
  initialData?: Partial<IFixedCostFormData>;
  ruleId?: string;
  onSuccess: () => void;
};

export default function FixedCostSubmitForm({
  mode,
  initialData,
  ruleId,
  onSuccess,
}: FixedCostSubmitFormProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreateFixedRuleInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formData,
    categoryOpen,
    setCategoryOpen,
    UpdateField,
    validateFormData,
  } = useFixedCostForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 제출 방지

    const errorMsg = validateFormData();
    if (errorMsg) {
      toast(errorMsg);
      return;
    }

    const payload: CreateFixedRuleInput = {
      title: formData.title.trim(),
      type: formData.type as 'income' | 'expense',
      amount: Number(formData.amount),
      category_id: formData.category_id,

      cycle: formData.cycle as 'WEEKLY' | 'MONTHLY',
      weekday: formData.weekday,
      monthday: formData.monthday,

      start_date: formatLocalDate(formData.start_date),
      end_date: formData.end_date ? formatLocalDate(formData.end_date) : null,
    };

    if (mode === 'edit') {
      setPendingPayload(payload);
      setConfirmOpen(true);
      return;
    }
    setIsSubmitting(true);

    try {
      await createFixedRule(payload);
      toast.success('고정비가 추가되었습니다.');
      onSuccess(); // 고정비 목록 갱신
    } catch {
      toast.error('고정비 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingPayload(null);
  };

  const handleApplyIncludeCurrent = async () => {
    if (!ruleId || !pendingPayload) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateFixedRuleWithScope({
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

    setIsSubmitting(true);
    try {
      await updateFixedRuleWithScope({
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

    setIsSubmitting(true);
    try {
      await deleteFixedRule(ruleId);
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
        onSubmit={handleSubmit}
        className="mx-auto flex min-h-full w-full flex-1 flex-col px-10"
      >
        <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b pb-4">
          <Label className="text-xl">
            {mode === 'create' ? '고정비 추가' : '고정비 수정'}
          </Label>
        </div>

        <div className="min-h-0 flex-1 space-y-6 py-6">
          <TitleInput
            value={formData.title}
            onChange={(title) => UpdateField('title', title)}
          />
          <TypeSelector
            value={formData.type}
            onChange={(type) => {
              UpdateField('type', type);
              UpdateField('category_id', '');
            }}
          />
          <CategorySelector
            transactionType={formData.type}
            value={formData.category_id}
            open={categoryOpen}
            onOpenChange={setCategoryOpen}
            onChange={(category) => UpdateField('category_id', category)}
          />
          <AmountInput
            value={formData.amount}
            onChange={(amount) => UpdateField('amount', amount)}
          />
          {/* 고정비 영역 */}
          <FixedCostScheduleFields
            formData={formData}
            UpdateField={UpdateField}
          />
        </div>

        <div className="bg-background sticky bottom-0 z-10 border-t py-4">
          {mode === 'create' ? (
            <Button type="submit" className="w-full">
              {isSubmitting && <Spinner />}
              저장
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {ruleId && <FixedCostDeleteDialog onDelete={handleDeleteRule} />}
              <Button type="submit" className="flex-1">
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
        cycle={formData.cycle as 'WEEKLY' | 'MONTHLY'}
        onApplyIncludeCurrent={handleApplyIncludeCurrent}
        onApplyExcludeCurrent={handleApplyExcludeCurrent}
      />
    </div>
  );
}
