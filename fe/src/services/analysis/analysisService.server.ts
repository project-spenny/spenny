import { TransactionAnalysis, TransactionType } from '@/types/analysis';

import { createClient } from '@/utils/supabase/server';
import { getMonthRange } from '@/utils/date';
import { transformAnalysisData } from '@/utils/analysis-transform';

export const getAnalysisData = async (
  selectedDate: Date,
  type: TransactionType
) => {
  const supabase = await createClient();

  // 유저 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No User');

  // 날짜 범위 계산
  const { startDate, endDate } = getMonthRange(selectedDate);
  const lastMonthDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() - 1,
    1
  );
  const { startDate: prevStart, endDate: prevEnd } =
    getMonthRange(lastMonthDate);

  // 데이터 조회 (지난달 시작일 ~ 이번달 종료일)
  const { data, error } = await supabase
    .from('transactions')
    .select(
      `amount, date, type, category_id, category:categories!category_id (
          name_ko,
          category_key
        )`
    )
    .eq('user_id', user.id)
    .eq('type', type)
    .gte('date', prevStart)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;

  const normalized: TransactionAnalysis[] = (data ?? []).map((t) => ({
    ...t,
    category: Array.isArray(t.category) // category가 배열인지 검사
      ? (t.category[0] ?? null)
      : (t.category ?? null),
  }));

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
};
