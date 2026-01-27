'use client';

import { CalendarClock } from 'lucide-react';
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
  const scheduledItems = scheduledFixedByDateMap[dateKey] ?? [];
  if (scheduledItems.length === 0) return null;

  return (
    <div className="border-brand-soft/30 bg-brand-subtle/50 mx-4 mt-2 overflow-hidden rounded-2xl border md:mx-6 lg:mx-8">
      {/* 리스트 */}
      <div className="divide-brand-soft/10 divide-y">
        {scheduledItems.map((item, idx) => {
          return (
            <div
              key={`${item.fixed_rule_id}-${idx}`}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{item.title}</span>
              </div>

              <div className="flex items-end">
                <span>
                  {item.type === 'income' ? '+' : '-'}
                  {item.amount.toLocaleString()}원
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
