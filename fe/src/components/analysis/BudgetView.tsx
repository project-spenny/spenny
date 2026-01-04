import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import useBudgetData from '@/hooks/useBudgetData';

const BudgetView = ({ selectedDate }: { selectedDate: Date }) => {
  const { totalBudget, categoryBudgets, isLoading } =
    useBudgetData(selectedDate);

  if (isLoading)
    return (
      <div className="py-20">
        <AnalysisLoading />
      </div>
    );

  if (!totalBudget) {
    return (
      <AnalysisEmpty
        title="이번 달 예산을 설정해 주세요"
        description="지출을 관리하기 위해 먼저 한 달 총 예산을 정해볼까요?"
        icon={Calculator}
      >
        <Button
          variant="secondary"
          className="bg-primary/5 hover:bg-primary/10 mt-2 cursor-pointer"
        >
          예산 설정하기
        </Button>
      </AnalysisEmpty>
    );
  }

  return (
    <div className="space-y-4">
      <AnalysisSection title={'총 예산'}>
        <div className="flex flex-col md:flex-row md:justify-center">
          <div className="p-4">
            <p className="text-muted-foreground text-base">이번 달 총 예산</p>
            <p className="text-2xl font-bold">
              {totalBudget.amount.toLocaleString()}원
            </p>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-base">남은 예산</p>
            <p className="text-2xl font-bold">????원</p>
          </div>
        </div>
      </AnalysisSection>

      <AnalysisSection title={'카테고리별 예산'}>카테고리</AnalysisSection>
    </div>
  );
};

export default BudgetView;
