'use client';

import { useEffect, useState } from 'react';

import { ITransaction } from '@/types/transactions';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const [expenses, setExpenses] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);

        const { startDate, endDate } = getMonthRange(selectedDate);

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
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('date', startDate)
          .lte('date', endDate);

        if (error) throw error;

        console.log(data);
        setExpenses(data || []);
      } catch (err) {
        console.error('데이터 호출 중 오류 발생', err);
        toast('데이터를 불러오는 데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [selectedDate]);

  const totalAmount =
    expenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  return (
    <div className="px-4 py-2">
      <div className="text-xl font-bold">
        총 지출
        <div>
          <span className="text-red-400">{totalAmount.toLocaleString()}</span>원
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
