import { CalculatedBudgetItem, TemplateId } from '@/types/budgetGuide';
import { useEffect, useState } from 'react';

export const BUDGET_STORAGE_KEY = 'budget_recommend_state';

// 예산 추천 상태
type BudgetRecommendState = {
  step: number;
  goalData: {
    income: number;
    savingsAmount: number;
  };
  selectedTemplateId: TemplateId;
  budgetDraft: CalculatedBudgetItem[];
  isAdjusted: boolean;
};

export const useBudgetRecommendState = (
  open: boolean,
  initialIncome: number
) => {
  const [step, setStep] = useState(1);
  const [goalData, setGoalData] = useState({
    income: 0,
    savingsAmount: 0,
  });
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<TemplateId>('keep-pattern'); // 선택된 템플릿
  const [budgetDraft, setBudgetDraft] = useState<CalculatedBudgetItem[]>([]); // 계산된 예산 초안

  // 마운트 시 스토리지에서 데이터 로드
  useEffect(() => {
    const saved = sessionStorage.getItem(BUDGET_STORAGE_KEY);

    if (saved) {
      try {
        const parsed: BudgetRecommendState = JSON.parse(saved);
        setStep(parsed.step);
        setGoalData(parsed.goalData);
        setSelectedTemplateId(parsed.selectedTemplateId);
        if (parsed.budgetDraft) setBudgetDraft(parsed.budgetDraft);
        if (parsed.isAdjusted !== undefined) setIsAdjusted(parsed.isAdjusted);
      } catch (error) {
        console.error('예산 상태 parse 실패: ', error);
      }
    }
  }, []);

  // 초기값 설정
  useEffect(() => {
    const saved = sessionStorage.getItem(BUDGET_STORAGE_KEY);

    // 세션에 저장된 게 없고, 현재 소득 데이터가 0일 때만 기본값 세팅
    if (!saved && initialIncome > 0 && goalData.income === 0) {
      setGoalData({
        income: initialIncome,
        savingsAmount: Math.floor(initialIncome * 0.2),
      });
    }
  }, [initialIncome, goalData.income]);

  // 상태 저장
  useEffect(() => {
    if (open && goalData.income > 0) {
      const state = {
        step,
        goalData,
        selectedTemplateId,
        budgetDraft,
        isAdjusted,
      };
      sessionStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(state));
    }
  }, [open, step, goalData, selectedTemplateId, budgetDraft, isAdjusted]);

  // 상태 리셋
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        const saved = sessionStorage.getItem(BUDGET_STORAGE_KEY);
        if (saved) return;

        setStep(1);
        setSelectedTemplateId('keep-pattern');
        setBudgetDraft([]);
        setIsAdjusted(false);
        setGoalData({
          income: initialIncome,
          savingsAmount: Math.floor(initialIncome * 0.2),
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, initialIncome]);

  // 완료 혹은 취소 시 스토리지 비우기
  const clearSession = () => sessionStorage.removeItem(BUDGET_STORAGE_KEY);

  return {
    state: { step, goalData, isAdjusted, selectedTemplateId, budgetDraft },
    setStep,
    setGoalData,
    setIsAdjusted,
    setSelectedTemplateId,
    setBudgetDraft,
    clearSession,
  };
};
