import { cn } from '@/lib/utils';
import { CalendarClock, Info } from 'lucide-react';
import { THEME_COLOR } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import { Badge } from '@/components/ui/badge';
import { formatLocalDate } from '@/utils/date';
import type { ScheduledFixedByDateMap } from '@/types/fixed-costs';

export function ScheduledFixedInfo({
  selectedDate,
  scheduledFixedByDateMap,
}: {
  selectedDate: Date | null;
  scheduledFixedByDateMap: ScheduledFixedByDateMap;
}) {
  if (!selectedDate) return null;

  const dateKey = formatLocalDate(selectedDate);
  const items = scheduledFixedByDateMap[dateKey] ?? [];
  if (items.length === 0) return null;

  return (
    <div className="border-brand-soft/30 bg-brand-subtle/50 mx-4 mt-2 overflow-hidden rounded-lg border md:mx-6 lg:mx-8">
      {/* 헤더 */}
      <div className="border-brand-soft/20 bg-brand-soft/10 flex items-center gap-2 border-b px-4 py-3">
        <CalendarClock className="text-brand-strong h-4 w-4" />
        <h4 className="text-brand-strong text-sm font-bold">예정된 고정비</h4>
        <Badge
          variant="outline"
          className="border-brand-soft text-brand-strong ml-auto bg-white/50 text-xs"
        >
          {items.length}건
        </Badge>
      </div>

      {/* 리스트 */}
      <div className="divide-brand-soft/10 divide-y">
        {items.map((item, idx) => {
          const categoryName = CATEGORIES[item.type].find(
            (cat) => cat.category_key === item.category_id
          )?.name_ko;
          return (
            <div
              key={`${item.fixed_rule_id}-${idx}`}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-8 w-1 shrink-0 rounded-full',
                    item.type === 'income' ? 'bg-blue-400' : 'bg-red-400'
                  )}
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {categoryName}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item.title}
                  </span>
                </div>
              </div>

              <div className="shrink-0 pl-3 text-right">
                <span
                  className={cn(
                    'text-sm font-bold whitespace-nowrap tabular-nums',
                    item.type === 'income'
                      ? THEME_COLOR.INCOME
                      : THEME_COLOR.EXPENSE
                  )}
                >
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString()}원
                </span>
              </div>
            </div>
          );
        })}
        {/* 하단 안내 가이드 */}
        <div className="text-muted-foreground flex items-center gap-1.5 px-4 py-2">
          <Info className="h-3 w-3" />
          <p className="text-xs">
            설정된 반복 주기에 따라 자동으로 계산된 내역입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
