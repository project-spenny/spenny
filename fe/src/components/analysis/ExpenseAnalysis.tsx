'use client';

import { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { ITransaction } from '@/types/transactions';
import Link from 'next/link';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

type ExpenseState = {
  current: ITransaction[];
  prev: ITransaction[];
};

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const [expenseData, setExpenseData] = useState<ExpenseState>({
    current: [],
    prev: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
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
            .eq('type', 'expense')
            .gte('date', startDate)
            .lte('date', endDate),
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'expense')
            .gte('date', prevStart)
            .lte('date', prevEnd),
        ]);

        if (currentMonthRes.error) throw currentMonthRes.error;
        if (lastMonthRes.error) throw lastMonthRes.error;

        setExpenseData({
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

    fetchExpenses();
  }, [selectedDate]);

  const { current, prev } = expenseData;

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
    <div className="px-4 py-2">
      {/* 이번 달 총 지출 */}
      <div className="text-xl font-bold">
        총 지출
        <div>
          <span className="text-red-400">{totalAmount.toLocaleString()}</span>원
        </div>
      </div>

      {/* 지난 달과 비교 */}
      <div className="mt-2 text-base font-medium">
        {current.length === 0 ? (
          // 이번 달 지출이 없을 경우
          <>
            <p>이번 달은 아직 지출 내역이 없어요! </p>
            <Button asChild className="mt-2">
              <Link href={'/'}>기록하러 가기</Link>
            </Button>
          </>
        ) : prev.length === 0 ? (
          // 이번 달 지출은 있지만, 지난 달 지출 데이터가 없을 경우
          <p>이전 달 지출 내역이 없어요!</p>
        ) : (
          // 두 달 모두 지출 데이터가 있을 경우
          <p>
            지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
            {diff > 0 ? '더 썼어요' : diff < 0 ? '아꼈어요' : '똑같이 썼어요'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalysis;
