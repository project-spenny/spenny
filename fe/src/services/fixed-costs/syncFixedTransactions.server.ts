import { createClient } from '@/utils/supabase/server';
import { syncByMonthShared } from './syncFixedTransactions.shared';

// 서버 환경에서 고정비 규칙 기반 월별 거래 동기화
export const syncByMonthServer = async ({
  monthDate,
  startDate,
  endDate,
}: {
  monthDate: Date;
  startDate: string;
  endDate: string;
}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  return syncByMonthShared(
    {
      // 해당 월에 유효한 활성 고정비 규칙 조회
      fetchActiveRules: async ({ userId, startDate, endDate }) => {
        const { data, error } = await supabase
          .from('fixed_rules')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .lte('start_date', endDate)
          .or(`end_date.is.null,end_date.gte.${startDate}`);

        if (error) throw error;
        return data ?? [];
      },

      // 이미 생성된 거래 조회 후 key Set 반환
      fetchExistingKeys: async ({ userId, ruleIds, startDate, endDate }) => {
        const { data, error } = await supabase
          .from('transactions')
          .select('fixed_rule_id, date')
          .eq('user_id', userId)
          .in('fixed_rule_id', ruleIds)
          .gte('date', startDate)
          .lte('date', endDate);

        if (error) throw error;
        return new Set(
          (data ?? []).map((t) => `${t.fixed_rule_id}__${t.date}`)
        );
      },

      // 누락된 거래만 transactions에 insert
      insertTransactions: async ({ rows }) => {
        const { error } = await supabase.from('transactions').insert(rows);
        if (error) throw error;
      },
    },
    { userId: user.id, monthDate, startDate, endDate }
  );
};
