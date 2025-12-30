import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const IncomeAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading } = useAnalysisData(
    selectedDate,
    'income'
  );

  return (
    <AnalysisSection
      title="월별 수입"
      icon={<TrendingUp className="text-blue-400" />}
    >
      <div className="px-2 py-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="bg-accent-foreground/10 h-7 w-36" />
            <Skeleton className="bg-accent-foreground/10 h-5 w-48" />
          </div>
        ) : current.length === 0 ? (
          <AnalysisEmpty
            title="이번 달 수입이 없어요!"
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
