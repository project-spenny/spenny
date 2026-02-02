import { formatLocalDate, parseLocalDate } from '@/utils/date';

import type { FixedCostsFilters as Filters } from '@/types/fixed-costs';
import FixedCostsClient from '@/components/fixed-costs/FixedCostsClient';
import FixedCostsFilters from '@/components/fixed-costs/FixedCostsFilters';
import FixedCostsList from '@/components/fixed-costs/FixedCostsList';
import FixedCostsListSkeleton from '@/components/fixed-costs/FixedCostsListSkeleton';
import { FixedCostsProvider } from './FixedCostsContext';
import { Suspense } from 'react';
import { fetchFixedRulesServer } from '@/services/fixed-costs/fixedCostsServer';

interface PageProps {
  searchParams: Promise<{
    type?: string;
    cycle?: string;
    start_date?: string;
    end_date?: string;
    query?: string;
  }>;
}

export default async function FixedCostsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const startDate = parseLocalDate(params.start_date);
  const endDate = parseLocalDate(params.end_date);

  const filters: Filters = {
    type:
      params.type === 'income' || params.type === 'expense'
        ? params.type
        : undefined,
    cycle:
      params.cycle === 'WEEKLY' || params.cycle === 'MONTHLY'
        ? params.cycle
        : undefined,
    start_date: startDate ? formatLocalDate(startDate) : undefined,
    end_date: endDate ? formatLocalDate(endDate) : undefined,
    query: params.query?.trim() ? params.query.trim() : undefined,
  };

  return (
    <FixedCostsProvider>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-xl space-y-6">
            <header>
              <h1 className="text-xl font-semibold">고정비 관리</h1>
            </header>
            <FixedCostsFilters />
          </div>
        </div>
        <FixedCostsClient />

        <Suspense fallback={<FixedCostsListSkeleton />}>
          <FixedCostsListWrapper filters={filters} />
        </Suspense>
      </div>
    </FixedCostsProvider>
  );
}

async function FixedCostsListWrapper({ filters }: { filters: Filters }) {
  const items = await fetchFixedRulesServer(filters);

  return <FixedCostsList items={items} />;
}
