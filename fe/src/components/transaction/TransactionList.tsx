'use client';
import { useMemo, useRef, useEffect } from 'react';
import { TransactionItem } from './TransactionItem';
import { ITransaction } from '@/types/transactions';
import { TransactionFilter } from './TransactionFilter';
import { TransactionFilters } from '@/app/(app)/history/actions';
import { Loader2 } from 'lucide-react';

type ListFilters = Omit<TransactionFilters, 'start_date' | 'end_date'>;

interface TransactionListProps {
  transactions: ITransaction[];
  compact?: boolean;
  onEdit?: (tx: ITransaction) => void;
  onCreate?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  isLoading?: boolean;
  month?: string;
  onMonthChange?: (month: string) => void;
  filters?: ListFilters;
  onFiltersChange?: (filters: ListFilters) => void;
}

// 날짜별로 그룹화
function groupByDate(transactions: ITransaction[]) {
  const groups: Record<string, ITransaction[]> = {};

  for (const tx of transactions) {
    const date = tx.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
  }

  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

// 날짜 포맷 함수
function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

export const TransactionList = ({
  transactions,
  compact = false,
  onEdit,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading,
  month,
  onMonthChange,
  filters,
  onFiltersChange,
}: TransactionListProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const current = loadMoreRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const groupedTransactions = useMemo(
    () => groupByDate(transactions),
    [transactions]
  );

  if (compact) {
    return (
      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-6">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center">
              거래 내역이 없습니다
            </p>
          ) : (
            groupedTransactions.map(([date, txs]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">
                  {formatDateHeader(date)}
                </h3>
                {txs.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 필터 렌더링 (month, onMonthChange가 있을 때만)
  const renderFilter = () => {
    if (!month || !onMonthChange) return null;
    return (
      <TransactionFilter
        month={month}
        onMonthChange={onMonthChange}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    );
  };

  // 초기 로딩 상태
  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-6">
          {renderFilter()}
          <div className="flex justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {renderFilter()}
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center">
            거래 내역이 없습니다
          </p>
        ) : (
          <>
            {groupedTransactions.map(([date, txs]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">
                  {formatDateHeader(date)}
                </h3>
                {txs.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            ))}

            {/* 트리거 */}
            <div ref={loadMoreRef} className="h-4" />

            {/* 로딩스피너 */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
