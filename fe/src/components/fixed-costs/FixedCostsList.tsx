'use client';

import { useFixedCosts } from '@/app/(app)/fixed-costs/FixedCostsContext';
import FixedCostItem from './FixedCostItem';
import { IFixedRule } from '@/types/fixed-costs';
import { Spinner } from '../ui/spinner';

export default function FixedCostsList({ items }: { items: IFixedRule[] }) {
  const { openEdit, isFiltering } = useFixedCosts();

  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {isFiltering && (
          <div className="text-muted-foreground flex animate-pulse items-center justify-center gap-4 py-12">
            <Spinner className="size-6" />
            <span className="text-base">Loading...</span>
          </div>
        )}

        <div className={isFiltering ? 'hidden' : ''}>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center">
              등록된 고정비가 없습니다
            </p>
          ) : (
            items.map((rule) => (
              <FixedCostItem
                key={rule.id}
                rule={rule}
                onEdit={() => openEdit(rule)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
