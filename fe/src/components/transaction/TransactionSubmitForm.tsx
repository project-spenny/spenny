'use client';
import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { ITransaction } from '@/types/transactions';

import { AmountInput } from './common/AmountInput';
import { DatePicker } from './common/DatePicker';
import { TagInput } from './common/TagInput';
import { TitleInput } from './common/TitleInput';
import { TypeSelector } from './common/TypeSelector';
import { CategorySelector } from './common/CategorySelector';

interface TransactionsSubmitFormProps {
  mode: 'create' | 'edit';
  transaction?: ITransaction | null;
  onClose: () => void;
  onSuccess: () => void;
  defaultDate?: Date;
}

export default function TransactionSubmitForm({
  mode,
  transaction,
  onClose,
  onSuccess,
  defaultDate,
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
      return {
        title: '',
        type: '' as '' | 'income' | 'expense',
        amount: '',
        date: defaultDate ?? new Date(),
        category_id: '',
        tags: [] as string[],
      };
    }
  }, [mode, transaction, defaultDate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateFormData();

    if (errorMsg) {
      toast(errorMsg);
      return;
    }
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (!user || authError) {
        toast.warning('로그인이 필요합니다');
        return;
      }
      const year = formData.date.getFullYear();
      const month = String(formData.date.getMonth() + 1).padStart(2, '0');
      const day = String(formData.date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const transactionData = {
        user_id: user.id,
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
      onClose();
    } catch (error) {
      toast.warning('수정 실패');
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    if (!confirm('삭제하시겠습니까?')) return;

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
      onClose();
    } catch (error) {
      toast.error('오류가 발생했습니다');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-full w-full flex-col space-y-6 p-10 pt-2"
    >
      <div className="sticky top-0 flex items-center justify-between border-b bg-background pb-4">
        <Label className="text-xl">
          {mode === 'create' ? '가계부 작성' : '가계부 수정'}
        </Label>
      </div>

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
        onChange={(value) => UpdateField('amount', value)}
      />

      <DatePicker
        value={formData.date}
        onChange={(date) => UpdateField('date', date)}
      />

      <TagInput tags={formData.tags} addTag={addTag} removeTag={removeTag} />

      <div className="mt-auto flex gap-2 border-t p-4">
        {mode === 'edit' && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDelete()}
            className="h-12 w-12"
          >
            <Trash />
          </Button>
        )}
        <Button
          type="submit"
          className="h-12 flex-1"
          onClick={(e) => handleSubmit(e)}
        >
          {mode === 'create' ? '저장' : '수정'}
        </Button>
      </div>
    </form>
  );
}
