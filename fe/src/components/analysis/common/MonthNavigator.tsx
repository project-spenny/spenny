'use client';

import { usePathname, useRouter } from 'next/navigation';

import MonthPicker from '@/components/common/MonthPicker';

type MonthNavigatorProps = {
  year: number;
  month: number;
  baseUrl: string;
};

const MonthNavigator = ({ year, month, baseUrl }: MonthNavigatorProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isRecommendMode = pathname?.endsWith('/recommend');

  const handleDateChange = (newYear: number, newMonth: number) => {
    if (isRecommendMode) return;

    const queryString = `?year=${newYear}&month=${newMonth}`;

    router.push(`${baseUrl}${queryString}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-10">
      <MonthPicker
        year={year}
        month={month}
        onDateChange={handleDateChange}
        disabled={isRecommendMode}
      />

      {isRecommendMode && (
        <span className="text-destructive animate-in fade-in slide-in-from-bottom-1 text-sm duration-200">
          예산 추천 중에는 월 변경이 제한됩니다.
        </span>
      )}
    </div>
  );
};

export default MonthNavigator;
