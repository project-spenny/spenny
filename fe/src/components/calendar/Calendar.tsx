'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarView } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { type DayButton, getDefaultClassNames } from 'react-day-picker';
import { Button } from '../ui/button';
import ResponsivePanel from '../panel/ResponsivePanel';
import { useCalendar } from '@/context/CalendarContext';
import { ITransaction } from '@/types/transactions';
import { useMemo } from 'react';
import { CaptionLabelProps } from 'react-day-picker';

interface CalendarProps {
  currentMonth: string;
  transactions: ITransaction[];
}

interface DayData {
  income: number;
  expense: number;
  transactions: ITransaction[];
}

const CustomDay = ({
  day,
  modifiers,
  dayData,
  ...props
}: React.ComponentProps<typeof DayButton> & { dayData?: DayData }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const defaultClassNames = getDefaultClassNames();
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected}
      {...props}
      className={cn(
        'data-[selected-single=true]:border-2',
        'flex flex-col items-center justify-start gap-0.5 pt-1',
        'aspect-square w-full',
        'min-h-[40px] sm:min-h-[80px] md:min-h-[60px] lg:min-h-[80px]',
        defaultClassNames.day
      )}
    >
      <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-2">
        <span className="text-sm font-medium sm:text-base md:text-lg">
          {day.date.getDate()}
        </span>
        {dayData && (dayData.income > 0 || dayData.expense > 0) && (
          <div className="flex flex-col text-[10px] sm:text-xs md:text-sm">
            {dayData.income > 0 && (
              <span className="text-blue-500">
                +{dayData.income.toLocaleString()}
              </span>
            )}
            {dayData.expense > 0 && (
              <span className="text-red-500">
                -{dayData.expense.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};

export const Calendar = ({ currentMonth, transactions }: CalendarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [month, setMonth] = useState<Date>(new Date(`${currentMonth}-01`));
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { selectedDate, isOpen, open, close } = useCalendar();

  const groupedTransaction = useMemo(() => {
    const grouped: Record<string, DayData> = {};

    transactions.forEach((transaction) => {
      const dateKey = transaction.date;

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          income: 0,
          expense: 0,
          transactions: [],
        };
      }

      if (transaction.type === 'income') {
        grouped[dateKey].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        grouped[dateKey].expense += transaction.amount;
      }

      grouped[dateKey].transactions.push(transaction);
    });

    return grouped;
  }, [transactions]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];

    const dateKey = selectedDate.toISOString().split('T')[0];
    return groupedTransaction[dateKey]?.transactions || [];
  }, [selectedDate, groupedTransaction]);

  const DayButtonWithData = (props: React.ComponentProps<typeof DayButton>) => {
    const dateKey = props.day.date.toISOString().split('T')[0];
    const dayData = groupedTransaction[dateKey];

    return <CustomDay {...props} dayData={dayData} />;
  };

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);

    const params = new URLSearchParams(searchParams.toString());
    const monthString = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
    params.set('month', monthString);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="ml-4 w-full h-screen bg-amber-200 flex items-center flex-col">
      <CalendarView
        mode="single"
        selected={date}
        onSelect={setDate}
        onMonthChange={handleMonthChange}
        onDayClick={(day) => open(day)}
        // className="rounded-md border shadow-sm [&_.rdp-caption]:!hidden [&_.rdp-nav]:hidden"
        components={{ DayButton: DayButtonWithData,
          // CaptionLabel:CustomCaption
         }}
        // disableNavigation
      />
      <ResponsivePanel isOpen={isOpen} setIsOpen={close}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {selectedDate?.toLocaleDateString('ko-KR')}
          </h3>

          {selectedDayTransactions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              거래 내역이 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedDayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">
                      {transaction.type === 'income' ? '수입' : '지출'}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-sm',
                      transaction.type === 'income'
                        ? 'text-blue-500'
                        : 'text-red-500'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ResponsivePanel>
    </div>
  );
};

function CustomCaption(props : CaptionLabelProps){
  return <div/>
}