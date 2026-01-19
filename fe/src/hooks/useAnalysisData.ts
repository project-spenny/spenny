import { TransactionAnalysis, TransactionType } from '@/types/analysis';
import { formatLocalDate, getMonthRange, minDate } from '@/utils/date';
import { useEffect, useMemo, useState } from 'react';

import { fetchTransactionByRange } from '@/services/analysis/analysisService';
import { syncByMonthClient } from '@/services/fixed-costs/syncFixedTransactions.client';
import { toast } from 'sonner';
import { transformAnalysisData } from '@/utils/analysis-transform';
import { useAuth } from '@/providers/AuthProvider';

type AnalysisState = {
  current: TransactionAnalysis[];
  prev: TransactionAnalysis[];
};

const safeSyncTransactions = async (
  userId: string,
  date: Date,
  through: string
) => {
  try {
    await syncByMonthClient(userId, date, through);
  } catch (err) {
    console.warn(`${date.getMonth() + 1}월 고정비 동기화 실패:`, err);
  }
};

export const useAnalysisData = (selectedDate: Date, type: TransactionType) => {
  const { userId, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<AnalysisState>({
    current: [],
    prev: [],
  });
  const { current, prev } = data;
  const [isLoading, setIsLoading] = useState(true);
  const typeLabel = type === 'expense' ? '지출' : '수입';

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!userId) return;

      try {
        setIsLoading(true);

        // 날짜 범위 계산
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
          safeSyncTransactions(userId, selectedDate, today), // 현재 달 : 오늘까지 생성
          safeSyncTransactions(userId, lastMonthDate, lastMonthThrough), // 이전 달 : 오늘(or 월말)까지 생성
        ]);

        // 서비스 함수 호출
        const [currentMonthRes, prevMonthRes] = await Promise.all([
          fetchTransactionByRange(userId, type, startDate, endDate),
          fetchTransactionByRange(userId, type, prevStart, prevEnd),
        ]);

        setData({
          current: currentMonthRes,
          prev: prevMonthRes,
        });
      } catch (err) {
        console.error(`[${typeLabel} 내역 조회 실패]`, err);

        const message =
          err instanceof Error
            ? err.message
            : `${typeLabel} 내역을 불러오는 중 문제가 발생했습니다.`;
        toast.warning(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authLoading, userId, selectedDate, type]);

  // 공통 가공 함수 호출
  const analysisResult = useMemo(
    () => transformAnalysisData(data.current, data.prev),
    [data.current, data.prev]
  );

  return {
    current: current,
    prev: prev,
    isLoading,
    ...analysisResult,
  };
};
