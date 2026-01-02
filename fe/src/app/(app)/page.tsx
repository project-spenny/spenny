import { Calendar } from '@/components/calendar/Calendar';
import { getTransaction } from './history/actions';
import { TransactionFilters } from './history/actions';
import { TransactionList } from '@/components/transaction/TransactionList';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{
    type?: string;
    category_id?: string;
    start_date?: string;
    end_date?: string;
    queryString?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: TransactionFilters = {
    type: params.type as 'income' | 'expense' | undefined,
    category_id: params.category_id,
    start_date: params.start_date,
    end_date: params.end_date,
    searchQuery: params.queryString,
  };
  return (
    <div>
      <Suspense fallback={<div>skeleton ui</div>}>
        <TransactionWrapper filters={filters} />
      </Suspense>
      <Calendar />
    </div>
  );
}

async function TransactionWrapper({
  filters,
}: {
  filters: TransactionFilters;
}) {
  const transactions = await getTransaction(filters, true);
  return <TransactionList transactions={transactions} />;
}
