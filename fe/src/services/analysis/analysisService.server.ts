import { formatLocalDate, getMonthRange } from '@/utils/date';
import {
  normalizeTransactionCategory,
  transformAnalysisData,
} from '@/utils/analysis-transform';

import { SupabaseClient } from '@supabase/supabase-js';
import { TransactionType } from '@/types/analysis';
import { syncByMonthServer } from '@/services/fixed-costs/syncFixedTransactions.server';

// 고정비 동기화 실패 시 에러를 던지지 않고 경고만 남김 (동기화 실패해도 조회는 가능하도록)
const safeSyncServer = async (params: {
  monthDate: Date;
  startDate: string;
  endDate: string;
  generateThroughDate?: string;
}) => {
  try {
    return await syncByMonthServer(params);
  } catch (error) {
    console.warn(
      `[FixedSync] ${params.monthDate.getMonth() + 1}월 동기화 실패:`,
      error
    );
  }
};

export const getAnalysisData = async (
  supabase: SupabaseClient,
  userId: string,
  selectedDate: Date,
  type: TransactionType
) => {
  try {
    // 날짜 범위 계산
    const { startDate, endDate } = getMonthRange(selectedDate);
    const lastMonthDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1,
      1
    );
    const { startDate: prevStart, endDate: prevEnd } =
      getMonthRange(lastMonthDate);

    // 고정비 동기화
    const today = formatLocalDate(new Date());
    await Promise.all([
      // 지난 달: 전체 기간 동기화
      safeSyncServer({
        monthDate: lastMonthDate,
        startDate: prevStart,
        endDate: prevEnd,
      }),
      // 이번 달: 오늘 날짜까지만 동기화
      safeSyncServer({
        monthDate: selectedDate,
        startDate,
        endDate,
        generateThroughDate: today,
      }),
    ]);

    // 데이터 조회 (지난달 시작일 ~ 이번달 종료일)
    const { data, error } = await supabase
      .from('transactions')
      .select(
        `amount, date, type, category_id, category:categories!category_id (
          name_ko,
          category_key
        )`
      )
      .eq('user_id', userId)
      .eq('type', type)
      .gte('date', prevStart)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;

    const normalized = normalizeTransactionCategory(data);

    // 이번 달과 지난 달 데이터 분리
    const current = normalized.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );
    const prev = normalized.filter(
      (t) => t.date >= prevStart && t.date <= prevEnd
    );

    return {
      current,
      prev,
      ...transformAnalysisData(current, prev), // 가공 데이터
    };
  } catch (error) {
    throw new Error(`[getAnalysisData] 분석 데이터 조회 실패 (type: ${type})`, {
      cause: error,
    });
  }
};
