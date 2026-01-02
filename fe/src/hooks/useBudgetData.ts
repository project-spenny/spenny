import { useEffect, useState } from 'react';

import { Budget } from '@/types/analysis';
import { fetchBudgets } from '@/services/analysis/budgetService';
import { toast } from 'sonner';

const useBudgetData = (selectedDate: Date) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const data = await fetchBudgets(selectedDate);

        console.log(data); // 테스트용
        setBudgets(data || []);
      } catch (err) {
        console.error('[useBudget] 로딩 실패:', err);
        const message =
          err instanceof Error ? err.message : '예산을 불러오지 못했습니다.';
        toast.warning(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  return { budgets, isLoading };
};

export default useBudgetData;
