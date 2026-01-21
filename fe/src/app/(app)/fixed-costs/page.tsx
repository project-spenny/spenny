import FixedCostsClient from '@/components/fixed-costs/FixedCostsClient';
import FixedCostsList from '@/components/fixed-costs/FixedCostsList';
import FixedCostsListSkeleton from '@/components/fixed-costs/FixedCostsListSkeleton';
import { fetchFixedRulesServer } from '@/services/fixed-costs/fixedCostsServer';
import { Suspense } from 'react';
import { FixedCostsProvider } from './FixedCostsContext';

export default function FixedCostsPage() {
  return (
    <FixedCostsProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-xl space-y-6">
            <header>
              <h1 className="text-xl font-semibold">고정비 관리</h1>
            </header>
          </div>
        </div>
        <FixedCostsClient />

        <Suspense fallback={<FixedCostsListSkeleton />}>
          <FixedCostsListWrapper />
        </Suspense>
      </div>
    </FixedCostsProvider>
  );
}

async function FixedCostsListWrapper() {
  const items = await fetchFixedRulesServer();

  return <FixedCostsList items={items} />;
}
