import { ANALYSIS_CONFIG } from '@/constants/analysis';

type MonthlyAmountProps = {
  type: 'expense' | 'income';
  prevCount: number;
  totalAmount: number;
  diff: number;
};

const MonthlyAmount = ({
  type,
  prevCount,
  totalAmount,
  diff,
}: MonthlyAmountProps) => {
  const config = ANALYSIS_CONFIG[type];

  return (
    <>
      <div className="text-lg font-bold">
        총 {config.label}{' '}
        <span className={config.color}>{totalAmount.toLocaleString()}</span>원
      </div>

      <div className="mt-2 text-base font-medium">
        {prevCount === 0 ? (
          <p>이전 달 {config.label} 내역이 없어요!</p>
        ) : diff === 0 ? (
          <p>지난 달과 총 {config.label} 금액이 똑같아요!</p>
        ) : (
          <p>
            지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
            {diff > 0 ? config.increaseText : config.decreaseText}
          </p>
        )}
      </div>
    </>
  );
};

export default MonthlyAmount;
