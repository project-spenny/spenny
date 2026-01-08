import { ArrowRight, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useMemo, useState } from 'react';

import { BUDGET_GROUPS } from '@/constants/analysis';
import { Button } from '@/components/ui/button';
import { CategoryGroupId } from '@/types/budgetGuide';
import ExpenseAnalysisStep from '@/components/analysis/Budget/ExpenseAnalysisStep';
import { Progress } from '@/components/ui/progress';
import SavingGoalStep from '@/components/analysis/Budget/SavingGoalStep';
import useBudgetGuideData from '@/hooks/useBudgetGuideData';

type BudgetRecommendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
};

const BudgetRecommendDialog = ({
  open,
  onOpenChange,
  selectedDate,
}: BudgetRecommendDialogProps) => {
  const [step, setStep] = useState(1);
  const [targetSaving, setTargetSaving] = useState(0); // 저축 목표액

  const { processedData, isLoading } = useBudgetGuideData(
    selectedDate,
    targetSaving
  );

  // UI용 그룹 데이터 가공
  const groupDisplayData = useMemo(() => {
    if (!processedData) return [];

    const { groupAverages, avgTotal } = processedData.summary;

    return BUDGET_GROUPS.map((group) => {
      // processedData에서 해당 그룹의 평균 금액 가져오기
      const amount = groupAverages[group.id as CategoryGroupId] || 0;
      // 전체에서 차지하는 비중 계산 (분모가 0일 경우 대비)
      const percent = avgTotal > 0 ? Math.round((amount / avgTotal) * 100) : 0;

      return { ...group, amount, percent };
    });
  }, [processedData]);

  if (isLoading)
    return (
      <div className="text-muted-foreground p-10 text-center text-sm">
        소비 패턴 분석 중...
      </div>
    );
  if (!processedData)
    return (
      <div className="p-10 text-center text-sm">
        분석할 지출 데이터가 부족합니다.
      </div>
    );

  const { monthlyData, summary, lastMonthIncome, spendableBudget } =
    processedData;
  const activeMonths = monthlyData.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[800px] w-full flex-col md:max-w-2xl">
        {/* 상단 Step 표시 */}
        <div className="px-6 pt-6">
          <Progress value={(step / 3) * 100} className="h-1" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Step 1: 소비 패턴 분석 */}
          {step === 1 && (
            <ExpenseAnalysisStep
              activeMonths={activeMonths}
              avgTotal={summary.avgTotal}
              monthlyData={monthlyData}
              groupDisplayData={groupDisplayData}
            />
          )}

          {/* Step 2: 저축 목표 및 가용 예산 확정 */}
          {step === 2 && <SavingGoalStep lastMonthIncome={lastMonthIncome} />}

          {/* Step 3: 템플릿 선택 및 결과 확인 */}
          {step === 3 && (
            <div className="py-10 text-center">템플릿 선택 및 결과 확인</div>
          )}
        </div>

        <DialogFooter className="border-t p-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="h-12 flex-1 cursor-pointer text-base font-bold"
                  onClick={() => setStep(step - 1)}
                >
                  이전
                </Button>
              )}
              <Button
                className="h-12 flex-2 cursor-pointer text-base font-bold"
                onClick={() => setStep(step + 1)}
              >
                {step === 1 ? '내게 맞는 템플릿 선택하기' : '다음 단계'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
              <Info className="h-3 w-3" />
              과거 소비 비중을 가중치로 활용하여 분배됩니다.
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetRecommendDialog;
