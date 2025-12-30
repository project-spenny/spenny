import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import { Skeleton } from '@/components/ui/skeleton';

type MonthlyAmountProps = {
  isLoading: boolean;
  type: 'expense' | 'income';
  currentCount: number;
  prevCount: number;
  totalAmount: number;
  diff: number;
};

const MonthlyAmount = ({
  isLoading,
  type,
  currentCount,
  prevCount,
  totalAmount,
  diff,
}: MonthlyAmountProps) => {
  const typeLabel = type === 'expense' ? '지출' : '수입';
  const typeColor = type === 'expense' ? 'text-red-400' : 'text-blue-500';

  const getDiffText = () => {
    if (diff > 0) return type === 'expense' ? '더 썼어요' : '더 벌었어요';
    if (diff < 0) return type === 'expense' ? '아꼈어요' : '적게 벌었어요';
    return '지난 달과 똑같아요';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="bg-accent-foreground/10 h-7 w-36" />
        <Skeleton className="bg-accent-foreground/10 h-5 w-48" />
      </div>
    );
  }

  if (currentCount === 0) {
    return (
      <AnalysisEmpty
        title={`이번 달 ${typeLabel}이 없어요!`}
        description={
          type === 'expense'
            ? `${typeLabel}을 기록하고 소비 습관을 파악해보세요`
            : '월급이나 부수입을 기록해보세요'
        }
      />
    );
  }

  return (
    <>
      <div className="text-lg font-bold">
        총 {typeLabel}{' '}
        <span className={typeColor}>{totalAmount.toLocaleString()}</span>원
      </div>

      <div className="mt-2 text-base font-medium">
        {prevCount === 0 ? (
          <p>이전 달 수입 내역이 없어요!</p>
        ) : (
          <p>
            지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
            {getDiffText()}
          </p>
        )}
      </div>
    </>
  );
};

export default MonthlyAmount;
