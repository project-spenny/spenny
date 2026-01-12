import { TransactionList } from '@/components/transaction/TransactionList';
import TransactionClient from './TransactionClient';
import { TransactionFilters } from './actions';
import { getTransaction } from './actions';
import { Suspense } from 'react';
import { TransactionProvider } from './TransactionContext';
import { TransactionListSkeleton } from '@/components/transaction/TransactionListSkeleton';
interface PageProps {
  searchParams: Promise<{
    type?: string;
    category_id?: string;
    start_date?: string;
    end_date?: string;
    queryString?: string;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: TransactionFilters = {
    type: params.type as 'income' | 'expense' | undefined,
    category_id: params.category_id,
    start_date: params.start_date,
    end_date: params.end_date,
    searchQuery: params.queryString,
  };
  return (
    <>
      <TransactionProvider>
        <div className="flex min-h-screen w-full flex-col">
          <Suspense fallback={<TransactionListSkeleton />}>
            <TransactionListWrapper filters={filters} />
          </Suspense>
          <TransactionClient />
        </div>
      </TransactionProvider>
    </>
  );
}

async function TransactionListWrapper({
  filters,
}: {
  filters: TransactionFilters;
}) {
  const transactions = await getTransaction(filters, true);
  return <TransactionList transactions={transactions} />;
}
