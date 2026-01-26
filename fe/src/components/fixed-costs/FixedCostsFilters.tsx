'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFixedCostsFilters } from '@/hooks/useFixedCostsFilters';

export default function FixedCostsFilters() {
  const { searchParams, updateFilter } = useFixedCostsFilters();
  const type = searchParams.get('type') || 'all';

  return (
    <div className="flex items-center justify-between">
      <Select
        value={type}
        onValueChange={(value) => updateFilter('type', value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="타입" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="income">수입</SelectItem>
          <SelectItem value="expense">지출</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
