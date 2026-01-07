import { CategoryAnalysis, TransactionType } from '@/types/analysis';
import { formatLocalDate, getMonthRange, minDate } from '@/utils/date';
import { useEffect, useMemo, useState } from 'react';

import { ITransaction } from '@/types/transactions';
import { getCurrentUser } from '@/services/analysis/budgetService';
import { supabase } from '@/utils/supabase/client';
import { syncByMonthClient } from '@/services/fixed-costs/syncFixedTransactions.client';
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

export const useAnalysisData = (selectedDate: Date, type: TransactionType) => {
  const [data, setData] = useState<AnalysisState>({
    current: [],
    prev: [],
  });
  const { current, prev } = data;
  const [isLoading, setIsLoading] = useState(true);
  const typeLabel = type === 'expense' ? '지출' : '수입';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 현재 로그인한 유저 정보 가져오기
        const user = await getCurrentUser();

        const { startDate, endDate } = getMonthRange(selectedDate);
        const lastMonthDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() - 1,
          1
        );
        const { startDate: prevStart, endDate: prevEnd } =
          getMonthRange(lastMonthDate);

        // 분석 데이터 조회 전에 해당 월의 고정비 거래를 먼저 동기화
        const today = formatLocalDate(new Date());
        const lastMonthThrough = minDate(prevEnd, today);

        await Promise.all([
          syncByMonthClient(selectedDate, today), // 현재 달 : 오늘까지 생성
          syncByMonthClient(lastMonthDate, lastMonthThrough), // 이전 달 : 오늘(or 월말)까지 생성
        ]);

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

        setData({
          current: currentMonthRes.data || [],
          prev: prevMonthRes.data || [],
        });
      } catch (err) {
        console.error(`[${typeLabel} 내역 조회 실패]`, err);

        const message =
          err instanceof Error
            ? err.message
            : '내역을 불러오는 중 문제가 발생했습니다.';
        toast.warning(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, type]);

  const { totalAmount, prevAmount, categoryData, categoryTotalsByKey } =
    useMemo(() => {
      // 현재/이전 달 총액 계산
      const currentTotal = current.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      const lastTotal = prev.reduce((sum, item) => sum + (item.amount || 0), 0);

      // 카테고리 ID별 합계를 담을 객체
      const totalsByKey: Record<string, number> = {};

      // 카테고리별 그룹화 및 합계 계산
      const grouped = current.reduce<CategoryGroup>((acc, item) => {
        const categoryName = item.categories?.name_ko || '기타';
        const categoryKey = item.categories?.category_key;

        // 카테고리가 첫 등장이면 0으로 초기화
        if (!acc[categoryName]) acc[categoryName] = 0;
        // 거래 금액 합산 (누적)
        acc[categoryName] += item.amount || 0;

        if (categoryKey) {
          totalsByKey[categoryKey] =
            (totalsByKey[categoryKey] || 0) + (item.amount || 0);
        }

        return acc;
      }, {});

      // 배열 변환 및 정렬, 비율 계산
      const sortedCategoryData: CategoryAnalysis[] = Object.entries(grouped)
        .map(([name, amount]) => ({
          name,
          amount,
          percentage: currentTotal > 0 ? (amount / currentTotal) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      return {
        totalAmount: currentTotal,
        prevAmount: lastTotal,
        categoryData: sortedCategoryData,
        categoryTotalsByKey: totalsByKey,
      };
    }, [current, prev]);

  const diff = totalAmount - prevAmount;

  return {
    current: current,
    prev: prev,
    totalAmount,
    diff,
    isLoading,
    categoryData,
    categoryTotalsByKey,
  };
};
