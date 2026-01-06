import {
  deleteBudgets,
  fetchBudgets,
  upsertBudget,
  upsertCategoryBudgets,
} from '@/services/analysis/budgetService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { formatMonth } from '@/utils/date';
import { toast } from 'sonner';

const useBudgetData = (selectedDate: Date) => {
  const queryClient = useQueryClient();
  const monthKey = formatMonth(selectedDate); // 로컬 시간대 기준 'YYYY-MM' 문자열 생성

  // 조회
  const { data, isLoading } = useQuery({
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
    isLoading,
    isSaving,
    saveBudget,
    isDeleting,
    removeBudget,
    isSavingCategories,
    saveCategoryBudgets,
  };
};

export default useBudgetData;
