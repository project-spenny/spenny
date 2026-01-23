import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

import { CHART_COLORS } from '@/constants/colors';
import { CategoryAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';

type CategoryAnalysisListProps = {
  data: CategoryAnalysis[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const CategoryAnalysisList = ({
  data,
  selectedIndex,
  onSelect,
}: CategoryAnalysisListProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      value={`item-${selectedIndex}`}
      onValueChange={(value) => {
        const index = Number(value.replace('item-', ''));
        if (!isNaN(index)) onSelect(index);
      }}
      className="space-y-1 px-2 pt-6"
    >
      {data.map((item, i) => {
        const isSelected = i === selectedIndex;
        const color = i < 5 ? CHART_COLORS.TOP_5[i] : CHART_COLORS.GRAY.LIGHT;

        return (
          <AccordionItem
            key={item.name}
            value={`item-${i}`}
            className="border-none"
          >
            <AccordionTrigger
              className={cn(
                'flex cursor-pointer items-center rounded-xl p-3 transition-all duration-200',
                'hover:bg-brand-subtle dark:hover:bg-brand/10 hover:no-underline',
                isSelected && 'bg-brand-subtle dark:bg-brand/10 shadow-sm'
              )}
            >
              <div className="flex w-full items-center justify-between">
                {/* 왼쪽: 차트 색상 매칭 + 이름 + 퍼센트 */}
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-2 rounded-full transition-all duration-300',
                      isSelected ? 'h-6' : 'h-4' // 선택 시 바가 살짝 길어짐
                    )}
                    style={{ backgroundColor: color }}
                  />

                  <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <span
                      className={cn(
                        'text-sm md:text-base',
                        isSelected ? 'font-bold' : 'font-medium'
                      )}
                    >
                      {item.name}
                    </span>
                    <span className="text-brand text-xs font-medium md:text-sm">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* 오른쪽: 금액 */}
                <div className="text-sm md:text-base">
                  {item.amount.toLocaleString()}원
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>거래 내역 리스트</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAnalysisList;
