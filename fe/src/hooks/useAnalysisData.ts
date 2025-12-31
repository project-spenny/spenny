import { useEffect, useState } from 'react';

import { ITransaction } from '@/types/transactions';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface ITransactionWithCategory extends ITransaction {
  categories: {
    name_ko: string;
    category_key: string;
  } | null;
}

type AnalysisState = {
  current: ITransactionWithCategory[];
  prev: ITransactionWithCategory[];
};

// 카테고리 명: 값(합계 금액)
type CategoryGroup = {
  [key: string]: number;
};

export const useAnalysisData = (
  selectedDate: Date,
  type: 'expense' | 'income'
) => {
  const [data, setData] = useState<AnalysisState>({
    current: [],
    prev: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const typeLabel = type === 'expense' ? '지출' : '수입';

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
            .select(
              `
                *,
                categories!category_id (
                  name_ko,
                  category_key
                )
              `
            )
            .eq('user_id', user.id)
            .eq('type', type)
            .gte('date', startDate)
            .lte('date', endDate),
          supabase
            .from('transactions')
            .select(
              `
                *,
                categories!category_id (
                  name_ko,
                  category_key
                )
              `
            )
            .eq('user_id', user.id)
            .eq('type', type)
            .gte('date', prevStart)
            .lte('date', prevEnd),
        ]);

        if (currentMonthRes.error) throw currentMonthRes.error;
        if (prevMonthRes.error) throw prevMonthRes.error;

        console.log(currentMonthRes.data);
        setData({
          current: currentMonthRes.data || [],
          prev: prevMonthRes.data || [],
        });
      } catch (err) {
        console.error(`[${typeLabel} 내역 조회 실패]`, err);
        toast.error(
          `${typeLabel} 내역을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`
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

  // 카테고리별 그룹화 및 합계 계산
  const grouped = data.current.reduce<CategoryGroup>((acc, item) => {
    const categoryName = item.categories?.name_ko || '기타';

    // 카테고리가 첫 등장이면 0으로 초기화
    if (!acc[categoryName]) acc[categoryName] = 0;

    // 거래 금액 합산 (누적)
    acc[categoryName] += item.amount || 0;

    return acc;
  }, {});

  console.log(grouped);

  return {
    current: data.current,
    prev: data.prev,
    totalAmount,
    diff,
    isLoading,
  };
};
