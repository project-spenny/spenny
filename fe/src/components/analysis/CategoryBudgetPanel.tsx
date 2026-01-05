import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '../ui/separator';
import useBudgetData from '@/hooks/useBudgetData';
import useCategories from '@/hooks/useCategories';

const CategoryBudgetPanel = ({ selectedDate }: { selectedDate: Date }) => {
  const { categoryBudgets, saveCategoryBudgets, isSavingCategories } =
    useBudgetData(selectedDate);
  const { data: allCategories, isLoading: isCategoriesLoading } =
    useCategories('expense');
  const [amounts, setAmounts] = useState<Record<string, string>>({});

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

  const handleAmountChange = (category: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmounts((prev) => ({ ...prev, [category]: numericValue }));
  };

  const handleSave = () => {
    if (!allCategories) return;

    // 객체를 배열로
    const categoryData = Object.entries(amounts)
      .map(([key, value]) => ({
        categoryId: key,
        amount: Number(value),
      }))
      .filter((item) => item.amount > 0); // 0원 초과인 항목만 저장

    saveCategoryBudgets(categoryData);
  };

  return (
    <ResponsivePanel
      trigger={
        <Button
          variant="ghost"
          className="bg-primary/5 hover:bg-primary/10 mt-2 cursor-pointer"
        >
          카테고리 예산 설정하기
        </Button>
      }
    >
      <div className="flex h-[80vh] flex-col px-8 py-6 md:h-[92vh] md:py-0">
        <div className="space-y-1 pb-4">
          <h2 className="text-xl font-bold">카테고리별 예산 설정</h2>
          <p className="text-muted-foreground text-sm font-medium">
            항목별 목표 금액을 정해보세요.
          </p>
        </div>

        <Separator />

        {/* 카테고리 예산 설정 */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-4 py-4">
            {isCategoriesLoading ? (
              <div>카테고리 목록 불러오는 중</div>
            ) : (
              allCategories?.map((category) => {
                const Icon = HelpCircle;

                return (
                  <div
                    key={category.category_key}
                    className="flex items-center gap-4 py-1"
                  >
                    {/* 아이콘 원형 배경 */}
                    <div className="bg-secondary text-secondary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <Icon size={20} />
                    </div>

                    {/* 카테고리명 */}
                    <div className="flex-1">
                      <p className="text-sm">{category.name_ko}</p>
                    </div>

                    {/* 금액 입력부 */}
                    <div className="relative w-40">
                      <Input
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
                        className="focus-visible:ring-primary h-9 pr-7 text-right"
                      />
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
        <div className="p-6">
          <Button
            className="h-12 w-full text-base"
            onClick={handleSave}
            disabled={isSavingCategories}
          >
            {isSavingCategories ? '저장 중' : '저장하기'}
          </Button>
        </div>
      </div>
    </ResponsivePanel>
  );
};

export default CategoryBudgetPanel;
