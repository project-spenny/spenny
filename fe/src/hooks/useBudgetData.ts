import {
  deleteBudgets,
  fetchBudgets,
  upsertBudget,
  upsertCategoryBudgets,
} from '@/services/analysis/budgetService';
import { formatLocalDate, formatMonth } from '@/utils/date';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchFixedRulesByMonth } from '@/services/fixed-costs/fixed-costs';
import { getFixedRuleDates } from '@/services/fixed-costs/getRuleDates';
import { toast } from 'sonner';
import { useMemo } from 'react';

const useBudgetData = (selectedDate: Date) => {
  const queryClient = useQueryClient();
  const monthKey = formatMonth(selectedDate); // 로컬 시간대 기준 'YYYY-MM' 문자열 생성

  // 조회
  const { data, isLoading: isBudgetLoading } = useQuery({
    // 연-월이 바뀔 때마다 자동으로 새로운 데이터 fetch
    queryKey: ['budgets', monthKey],
    queryFn: () => fetchBudgets(selectedDate),
    select: (data) => {
      const totalBudget =
        data?.find((item) => item.category_id === null) || null;
      const categoryBudgets =
        data?.filter((item) => item.category_id !== null) || [];

      return { totalBudget, categoryBudgets };
    },
  });

  // 고정비 규칙 조회
  const { data: fixedRules = [], isLoading: isFixedLoading } = useQuery({
    queryKey: ['fixedRules', monthKey],
    queryFn: () => fetchFixedRulesByMonth(selectedDate),
  });

  const futureFixedAmount = useMemo(() => {
    const today = formatLocalDate(new Date()); // 오늘 날짜 문자열 (YYYY-MM-DD)

    return fixedRules.reduce((total, rule) => {
      // 해당 규칙의 이번 달 발생 날짜들 계산
      const futureDates = getFixedRuleDates(rule, selectedDate).filter(
        // 오늘 이후(미래) 날짜만 필터링
        (date) => date > today
      );

      return total + rule.amount * futureDates.length; // (금액 * 미래 발생 횟수) 더하기
    }, 0);
  }, [fixedRules, selectedDate]);

  // 저장/수정
  const { mutate: saveBudget, isPending: isSaving } = useMutation({
    mutationFn: ({
      amount,
      categoryId,
    }: {
      amount: number;
      categoryId: string | null;
    }) => upsertBudget(selectedDate, amount, categoryId),
    onSuccess: () => {
      // 저장 성공 시 해당 달의 예산 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['budgets', monthKey] });
      toast.success('예산이 저장 되었습니다.');
    },
    onError: () => {
      toast.error('예산 저장 중 오류가 발생했습니다.');
    },
  });

  // 카테고리별 예산 일괄 저장
  const { mutate: saveCategoryBudgets, isPending: isSavingCategories } =
    useMutation({
      mutationFn: (categoryData: { categoryId: string; amount: number }[]) =>
        upsertCategoryBudgets(selectedDate, categoryData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets', monthKey] });
        toast.success('카테고리별 예산이 모두 저장되었습니다.');
      },
      onError: () => {
        toast.error('카테고리 예산 저장 중 오류가 발생했습니다.');
      },
    });

  // 삭제
  const { mutate: removeBudget, isPending: isDeleting } = useMutation({
    mutationFn: (categoryId: string | string[] | null) =>
      deleteBudgets(selectedDate, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', monthKey] });
      toast.success('예산이 초기화 되었습니다.');
    },
    onError: () => {
      toast.error('예산 초기화 중 오류가 발생했습니다.');
    },
  });

  return {
    totalBudget: data?.totalBudget ?? null,
    categoryBudgets: data?.categoryBudgets ?? [],
    futureFixedAmount,
    isLoading: isBudgetLoading || isFixedLoading,
    isSaving,
    saveBudget,
    isDeleting,
    removeBudget,
    isSavingCategories,
    saveCategoryBudgets,
  };
};

export default useBudgetData;
