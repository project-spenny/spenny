import { useEffect, useState } from 'react';

import { ITransaction } from '@/types/transactions';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

export const useAnalysisData = (
  selectedDate: Date,
  type: 'expense' | 'income'
) => {
  const [data, setData] = useState<{
    current: ITransaction[];
    prev: ITransaction[];
  }>({
    current: [],
    prev: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { startDate, endDate } = getMonthRange(selectedDate);
        const lastMonthDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() - 1,
          1
        );
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

        // 지출(expense) 또는 수입(income) 타입이고, 해당 기간 내에 작성된 현재 유저의 기록만 조회
        const [currentMonthRes, prevMonthRes] = await Promise.all([
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', type)
            .gte('date', startDate)
            .lte('date', endDate),
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', type)
            .gte('date', prevStart)
            .lte('date', prevEnd),
        ]);

        if (currentMonthRes.error) throw currentMonthRes.error;
        if (prevMonthRes.error) throw prevMonthRes.error;

        setData({
          current: currentMonthRes.data || [],
          prev: prevMonthRes.data || [],
        });
      } catch (err) {
        console.error(`[${type} 내역 조회 실패]`, err);
        toast.error(
          `${type} 내역을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, type]);

  const totalAmount = data.current.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const prevAmount = data.prev.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const diff = totalAmount - prevAmount;

  return {
    current: data.current,
    prev: data.prev,
    totalAmount,
    diff,
    isLoading,
  };
};
