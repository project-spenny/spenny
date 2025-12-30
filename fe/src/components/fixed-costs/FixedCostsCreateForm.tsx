'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TitleInput } from '../transaction/common/TitleInput';
import { TypeSelector } from '../transaction/common/TypeSelector';
import { CategorySelector } from '../transaction/common/CategorySelector';
import { AmountInput } from '../transaction/common/AmountInput';
import { useFixedCostForm } from '@/hooks/useFixedCostForm';
import { toast } from 'sonner';

export default function FixedCostCreateForm() {
  const {
    formData,
    categoryOpen,
    setCategoryOpen,
    UpdateField,
    validateFormData,
  } = useFixedCostForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateFormData();
    if (errorMsg) {
      toast(errorMsg);
      return;
    }
    console.log('submit payload', formData);
  };

  return (
    <div className="flex h-full flex-col px-6">
      <form onSubmit={handleSubmit} className="flex h-full flex-col space-y-6">
        <div className="border-b pb-4">
          <Label className="text-xl">고정비 추가</Label>
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
          onChange={(amount) => UpdateField('amount', amount)}
        />

        {/* 고정비 영역 */}

        <div className="mt-auto border-t pt-4 pb-4">
          <Button type="submit" className="w-full">
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}
