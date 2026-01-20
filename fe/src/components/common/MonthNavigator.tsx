import { ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MonthNavigatorProps = {
  year: number;
  month: number;
  baseUrl: string;
};

const MonthNavigator = ({ year, month, baseUrl }: MonthNavigatorProps) => {
  // 이전 달, 다음 달 계산 로직
  const prevDate = new Date(year, month - 2);
  const nextDate = new Date(year, month);

  const prevQuery = `?year=${prevDate.getFullYear()}&month=${prevDate.getMonth() + 1}`;
  const nextQuery = `?year=${nextDate.getFullYear()}&month=${nextDate.getMonth() + 1}`;

  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-10">
      <span className="text-brand font-bold">{year}</span>

      <div className="flex items-center justify-center gap-3">
        <Link
          href={`${baseUrl}${prevQuery}`}
          aria-label="이전 달"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'hover:bg-brand/10'
          )}
          prefetch={false}
        >
          <ChevronLeft />
        </Link>

        <span className="text-2xl font-bold">{month}월</span>

        <Link
          href={`${baseUrl}${nextQuery}`}
          aria-label="다음 달"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'hover:bg-brand/10'
          )}
          prefetch={false}
        >
          <ChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default MonthNavigator;
