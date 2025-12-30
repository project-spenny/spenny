'use client';

import { useEffect, useState } from 'react';

import { ITransaction } from '@/types/transactions';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

type ExpenseState = {
  current: ITransaction[];
  prev: ITransaction[];
};

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const [expenseData, setExpenseData] = useState<ExpenseState>({
    current: [],
    prev: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const lastMonthDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() - 1,
    1
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);

        const { startDate, endDate } = getMonthRange(selectedDate);
        const { startDate: prevStart, endDate: prevEnd } =
          getMonthRange(lastMonthDate);

        // Supabase에서 현재 로그인한 유저 정보 가져오기
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!user || authError) {
          toast.warning('로그인이 필요합니다');
          setIsLoading(false);
          return;
        }

        // 지출(expense) 타입이고, 해당 기간 내에 작성된 현재 유저의 기록만 조회
        const [currentMonthRes, lastMonthRes] = await Promise.all([
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate),
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'expense')
            .gte('date', prevStart)
            .lte('date', prevEnd),
        ]);

        if (currentMonthRes.error) throw currentMonthRes.error;
        if (lastMonthRes.error) throw lastMonthRes.error;

        setExpenseData({
          current: currentMonthRes.data || [],
          prev: lastMonthRes.data || [],
        });
      } catch (err) {
        console.error('데이터 호출 중 오류 발생', err);
        toast('데이터를 불러오는 데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [selectedDate]);

  const { current, prev } = expenseData;

  const totalAmount = current.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const lastMonthTotal = prev.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const diff = totalAmount - lastMonthTotal;

  return (
    <div className="px-4 py-2">
      <div className="text-xl font-bold">
        총 지출
        <div>
          <span className="text-red-400">{totalAmount.toLocaleString()}</span>원
        </div>
      </div>

      <div>
        지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
        {diff > 0 ? '더 썼어요' : '아꼈어요'}
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
