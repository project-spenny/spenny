import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const PercentageBadge = ({ percentage }: { percentage: number }) => {
  // 100% 초과
  const isOver = percentage > 100;
  // 90% 이상
  const isWarning = percentage >= 90;

  // 표시 텍스트 (100% 넘으면 +100%, 아니면 원래 퍼센트)
  const displayValue = isOver ? '+100%' : `${percentage}%`;

  return (
    <Badge
      className={cn(
        'px-1.5 py-0.5 text-[10px] font-semibold transition-colors',
        isWarning
          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
          : 'bg-brand-subtle dark:bg-brand/10 text-brand hover:bg-brand-subtle/80'
      )}
    >
      {displayValue}
    </Badge>
  );
};

export default PercentageBadge;
