'use client';

import { useEffect, useState } from 'react';

import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { ExpenseState } from './ExpenseAnalysis';
import { PiggyBank } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

const IncomeAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const [incomeData, setIncomeData] = useState<ExpenseState>({
    current: [],
    prev: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
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

        // 지출(expense) 타입이고, 해당 기간 내에 작성된 현재 유저의 기록만 조회
        const [currentMonthRes, lastMonthRes] = await Promise.all([
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'income')
            .gte('date', startDate)
            .lte('date', endDate),
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'income')
            .gte('date', prevStart)
            .lte('date', prevEnd),
        ]);

        if (currentMonthRes.error) throw currentMonthRes.error;
        if (lastMonthRes.error) throw lastMonthRes.error;

        setIncomeData({
          current: currentMonthRes.data || [],
          prev: lastMonthRes.data || [],
        });
      } catch (err) {
        console.error('[지출 내역 조회 실패]', err);
        toast.error(
          '지출 내역을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncome();
  }, [selectedDate]);

  const { current, prev } = incomeData;

  const totalAmount = current.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const lastMonthTotal = prev.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const diff = totalAmount - lastMonthTotal;

  return (
    <AnalysisSection
      title="월별 수입"
      icon={<PiggyBank className="text-blue-400" />}
    >
      <div className="px-2 py-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="bg-accent-foreground/10 h-7 w-36" />
            <Skeleton className="bg-accent-foreground/10 h-5 w-48" />
          </div>
        ) : current.length === 0 ? (
          <AnalysisEmpty
            title="이번 달은 수입 내역이 없어요!"
            description="월급이나 부수입을 기록해 보세요."
          />
        ) : (
          <>
            <div className="text-lg font-bold">
              총 수입{' '}
              <span className="text-blue-400">
                {totalAmount.toLocaleString()}
              </span>
              원
            </div>
            <div className="mt-2 text-base font-medium">
              {prev.length === 0 ? (
                <p>이전 달 수입 내역이 없어요!</p>
              ) : (
                <p>
                  지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
                  {diff > 0
                    ? '더 벌었어요!'
                    : diff < 0
                      ? '적게 벌었어요'
                      : '똑같아요'}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AnalysisSection>
  );
};

export default IncomeAnalysis;
