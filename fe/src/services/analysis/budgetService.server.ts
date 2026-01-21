import { formatLocalDate, getMonthRange } from '@/utils/date';
import {
  normalizeBudgetCategory,
  normalizeTransactionCategory,
  transformBudgetGuideData,
} from '@/utils/analysis-transform';

import { SupabaseClient } from '@supabase/supabase-js';
import { getAnalysisData } from '@/services/analysis/analysisService.server';
import { getCategories } from '@/services/categoryService.server';
import { requireUserServer } from '@/utils/supabase/requireUserServer';

// 특정 월의 예산 데이터 조회
export const getBudgetData = async (
  supabase: SupabaseClient,
  userId: string,
  selectedDate: Date
) => {
  try {
    const { startDate } = getMonthRange(selectedDate);

    const { data, error } = await supabase
      .from('budgets')
      .select(
        `id, amount, budget_month, category_id, category:categories!category_id (
        name_ko,
        category_key
      )`
      )
      .eq('user_id', userId)
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
  supabase: SupabaseClient,
  userId: string,
  selectedDate: Date,
  targetSaving: number = 0
) => {
  try {
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
        .eq('user_id', userId)
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
        .eq('user_id', userId)
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

// 예산 탭에 필요한 모든 데이터를 한 번에 조회하는 번들 함수
export const getBudgetBundle = async (date: Date) => {
  const { supabase, user } = await requireUserServer(); // 인증 1회 수행

  // 모든 서비스 함수에 동일한 supabase, user.id 주입
  const [budgetData, budgetGuideData, analysisData, categories] =
    await Promise.all([
      getBudgetData(supabase, user.id, date),
      getBudgetGuideData(supabase, user.id, date),
      getAnalysisData(supabase, user.id, date, 'expense'),
      getCategories(supabase, 'expense'),
    ]);

  return {
    budgetData,
    budgetGuideData,
    analysisData: {
      totalAmount: analysisData.totalAmount,
      categoryTotalsByKey: analysisData.categoryTotalsByKey,
      transactions: analysisData.current,
    },
    categories,
  };
};
