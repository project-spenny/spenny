import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CategoryAnalysis, TransactionAnalysis } from '@/types/analysis';

import { Badge } from '../ui/badge';
import { CHART_COLORS } from '@/constants/colors';
import { cn } from '@/lib/utils';

type CategoryAnalysisListProps = {
  data: CategoryAnalysis[];
  allTransactions: TransactionAnalysis[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const CategoryAnalysisList = ({
  data,
  allTransactions,
  selectedIndex,
  onSelect,
}: CategoryAnalysisListProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      value={`item-${selectedIndex}`}
      onValueChange={(value) => {
        if (!value) {
          onSelect(-1);
          return;
        }

        const index = Number(value.replace('item-', ''));
        if (!isNaN(index)) onSelect(index);
      }}
      className="space-y-1"
    >
      {data.map((item, i) => {
        const isSelected = i === selectedIndex;
        const color = i < 5 ? CHART_COLORS.TOP_5[i] : CHART_COLORS.GRAY.LIGHT;

        const sortedTransactions = allTransactions
          .filter((t) => t.category?.name_ko === item.name)
          .sort((a, b) => a.date.localeCompare(b.date));

        return (
          <AccordionItem
            key={item.name}
            value={`item-${i}`}
            className="border-none"
          >
            <AccordionTrigger
              className={cn(
                'flex cursor-pointer items-center rounded-xl p-2 transition-all duration-200 md:p-4',
                'hover:bg-brand-subtle dark:hover:bg-brand/10 hover:no-underline',
                isSelected &&
                  'bg-brand-subtle dark:bg-brand/10 rounded-b-none shadow-sm'
              )}
            >
              <div className="flex w-full items-center justify-between">
                {/* 왼쪽: 차트 색상 매칭 + 이름 + 퍼센트 */}
                <div className="flex items-center gap-2 pl-1 md:gap-3 md:pl-0">
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
                    <Badge
                      variant="default"
                      className="bg-brand/10 text-brand ring-brand/20 rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ring-1 ring-inset md:text-xs"
                    >
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                {/* 오른쪽: 금액 */}
                <div className="shrink-0 text-xs font-semibold whitespace-nowrap md:text-sm">
                  {item.amount.toLocaleString()}원
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="bg-brand-neutral/15 divide-y rounded-b-xl px-4 py-2 shadow-sm md:px-6 md:py-2">
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-2 py-2 text-xs tracking-tight break-keep md:text-sm"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-[11px] md:text-xs">
                          {t.date}
                        </span>
                        <span className="font-semibold">{t.title}</span>
                      </div>
                      <span className="font-semibold">
                        {t.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground py-2 text-center text-xs md:text-sm">
                    거래 내역이 없습니다.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAnalysisList;
