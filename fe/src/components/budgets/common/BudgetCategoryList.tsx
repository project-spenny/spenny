import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import BudgetCategoryItem from '@/components/budgets/common/BudgetCategoryItem';
import { BudgetWithCategory } from '@/types/analysis';
import { Button } from '@/components/ui/button';
import { ListPlus } from 'lucide-react';

interface BudgetCategoryListProps {
  budgets: BudgetWithCategory[];
  categoryTotalsByKey: Record<string, number>;
  onEditAll: () => void;
  onResetAll: () => void;
  onEditItem: (key: string) => void;
}

const BudgetCategoryList = ({
  budgets,
  categoryTotalsByKey,
  onEditAll,
  onResetAll,
  onEditItem,
}: BudgetCategoryListProps) => {
  if (budgets.length === 0) {
    return (
      <AnalysisEmpty
        title="카테고리별 예산을 설정해주세요"
        description="식비, 교통비 등 항목별로 예산을 나누면 더 체계적으로 관리할 수 있어요."
        icon={ListPlus}
      >
        <Button className="mt-2 cursor-pointer" onClick={onEditAll}>
          카테고리 예산 설정하기
        </Button>
      </AnalysisEmpty>
    );
  }

  return (
    <div className="flex flex-col items-center py-2 md:py-4">
      <div className="absolute top-6 right-6 flex gap-1">
        <Button
          variant="ghost"
          className="hover:bg-brand/10 h-8 px-2 text-xs md:text-sm"
          onClick={onEditAll}
        >
          수정
        </Button>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-brand/10 hover:text-destructive h-8 px-2 text-xs md:text-sm"
          onClick={onResetAll}
        >
          초기화
        </Button>
      </div>

      <div className="w-full max-w-lg space-y-2 md:space-y-4">
        {budgets.map((budget) => (
          <BudgetCategoryItem
            key={budget.id}
            name={budget.category?.name_ko || '미지정'}
            categoryKey={budget.category?.category_key}
            amount={budget.amount}
            expense={
              categoryTotalsByKey[budget.category?.category_key || ''] || 0
            }
            onEdit={onEditItem}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetCategoryList;
