'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TitleInput } from '../transaction/common/TitleInput';
import { TypeSelector } from '../transaction/common/TypeSelector';
import { CategorySelector } from '../transaction/common/CategorySelector';
import { AmountInput } from '../transaction/common/AmountInput';
import { TagInput } from '../transaction/common/TagInput';

export default function FixedCostCreateForm() {
  return (
    <div className="flex h-full flex-col px-6">
      <form className="flex h-full flex-col space-y-6">
        <div className="border-b pb-4">
          <Label className="text-xl">고정비 추가</Label>
        </div>

        <TitleInput value="" onChange={() => {}} />

        <TypeSelector value="" onChange={() => {}} />

        <CategorySelector
          transactionType=""
          value=""
          open={false}
          onOpenChange={() => {}}
          onChange={() => {}}
        />

        <AmountInput value="" onChange={() => {}} />

        {/* 고정비 영역 */}

        <TagInput tags={[]} addTag={() => {}} removeTag={() => {}} />
        <div className="mt-auto border-t pt-4 pb-4">
          <Button type="submit" className="w-full" disabled>
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}
