'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarView } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Day, type DayButton, getDefaultClassNames } from 'react-day-picker';
import { Button } from '../ui/button';
import ResponsivePanel from '../panel/ResponsivePanel';
import { useCalendar } from '@/context/CalendarContext';
import { ITransaction } from '@/types/transactions';
import { useMemo } from 'react';
import { CaptionLabelProps } from 'react-day-picker';
import { formatDateKR, formatLocalDate } from '@/utils/date';
import { Card, CardTitle, CardContent } from '../ui/card';
import { MonthCaptionProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionList } from '../transaction/TransactionList';
import { formatMonth } from '@/utils/date';
import TransactionSubmitForm from '../transaction/TransactionSubmitForm';
import { revalidateTransactions } from '@/app/(app)/history/actions';
interface CalendarProps {
  currentMonth: string;
  transactions: ITransaction[];
}

interface DayData {
  income: number;
  expense: number;
  transactions: ITransaction[];
}
interface PanelState {
  view: 'list' | 'create' | 'edit';
  editingTransaction?: ITransaction;
}

const CALENDAR_CELL_HEIGHT =
  '[&_td]:!h-[60px] sm:[&_td]:!h-[70px] md:[&_td]:!h-[80px]';
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
      data-day={formatLocalDate(day.date)}
      data-selected-single={modifiers.selected}
      {...props}
      className={cn(
        'flex flex-col items-center justify-start gap-1 p-2 pt-1',
        'aspect-square w-full',
        'h-full w-full',
        CALENDAR_CELL_HEIGHT,
        defaultClassNames.day
      )}
    >
      <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-2">
        <span className="text-sm font-medium sm:text-base md:text-lg">
          {day.date.getDate()}
        </span>
        {dayData && (dayData.income > 0 || dayData.expense > 0) && (
          <div className="flex flex-col text-[8px] sm:text-[10px] md:text-xs">
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

  const [panelState, setPanelState] = useState<PanelState>({ view: 'list' });

  useEffect(() => {
    setMonth(new Date(`${currentMonth}-01`));
  }, [currentMonth]);

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

  const TransactionSummary = useMemo(() => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else if (transaction.type === 'expense') {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return summary;
  }, [transactions]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];

    const dateKey = formatLocalDate(selectedDate);
    return groupedTransaction[dateKey]?.transactions || [];
  }, [selectedDate, groupedTransaction]);

  const DayButtonWithData = (props: React.ComponentProps<typeof DayButton>) => {
    const dateKey = formatLocalDate(props.day.date);
    const dayData = groupedTransaction[dateKey];

    return <CustomDay {...props} dayData={dayData} />;
  };

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);

    const params = new URLSearchParams(searchParams.toString());
    params.set('month', formatMonth(newMonth));

    router.push(`?${params.toString()}`);
  };

  const moveMonth = (offset: number) => {
    const newDate = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    handleMonthChange(newDate);
  };

  const { income, expense } = TransactionSummary;

  const year = month.getFullYear();
  const displayMonth = month.getMonth() + 1;

  const handleClose = () => {
    close();
    setPanelState({ view: 'list' });
  };
  const CustomCaption = (props: MonthCaptionProps) => {
    return (
      <div className="flex w-full gap-2 p-2 sm:flex-row sm:gap-4">
        <Card className="w-full items-center gap-2">
          <CardTitle className="text-xs sm:text-base">이번 달 수입</CardTitle>
          <CardContent className="text-xs text-blue-600 sm:text-base">
            {income.toLocaleString()}원
          </CardContent>
        </Card>
        <Card className="w-full items-center gap-2">
          <CardTitle className="text-xs sm:text-base">이번 달 지출</CardTitle>
          <CardContent className="text-xs text-red-600 sm:text-base">
            {expense.toLocaleString()}원
          </CardContent>
        </Card>
      </div>
    );
  };
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center justify-center py-6 md:py-10">
        <span className="text-muted-foreground text-sm font-bold md:text-base">
          {year}
        </span>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => moveMonth(-1)}
          >
            <ChevronLeft />
          </Button>

          <span className="text-2xl font-bold">{displayMonth}월</span>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => moveMonth(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <CalendarView
        month={month}
        mode="single"
        selected={date}
        onSelect={setDate}
        onMonthChange={handleMonthChange}
        onDayClick={(day) => open(day)}
        className={cn(
          'w-full rounded-md border shadow-sm',
          '[&_.rdp-caption]:!hidden [&_.rdp-nav]:hidden',
          '[&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_td]:p-0',
          CALENDAR_CELL_HEIGHT
        )}
        components={{
          DayButton: DayButtonWithData,
          MonthCaption: CustomCaption,
        }}
        disableNavigation
      />
      <ResponsivePanel isOpen={isOpen} setIsOpen={handleClose}>
        <div className="space-y-4">
          <h3 className="pl-8 text-lg font-semibold">
            {selectedDate && formatDateKR(selectedDate)}
          </h3>

          {panelState.view === 'list' && (
            <div className="space-y-2">
              <TransactionList
                compact={true}
                transactions={selectedDayTransactions}
                onEdit={(tx) => {
                  console.log('edit!');
                  setPanelState({ view: 'edit', editingTransaction: tx });
                }}
                onCreate={() => {
                  setPanelState({ view: 'create' });
                }}
              />
            </div>
          )}
          {panelState.view === 'edit' && (
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setPanelState({ view: 'list' });
                }}
                className="m-4 ml-6 flex"
              >
                <ChevronLeft />
                목록으로
              </Button>
              <TransactionSubmitForm
                transaction={panelState.editingTransaction}
                onSuccess={async () => {
                  await revalidateTransactions();
                  setPanelState({ view: 'list' });
                }}
                onClose={() => {
                  setPanelState({ view: 'list' });
                }}
                mode="edit"
              />
            </div>
          )}
        </div>
      </ResponsivePanel>
    </div>
  );
};
