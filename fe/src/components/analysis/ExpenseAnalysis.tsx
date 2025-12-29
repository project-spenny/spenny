'use client';

import { useEffect, useState } from 'react';

import { ITransaction } from '@/types/transactions';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const [expenses, setExpenses] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;

        const formatMonth = String(month).padStart(2, '0');
        const lastDay = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜(숫자)

        // 'YYYY-MM-DD' 형식의 문자열 생성
        const startDate = `${year}-${formatMonth}-01`;
        const endDate = `${year}-${formatMonth}-${lastDay}`;

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

  return (
    <div>
      <div>{selectedDate.getMonth() + 1}월</div>
      <div>총 지출 0원</div>
    </div>
  );
};

export default ExpenseAnalysis;
