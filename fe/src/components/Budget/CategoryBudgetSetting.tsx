import { Edit, HelpCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { THEME_COLOR } from '@/constants/colors';
import { cn } from '@/lib/utils';
import useBudgetData from '@/hooks/useBudgetData';
import useCategories from '@/hooks/useCategories';

type CategoryBudgetSettingProps = {
  selectedDate: Date;
  totalBudgetAmount: number;
  initialCategoryKey?: string | null;
  onSaveSuccess?: () => void;
  onEditTotalBudget?: () => void;
};

const CategoryBudgetSetting = ({
  selectedDate,
  totalBudgetAmount,
  initialCategoryKey,
  onSaveSuccess,
  onEditTotalBudget,
}: CategoryBudgetSettingProps) => {
  const {
    categoryBudgets,
    saveCategoryBudgets,
    isSavingCategories,
    removeBudget,
  } = useBudgetData(selectedDate);
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories('expense');
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  // 각 카테고리 Input을 참조하기 위한 ref 객체
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 초기 포커스
  useEffect(() => {
    if (initialCategoryKey && !isCategoriesLoading) {
      setTimeout(() => {
        const targetInput = inputRefs.current[initialCategoryKey];

        if (targetInput) {
          targetInput.focus();
          targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [initialCategoryKey, isCategoriesLoading]);

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

  // 현재 입력된 값 중 유효한(0보다 큰) 데이터만 추출
  const currentBudgets = Object.entries(amounts)
    .filter(([_, value]) => value !== '' && Number(value) > 0)
    .map(([categoryId, value]) => ({ categoryId, amount: Number(value) }));

  // 개수 비교 결과
  const hasCountChanged = currentBudgets.length !== categoryBudgets.length;

  // 금액 비교 결과
  const hasAmountChanged = currentBudgets.some((current) => {
    const original = categoryBudgets.find(
      (b) => b.category_id === current.categoryId
    );
    return original?.amount !== current.amount;
  });

  // 변경 여부 (기존 값과 비교)
  const isChanged = hasCountChanged || hasAmountChanged;

  const handleSave = () => {
    if (!allCategories || !isChanged) return;

    // 추가 및 수정할 데이터 (0원보다 큰 유효한 예산 리스트)
    const upsertData = currentBudgets;

    // 삭제할 데이터 (기존 예산 중 입력값이 0이 된 항목들)
    const currentCategoryIds = currentBudgets.map((b) => b.categoryId);
    const deleteData = categoryBudgets
      .map((b) => b.category_id)
      .filter((id): id is string => id !== null)
      .filter((id) => !currentCategoryIds.includes(id));

    if (deleteData.length > 0) removeBudget(deleteData);
    if (upsertData.length > 0) saveCategoryBudgets(upsertData);

    if (onSaveSuccess) onSaveSuccess();
  };

  const handleAmountChange = (category: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmounts((prev) => ({ ...prev, [category]: numericValue }));
  };

  const handleResetCategory = (categoryKey: string) => {
    setAmounts((prev) => ({ ...prev, [categoryKey]: '' }));
    inputRefs.current[categoryKey]?.focus(); // 초기화 후 다시 포커스
  };

  // 현재 입력된 모든 카테고리 금액의 합계
  const totalAllocated = currentBudgets.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // 남은 금액 및 초과 여부
  const remaining = totalBudgetAmount - totalAllocated;
  const isOverBudget = remaining < 0;

  return (
    <div className="flex h-[80vh] flex-col px-8 py-6 md:h-[92vh] md:py-0">
      <div className="space-y-1 pb-4">
        <h2 className="text-xl font-bold">카테고리별 예산 설정</h2>
        <p className="text-muted-foreground text-sm font-medium">
          항목별 목표 금액을 정해보세요.
        </p>

        <Card
          className={cn(
            'mt-4 gap-0 p-5 transition-all',
            isOverBudget ? 'bg-destructive/5' : 'bg-primary-foreground'
          )}
        >
          <div className="mb-4 flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold">총 예산</p>

              <div className="flex items-center gap-2 tracking-tight">
                <span className="text-2xl font-bold">
                  {totalAllocated.toLocaleString()}
                </span>
                <div className="text-muted-foreground flex items-center text-sm">
                  /
                  <div
                    className="hover:text-primary flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:underline"
                    onClick={onEditTotalBudget}
                  >
                    {totalBudgetAmount.toLocaleString()}원
                    <Edit className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-muted-foreground text-xs font-medium">
                남은 예산
              </p>
              <p
                className={cn(
                  'text-lg font-bold tracking-tight',
                  isOverBudget ? THEME_COLOR.EXPENSE : 'text-brand'
                )}
              >
                {isOverBudget
                  ? `-${Math.abs(remaining).toLocaleString()}`
                  : remaining.toLocaleString()}
                원
              </p>
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div className="space-y-2">
            <Progress
              value={Math.min((totalAllocated / totalBudgetAmount) * 100, 100)}
              className="h-2"
              indicatorClassName={isOverBudget ? 'bg-red-400' : 'bg-brand'}
            />

            {isOverBudget && (
              <p
                className={cn('mt-2 text-sm font-medium', THEME_COLOR.EXPENSE)}
              >
                ⚠️ 설정된 카테고리 예산이 총 예산을 초과했습니다.
              </p>
            )}
          </div>
        </Card>
      </div>

      <Separator />

      {/* 카테고리 예산 설정 */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-5 px-2 py-4">
          {isCategoriesLoading ? (
            <div>카테고리 목록 불러오는 중</div>
          ) : (
            allCategories?.map((category) => {
              const Icon = HelpCircle;

              return (
                <div
                  key={category.category_key}
                  className="flex items-center gap-2 py-1"
                >
                  {/* 아이콘 원형 배경 */}
                  <div className="bg-secondary text-secondary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <Icon size={20} />
                  </div>

                  {/* 카테고리명 */}
                  <div className="flex flex-1 items-center gap-1">
                    <p className="text-sm font-semibold">{category.name_ko}</p>
                    {totalBudgetAmount > 0 &&
                      Number(amounts[category.category_key]) > 0 && (
                        <Badge className="bg-brand-subtle dark:bg-brand/10 text-brand px-2 py-0.5 text-xs font-semibold">
                          {Math.round(
                            (Number(amounts[category.category_key]) /
                              totalBudgetAmount) *
                              100
                          )}
                          %
                        </Badge>
                      )}
                  </div>

                  {/* 금액 입력부 */}
                  <div className="relative w-36">
                    <Input
                      ref={(el) => {
                        inputRefs.current[category.category_key] = el;
                      }}
                      type="text"
                      placeholder="0"
                      value={
                        amounts[category.category_key]
                          ? Number(
                              amounts[category.category_key]
                            ).toLocaleString()
                          : ''
                      }
                      onChange={(e) =>
                        handleAmountChange(
                          category.category_key,
                          e.target.value
                        )
                      }
                      className="focus-visible:ring-brand-soft h-9 pr-7 text-right"
                    />
                    {amounts[category.category_key] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive absolute top-1/2 left-0.5 h-8 w-8 shrink-0 -translate-y-1/2"
                        onClick={() =>
                          handleResetCategory(category.category_key)
                        }
                      >
                        <X size={16} />
                      </Button>
                    )}
                    <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
                      원
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* 하단 버튼 영역 */}
      <div className="space-y-4 p-4">
        {isOverBudget ? (
          <p
            className={cn('text-center text-sm font-bold', THEME_COLOR.EXPENSE)}
          >
            총 예산을 늘리거나 카테고리 금액을 조절해주세요.
          </p>
        ) : (
          !isChanged && (
            <p className="text-muted-foreground text-center text-sm">
              {categoryBudgets.length === 0
                ? '카테고리별 예산 금액을 입력해주세요.'
                : '기존에 설정된 금액과 동일합니다.'}
            </p>
          )
        )}

        <Button
          className={cn(
            'h-12 w-full cursor-pointer text-base',
            isOverBudget && 'bg-red-400 hover:bg-red-500'
          )}
          onClick={handleSave}
          disabled={isSavingCategories || !isChanged || isOverBudget}
        >
          {isSavingCategories ? '저장 중' : '저장하기'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryBudgetSetting;
