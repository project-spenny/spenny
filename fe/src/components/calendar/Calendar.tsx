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
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { TransactionList } from '../transaction/TransactionList';
import { formatMonth } from '@/utils/date';
import TransactionSubmitForm from '../transaction/TransactionSubmitForm';
import { Item, ItemContent } from '../ui/item';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDay } from './CalendarDay';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { Spinner } from '../ui/spinner';
import { CalendarCaption } from './CalendarCaption';

interface CalendarProps {
  currentMonth: string;
  transactions: ITransaction[];
  isLoading: boolean;
  onMonthChange: (month: string) => void;
  children?: React.ReactNode;
}
interface PanelState {
  view: 'list' | 'create' | 'edit';
  editingTransaction?: ITransaction;
}
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

  const CustomCaption = () => (
    <>
      <CalendarCaption
        year={year}
        displayMonth={displayMonth}
        month={month}
        income={income}
        expense={expense}
        moveMonth={moveMonth}
        navigateMonth={navigateMonth}
        handleMonthChange={handleMonthChange}
      >
        {children}
      </CalendarCaption>
    </>
  );
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full max-w-xl">
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
      </div>
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
