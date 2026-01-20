import { formatLocalDate, getMonthRange } from '@/utils/date';
import {
  normalizeBudgetCategory,
  normalizeTransactionCategory,
  transformBudgetGuideData,
} from '@/utils/analysis-transform';

import { requireUserServer } from '@/utils/supabase/requireUserServer';

// 특정 월의 예산 데이터 조회
export const getBudgetData = async (selectedDate: Date) => {
  try {
    const { supabase, user } = await requireUserServer();

    const { startDate } = getMonthRange(selectedDate);

    const { data, error } = await supabase
      .from('budgets')
      .select(
        `id, amount, budget_month, category_id, category:categories!category_id (
        name_ko,
        category_key
      )`
      )
      .eq('user_id', user.id)
      .eq('budget_month', startDate);

    if (error) throw error;

    return normalizeBudgetCategory(data);
  } catch (error) {
    throw new Error('[getBudgetData] 예산 데이터 조회 실패', {
      cause: error,
    });
  }
};

// 예산 설정을 위한 가이드 데이터 조회
export const getBudgetGuideData = async (
  selectedDate: Date,
  targetSaving: number = 0
) => {
  try {
    const { supabase, user } = await requireUserServer();

    // 전월 날짜 계산
    const prevMonthStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1,
      1
    );
    const prevMonthEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      0
    );
    // 3개월 전 날짜
    const threeMonthsStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 3,
      1
    );

    const [incomeRes, expenseRes] = await Promise.all([
      // 지난달 수입 합계를 위한 조회
      supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .gte('date', formatLocalDate(prevMonthStart))
        .lte('date', formatLocalDate(prevMonthEnd)),

      // 최근 3개월 지출 내역 조회 (카테고리 정보 포함)
      supabase
        .from('transactions')
        .select(
          `amount, date, type, category_id, category:categories!category_id (
              name_ko,
              category_key
            )
          `
        )
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', formatLocalDate(threeMonthsStart))
        .lte('date', formatLocalDate(prevMonthEnd))
        .order('date', { ascending: false }),
    ]);

    if (incomeRes.error) throw incomeRes.error;
    if (expenseRes.error) throw expenseRes.error;

    const normalized = normalizeTransactionCategory(expenseRes.data);

    const lastMonthIncome = incomeRes.data.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return transformBudgetGuideData(normalized, lastMonthIncome, targetSaving);
  } catch (error) {
    throw new Error('[getBudgetGuideData] 예산 가이드 데이터 조회 실패', {
      cause: error,
    });
  }
};
