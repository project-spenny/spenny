import { ArrowRight, Info } from 'lucide-react';
import {
  CalculatedBudgetItem,
  CategoryGroupId,
  TemplateId,
} from '@/types/budgetGuide';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import {
  calculateKeepPatternBudget,
  calculateSaveFlexible,
} from '@/utils/calculateBudget';
import { useEffect, useMemo, useState } from 'react';

import { BUDGET_GROUPS } from '@/constants/analysis';
import BudgetResultStep from '@/components/budgets/steps/BudgetResultStep';
import { Button } from '@/components/ui/button';
import ExpenseAnalysisStep from '@/components/budgets/steps/ExpenseAnalysisStep';
import { Progress } from '@/components/ui/progress';
import SavingGoalStep from '@/components/budgets/steps/SavingGoalStep';
import { Spinner } from '@/components/ui/spinner';
import TemplateSelectionStep from '@/components/budgets/steps/TemplateSelectionStep';
import useBudgetGuideData from '@/hooks/useBudgetGuideData';

type BudgetRecommendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onConfirm: (budgetDraft: CalculatedBudgetItem[], totalBudget: number) => void;
  isSubmitting: boolean;
};

const BudgetRecommendDialog = ({
  open,
  onOpenChange,
  selectedDate,
  onConfirm,
  isSubmitting = false,
}: BudgetRecommendDialogProps) => {
  const [step, setStep] = useState(1);
  const [goalData, setGoalData] = useState({
    income: 0,
    savingsAmount: 0,
  });
  const [confirmedSavings, setConfirmedSavings] = useState(0);
  const [isAdjusted, setIsAdjusted] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] =
    useState<TemplateId>('keep-pattern'); // 선택된 템플릿
  const [budgetDraft, setBudgetDraft] = useState<CalculatedBudgetItem[]>([]); // 계산된 예산 초안

  const { processedData, isLoading: isAnalysisLoading } = useBudgetGuideData(
    selectedDate,
    confirmedSavings
  );

  useEffect(() => {
    // 초기값 설정
    if (processedData && goalData.income === 0) {
      const initialIncome = processedData.lastMonthIncome;
      const initialSavings = Math.floor(initialIncome * 0.2); // 초기값 20%

      setGoalData({
        income: initialIncome,
        savingsAmount: initialSavings,
      });
      setConfirmedSavings(initialSavings);
    }
  }, [processedData]); // processedData가 로드되는 순간 실행됨

  // 다이얼로그가 닫힐 때 상태 리셋
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setStep(1);
        setSelectedTemplateId('keep-pattern');
        setBudgetDraft([]);
        setIsAdjusted(false);

        setGoalData({
          income: 0,
          savingsAmount: 0,
        });
        setConfirmedSavings(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Step 2에서 데이터가 바뀔 때 부모 상태 업데이트
  const handleGoalDataChange = (newIncome: number, newSavings: number) => {
    setGoalData({ income: newIncome, savingsAmount: newSavings });
  };

  // 템플릿 선택 핸들러
  const handleTemplateSelect = (id: TemplateId) => {
    setSelectedTemplateId(id);
  };

  // step 이동 버튼 핸들러
  const handleNextStep = () => {
    if (step === 2) {
      setConfirmedSavings(goalData.savingsAmount);
      setStep(step + 1);
    } else if (step === 3 && processedData) {
      let result: CalculatedBudgetItem[] = [];
      let adjusted = false;

      // 템플릿별 분기 처리
      switch (selectedTemplateId) {
        case 'keep-pattern':
          result = calculateKeepPatternBudget(
            spendableBudget,
            processedData.categoryStats
          );
          adjusted = false;
          break;
        case 'save-flexible': {
          const res = calculateSaveFlexible(
            spendableBudget,
            processedData.categoryStats,
            0.4
          );
          result = res.items;
          adjusted = res.isAdjusted;
          break;
        }
        case 'extreme-save': {
          const res = calculateSaveFlexible(
            spendableBudget,
            processedData.categoryStats,
            0.3
          );
          result = res.items;
          adjusted = res.isAdjusted;
          break;
        }
      }

      setBudgetDraft(result);
      setIsAdjusted(adjusted);
      setStep(step + 1);
    } else if (step === 4) {
      if (isSubmitting) return;

      if (budgetDraft.length > 0) {
        onConfirm(budgetDraft, spendableBudget); // 부모 컴포넌트로 데이터 전달
      }
    } else {
      setStep(step + 1);
    }
  };

  const nextButtonLabels: Record<number, string> = {
    1: '저축 목표 세우기',
    2: '목표 설정 완료',
    3: '예산 결과 확인하기',
    4: '이대로 시작하기',
  };

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

  if (isAnalysisLoading)
    return (
      <div className="text-muted-foreground p-10 text-center text-sm">
        소비 패턴 분석 중...
      </div>
    );

  const monthlyData = processedData?.monthlyData || [];
  const summary = processedData?.summary || { avgTotal: 0, groupAverages: {} };
  const activeMonths = monthlyData.length;
  const isFewData = activeMonths > 0 && activeMonths < 3;

  // 가용 예산
  const spendableBudget = goalData.income - goalData.savingsAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[800px] w-full flex-col md:max-w-2xl">
        {/* 상단 Step 표시 */}
        <div className="px-6 pt-6">
          <Progress value={(step / 4) * 100} className="[&>div]:bg-brand h-2" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Step 1: 소비 패턴 분석 */}
          {step === 1 && (
            <ExpenseAnalysisStep
              activeMonths={activeMonths}
              isFewData={isFewData}
              avgTotal={summary.avgTotal}
              monthlyData={monthlyData}
              groupDisplayData={groupDisplayData}
            />
          )}

          {/* Step 2: 저축 목표 및 가용 예산 확정 */}
          {step === 2 && (
            <SavingGoalStep
              income={goalData.income}
              savingsAmount={goalData.savingsAmount}
              onChange={handleGoalDataChange}
            />
          )}

          {/* Step 3: 템플릿 선택 */}
          {step === 3 && (
            <TemplateSelectionStep
              activeMonths={activeMonths}
              selectedId={selectedTemplateId}
              onSelect={handleTemplateSelect}
            />
          )}

          {/* Step 4: 예산 결과 확인 및 최종 확정 */}
          {step === 4 && (
            <BudgetResultStep
              activeMonths={activeMonths}
              budgetDraft={budgetDraft}
              spendableBudget={spendableBudget}
              isAdjusted={isAdjusted}
              templateId={selectedTemplateId}
            />
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
                  disabled={isSubmitting}
                >
                  이전
                </Button>
              )}
              <Button
                className="h-12 flex-2 cursor-pointer text-base font-bold"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span className="flex items-center gap-2">저장 중</span>
                  </div>
                ) : (
                  <>
                    {nextButtonLabels[step] || '다음 단계'}
                    {step < 4 && <ArrowRight className="h-4 w-4" />}
                  </>
                )}
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
