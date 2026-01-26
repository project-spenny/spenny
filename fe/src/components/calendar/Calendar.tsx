'use client';
import { useState } from 'react';
import { Calendar as CalendarView } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { type DayButton } from 'react-day-picker';
import { Button } from '../ui/button';
import ResponsivePanel from '../panel/ResponsivePanel';
import { useCalendar } from '@/context/CalendarContext';
import { ITransaction } from '@/types/transactions';
import { useMemo } from 'react';
import { formatDateKR, formatLocalDate } from '@/utils/date';
import { Card, CardTitle, CardContent } from '../ui/card';
import { MonthCaptionProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TransactionList } from '../transaction/TransactionList';
import { formatMonth } from '@/utils/date';
import TransactionSubmitForm from '../transaction/TransactionSubmitForm';
import { Item, ItemContent } from '../ui/item';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDay } from './CalendarDay';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '../ui/spinner';

interface CalendarProps {
  currentMonth: string;
  transactions: ITransaction[];
  isLoading: boolean;
  onMonthChange: (month: string) => void;
  children?: React.ReactNode;
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
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  monthDisplay: `${i + 1}월`,
}));
const CALENDAR_CELL_HEIGHT =
  '[&_td]:!h-[50px] sm:[&_td]:!h-[70px] md:[&_td]:!h-[80px]';

export const Calendar = ({
  currentMonth,
  transactions,
  isLoading,
  onMonthChange,
  children,
}: CalendarProps) => {
  const queryClient = useQueryClient();
  const { selectedDate, isOpen, open, close } = useCalendar();
  const [panelState, setPanelState] = useState<PanelState>({ view: 'list' });
  const { groupedTransaction, TransactionSummary } =
    useCalendarData(transactions);
  const {
    month,
    date,
    setDate,
    year,
    displayMonth,
    handleMonthChange,
    moveMonth,
    navigateMonth,
  } = useCalendarNavigation(currentMonth, onMonthChange);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];

    const dateKey = formatLocalDate(selectedDate);
    return groupedTransaction[dateKey]?.transactions || [];
  }, [selectedDate, groupedTransaction]);

  const DayButtonWithData = (props: React.ComponentProps<typeof DayButton>) => {
    const dateKey = formatLocalDate(props.day.date);
    const dayData = groupedTransaction[dateKey];

    return <CalendarDay {...props} dayData={dayData} />;
  };
  const handleTransactionSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['transactions', formatMonth(month)],
    });
    setPanelState({ view: 'list' });
  };

  const { income, expense } = TransactionSummary;

  const handleClose = () => {
    close();
    setPanelState({ view: 'list' });
  };

  const CustomCaption = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'month' | 'year'>('month');
    const handleMonthSelect = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        handleMonthChange(selectedDate);
        setIsOpen(false);
      }
    };
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const handleYearSelect = (selectedYear: number) => {
      const newDate = new Date(selectedYear, month.getMonth(), 1);
      handleMonthChange(newDate);
      setMode('month');
    };
    return (
      <div className="mb-4 w-full">
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <div
            className={cn(
              'flex flex-2 items-center justify-between rounded-md px-4 py-3 sm:flex-1',
              'bg-brand-subtle dark:bg-muted/40',
              'dark:border-border border border-transparent',
              'border-l-brand border-l-4'
            )}
          >
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-xs">{year}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-brand-soft/40 h-8 w-8"
                  onClick={() => moveMonth(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'hover:bg-brand-soft/40 w-16 justify-center font-semibold',
                        'text-xl tracking-tight sm:text-2xl'
                      )}
                    >
                      {displayMonth}월
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {mode === 'month' ? (
                      <div className="grid grid-cols-3">
                        <div
                          onClick={() => setMode('year')}
                          className="col-span-3 cursor-pointer p-2 text-center font-bold hover:bg-gray-100"
                        >
                          {year}
                        </div>
                        {MONTHS.map(({ month, monthDisplay }) => (
                          <div
                            className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-2 text-center text-xs hover:bg-gray-100"
                            onClick={() => navigateMonth(month)}
                            key={month}
                          >
                            {monthDisplay}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 p-2">
                        <div
                          className="col-span-3 cursor-pointer p-2 text-center font-bold hover:bg-gray-100"
                          onClick={() => setMode('month')}
                        >
                          {displayMonth}월
                        </div>
                        {years.map((y) => (
                          <div
                            key={y}
                            className="flex h-12 w-12 cursor-pointer items-center justify-center text-sm hover:bg-gray-100"
                            onClick={() => handleYearSelect(y)}
                          >
                            {y}
                          </div>
                        ))}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-brand-soft/40 h-8 w-8"
                  onClick={() => moveMonth(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                  수입
                </span>
                <span className="text-sm font-semibold tracking-tight text-blue-500 sm:text-base">
                  {income.toLocaleString()}원
                </span>
              </div>

              <div className="flex items-baseline justify-end gap-2">
                <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                  지출
                </span>
                <span className="text-sm font-semibold tracking-tight text-red-400 sm:text-base">
                  {expense.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex w-full flex-col">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner className="text-brand h-12 w-12" />
          </div>
        </div>
      )}
      <CalendarView
        month={month}
        mode="single"
        selected={date}
        onSelect={setDate}
        onMonthChange={handleMonthChange}
        onDayClick={(day) => open(day)}
        className={cn(
          'w-full rounded-md border border-none shadow-sm',
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
            <div>
              <div className="space-y-2 p-4 md:p-6 lg:p-8">
                <Item
                  className="cursor-pointer hover:bg-gray-100"
                  variant="outline"
                  onClick={() => {
                    setPanelState({ view: 'create' });
                  }}
                >
                  <Plus />
                  <ItemContent>가계부 작성하기</ItemContent>
                </Item>
              </div>
              <TransactionList
                compact={true}
                transactions={selectedDayTransactions}
                onEdit={(tx) => {
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
                variant={'ghost'}
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
                onSuccess={handleTransactionSuccess}
                onClose={() => {
                  setPanelState({ view: 'list' });
                }}
                mode="edit"
              />
            </div>
          )}

          {panelState.view === 'create' && (
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
                defaultDate={selectedDate ?? undefined}
                onSuccess={handleTransactionSuccess}
                onClose={() => {
                  setPanelState({ view: 'list' });
                }}
                mode="create"
              />
            </div>
          )}
        </div>
      </ResponsivePanel>
    </div>
  );
};
