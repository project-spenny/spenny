import { useEffect, useRef, useState } from 'react';

import BudgetCategoryEditItem from '@/components/budgets/common/BudgetCategoryEditItem';
import BudgetSummary from '@/components/budgets/common/BudgetSummary';
import { Button } from '@/components/ui/button';
import { THEME_COLOR } from '@/constants/colors';
import { cn } from '@/lib/utils';
import useBudgetData from '@/hooks/useBudgetData';
import useCategories from '@/hooks/useCategories';

type BudgetCategorySettingProps = {
  selectedDate: Date;
  totalBudgetAmount: number;
  initialCategoryKey?: string | null;
  onSaveSuccess?: () => void;
  onEditTotalBudget?: () => void;
};

const BudgetCategorySetting = ({
  selectedDate,
  totalBudgetAmount,
  initialCategoryKey,
  onSaveSuccess,
  onEditTotalBudget,
}: BudgetCategorySettingProps) => {
  const {
    categoryBudgets,
    saveCategoryBudgets,
    isSavingCategories,
    removeBudget,
  } = useBudgetData(selectedDate);
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories('expense');

  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({}); // 각 카테고리 Input 참조

  // 계산 로직
  // 현재 입력된 값 중 유효한(0보다 큰) 데이터만 추출
  const validCategoryBudgets = Object.entries(amounts)
    .filter(([_, value]) => value !== '' && Number(value) > 0)
    .map(([categoryId, value]) => ({ categoryId, amount: Number(value) }));

  // 현재 입력된 모든 카테고리 금액의 합계
  const totalAllocated = validCategoryBudgets.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  // 초과 여부
  const isOverBudget = totalBudgetAmount - totalAllocated < 0;

  // 개수 비교 결과
  const isCategoryCountChanged =
    validCategoryBudgets.length !== categoryBudgets.length;
  // 금액 비교 결과
  const isAnyAmountChanged = validCategoryBudgets.some((current) => {
    const original = categoryBudgets.find(
      (b) => b.category_id === current.categoryId
    );
    return original?.amount !== current.amount;
  });
  // 변경 여부 (기존 값과 비교)
  const isDirty = isCategoryCountChanged || isAnyAmountChanged;

  // 데이터 초기화
  useEffect(() => {
    if (categoryBudgets && allCategories) {
      const initialMap: Record<string, string> = {};

      categoryBudgets.forEach((budget) => {
        // category_id와 일치하는 카테고리 정보 확인
        const category = allCategories.find(
          (c) => c.category_key === budget.category_id
        );

        if (category) {
          initialMap[category.category_key] = budget.amount.toString();
        }
      });

      setAmounts(initialMap);
    }
  }, [categoryBudgets, allCategories]);
  // 초기 포커스
  useEffect(() => {
    if (!initialCategoryKey || isCategoriesLoading) return;

    const timer = setTimeout(() => {
      const targetInput = inputRefs.current[initialCategoryKey];
      if (!targetInput) return;

      targetInput.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [initialCategoryKey, isCategoriesLoading]);

  // 핸들러
  const handleAmountChange = (category: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmounts((prev) => ({ ...prev, [category]: numericValue }));
  };
  const handleResetCategory = (categoryKey: string) => {
    setAmounts((prev) => ({ ...prev, [categoryKey]: '' }));
    inputRefs.current[categoryKey]?.focus(); // 초기화 후 다시 포커스
  };
  const handleSave = () => {
    if (!allCategories || !isDirty) return;

    // 추가 및 수정할 데이터 (0원보다 큰 유효한 예산 리스트)
    const upsertData = validCategoryBudgets;

    // 삭제할 데이터 (기존 예산 중 입력값이 0이 된 항목들)
    const currentCategoryIds = validCategoryBudgets.map((b) => b.categoryId);
    const deleteData = categoryBudgets
      .map((b) => b.category_id)
      .filter((id): id is string => id !== null)
      .filter((id) => !currentCategoryIds.includes(id));

    if (deleteData.length > 0) removeBudget(deleteData);
    if (upsertData.length > 0) saveCategoryBudgets(upsertData);

    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="flex h-full flex-col px-8">
      <div className="bg-background sticky top-0 z-10 space-y-1 border-b pb-4">
        <p className="text-lg font-bold md:text-xl">카테고리별 예산 설정</p>
        <p className="text-muted-foreground text-xs font-medium md:text-sm">
          항목별 목표 금액을 정해보세요.
        </p>
      </div>

      {/* 카테고리 예산 설정 */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-2">
        <BudgetSummary
          totalBudget={totalBudgetAmount}
          totalAllocated={totalAllocated}
          onEditTotal={onEditTotalBudget}
        />

        {isCategoriesLoading ? (
          <div>카테고리 목록 불러오는 중</div>
        ) : (
          allCategories?.map((category) => (
            <BudgetCategoryEditItem
              key={category.category_key}
              category={category}
              amount={amounts[category.category_key] ?? ''}
              totalBudgetAmount={totalBudgetAmount}
              onChange={handleAmountChange}
              onReset={handleResetCategory}
              inputRef={(el) => {
                inputRefs.current[category.category_key] = el;
              }}
            />
          ))
        )}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="bg-background sticky bottom-0 space-y-2 border-t pt-2 pb-4">
        {isOverBudget ? (
          <p
            className={cn('text-center text-sm font-bold', THEME_COLOR.EXPENSE)}
          >
            총 예산을 늘리거나 카테고리 금액을 조절해주세요.
          </p>
        ) : (
          !isDirty && (
            <p className="text-muted-foreground text-center text-xs md:text-sm">
              {categoryBudgets.length === 0
                ? '카테고리별 예산 금액을 입력해주세요.'
                : '기존에 설정된 금액과 동일합니다.'}
            </p>
          )
        )}

        <Button
          className={cn(
            'h-10 w-full cursor-pointer text-xs md:h-12 md:text-sm',
            isOverBudget && 'bg-red-400 hover:bg-red-500'
          )}
          onClick={handleSave}
          disabled={isSavingCategories || !isDirty || isOverBudget}
        >
          {isSavingCategories ? '저장 중' : '저장하기'}
        </Button>
      </div>
    </div>
  );
};

export default BudgetCategorySetting;
