import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type MonthNavigatorProps = {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
};

const MonthNavigator = ({
  year,
  month,
  onPrev,
  onNext,
}: MonthNavigatorProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-10">
      <span className="text-brand font-bold">{year}</span>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-brand/10 cursor-pointer"
          onClick={onPrev}
        >
          <ChevronLeft />
        </Button>

        <span className="text-2xl font-bold">{month}월</span>

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-brand/10 cursor-pointer"
          onClick={onNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default MonthNavigator;
