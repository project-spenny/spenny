import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown } from 'lucide-react';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading } = useAnalysisData(
    selectedDate,
    'expense'
  );

  return (
    <AnalysisSection
      title="월별 지출"
      icon={<TrendingDown className="text-red-400" />}
    >
      <div className="px-2 py-4">
        {isLoading ? (
          // 로딩 중
          <div className="space-y-3">
            <Skeleton className="bg-accent-foreground/10 h-7 w-36" />
            <Skeleton className="bg-accent-foreground/10 h-5 w-48" />
          </div>
        ) : current.length === 0 ? (
          // 이번 달 지출이 없는 경우
          <AnalysisEmpty
            title="이번 달 지출이 없어요!"
            description="지출을 기록하고 소비 습관을 파악해 보세요."
          />
        ) : (
          // 이번 달 지출이 있는 경우
          <>
            {/* 이번 달 총 지출 */}
            <div className="text-lg font-bold">
              총 지출{' '}
              <span className="text-red-400">
                {totalAmount.toLocaleString()}
              </span>
              원
            </div>

            {/* 지난 달과 비교 */}
            <div className="mt-2 text-base font-medium">
              {prev.length === 0 ? (
                // 지난 달 지출이 없는 경우
                <p>이전 달 지출 내역이 없어요!</p>
              ) : (
                // 두 달 모두 지출이 있는 경우
                <p>
                  지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
                  {diff > 0
                    ? '더 썼어요'
                    : diff < 0
                      ? '아꼈어요'
                      : '똑같이 썼어요'}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AnalysisSection>
  );
};

export default ExpenseAnalysis;
