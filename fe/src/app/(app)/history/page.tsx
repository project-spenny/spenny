import { TransactionList } from '@/components/transaction/TransactionList';
import TransactionClient from './TransactionClient';
import { TransactionFilters } from './actions';
import { getTransaction } from './actions';
import { Suspense } from 'react';
import { TransactionProvider } from './TransactionContext';
interface PageProps {
  searchParams: Promise<{
    type?: string;
    category_id?: string;
    startDate?: string;
    endDate?: string;
    queryString?: string;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: TransactionFilters = {
    type: params.type as 'income' | 'expense' | undefined,
    category_id: params.category_id,
    startDate: params.startDate,
    endDate: params.endDate,
    searchQuery: params.queryString,
  };
  return (
    <>
      <TransactionProvider>
        <div className="flex h-screen w-full flex-col">
          <Suspense fallback={<div>skeleton ui</div>}>
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
  const transactions = await getTransaction(filters);
  return <TransactionList transactions={transactions} />;
}
