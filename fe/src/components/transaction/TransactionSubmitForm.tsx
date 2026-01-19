'use client';
import { useMemo, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { ITransaction, OCRResult } from '@/types/transactions';
import { AmountInput } from './common/AmountInput';
import { DatePicker } from './common/DatePicker';
import { TagInput } from './common/TagInput';
import { TitleInput } from './common/TitleInput';
import { TypeSelector } from './common/TypeSelector';
import { CategorySelector } from './common/CategorySelector';
import { QuickAmountButtons } from './common/QuickAmountButtons';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/providers/AuthProvider';

interface TransactionsSubmitFormProps {
  mode: 'create' | 'edit';
  transaction?: ITransaction | null;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue?: OCRResult | null;
  defaultDate?: Date;
}

export default function TransactionSubmitForm({
  mode,
  transaction,
  onClose,
  onSuccess,
  defaultDate,
  defaultValue,
}: TransactionsSubmitFormProps) {
  const initialFormData = useMemo(() => {
    if (mode === 'edit' && transaction) {
      return {
        title: transaction.title,
        type: transaction.type as 'income' | 'expense',
        amount: transaction.amount.toString(),
        date: new Date(transaction.date),
        category_id: transaction.category_id,
        tags: transaction.tags || [],
      };
    } else {
      if (defaultValue) {
        return {
          title: defaultValue.title,
          type: 'expense' as const,
          amount: defaultValue.amount.toString(),
          date: new Date(defaultValue.date),
          category_id: defaultValue.category_id,
          tags: [] as string[],
        };
      } else {
        return {
          title: '',
          type: '' as const,
          amount: '',
          date: defaultDate ?? new Date(),
          category_id: '',
          tags: [] as string[],
        };
      }
    }
  }, [mode, transaction, defaultDate, defaultValue]);

  const { userId, isLoading: authLoading } = useAuth();

  const {
    formData,
    setFormData,
    categoryOpen,
    setCategoryOpen,
    validateFormData,
    addTag,
    removeTag,
    UpdateField,
  } = useTransactionForm(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setFormData({
        title: defaultValue.title,
        type: 'expense',
        amount: defaultValue.amount.toString(),
        date: new Date(defaultValue.date),
        category_id: defaultValue.category_id,
        tags: [],
      });
    }
  }, [defaultValue, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 제출 방지

    const errorMsg = validateFormData();
    if (errorMsg) {
      toast(errorMsg);
      return;
    }

    if (authLoading) return;
    if (!userId) return;

    setIsSubmitting(true);
    try {
      const year = formData.date.getFullYear();
      const month = String(formData.date.getMonth() + 1).padStart(2, '0');
      const day = String(formData.date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const transactionData = {
        user_id: userId,
        title: formData.title.trim(),
        type: formData.type,
        amount: Number(formData.amount),
        date: formattedDate,
        category_id: formData.category_id,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('transactions')
          .insert(transactionData)
          .select();

        if (error) {
          toast.warning('저장 실패');
          return;
        }

        toast.success('가계부 작성을 완료했습니다');
      } else {
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction!.id);

        if (error) {
          toast.warning('수정 실패');
          return;
        }
        toast.success('가계부 수정을 완료했습니다');
      }

      setFormData({
        title: '',
        type: '',
        amount: '',
        date: new Date(),
        category_id: '',
        tags: [],
      });
      onSuccess();
    } catch (error) {
      toast.warning('수정 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    if (isSubmitting) return;

    if (!confirm('삭제하시겠습니까?')) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      if (error) {
        toast.warning('삭제에 실패했습니다');
        return;
      }

      toast.success('기록이 삭제되었습니다');
      onSuccess();
    } catch (error) {
      toast.error('오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex min-h-full w-full flex-1 flex-col px-10"
    >
      <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b pb-4">
        <Label className="text-xl">
          {mode === 'create' ? '가계부 작성' : '가계부 수정'}
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

        {formData.type !== '' && (
          <CategorySelector
            transactionType={formData.type}
            value={formData.category_id}
            open={categoryOpen}
            onOpenChange={setCategoryOpen}
            onChange={(category) => UpdateField('category_id', category)}
          />
        )}

        <AmountInput
          value={formData.amount}
          onChange={(value) => UpdateField('amount', value)}
        />

        <DatePicker
          value={formData.date}
          onChange={(date) => UpdateField('date', date)}
        />

        <TagInput tags={formData.tags} addTag={addTag} removeTag={removeTag} />
      </div>

      <div className="bg-background sticky bottom-0 z-10 border-t py-4">
        <div className="flex gap-2">
          {mode === 'edit' && (
            <Button
              type="button"
              variant="outline"
              className="hover:text-destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {mode === 'create' ? '저장' : '수정'}
          </Button>
        </div>
      </div>
    </form>
  );
}
