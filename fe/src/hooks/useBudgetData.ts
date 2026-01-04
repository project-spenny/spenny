import { useEffect, useState } from 'react';

import { Budget } from '@/types/analysis';
import { fetchBudgets } from '@/services/analysis/budgetService';
import { toast } from 'sonner';

const useBudgetData = (selectedDate: Date) => {
  const [totalBudget, setTotalBudget] = useState<Budget | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const data = await fetchBudgets(selectedDate);

        if (data) {
          // category_id가 null이면 총 예산
          const total = data.find((item) => item.category_id === null);
          // category_id가 null이 아니면 카테고리별 예산
          const categories = data.filter((item) => item.category_id !== null);

          setTotalBudget(total || null);
          setCategoryBudgets(categories);
        }
        console.log(data); // 테스트용
      } catch (err) {
        console.error('예산 불러오기 실패:', err);
        const message =
          err instanceof Error ? err.message : '예산을 불러오지 못했습니다.';
        toast.warning(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  return { totalBudget, categoryBudgets, isLoading };
};

export default useBudgetData;
