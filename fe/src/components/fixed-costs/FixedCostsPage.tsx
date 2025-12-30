'use client';

import { useState } from 'react';
import FixedCostsAddButton from './FixedCostsAddButton';
import FixedCostsList from './FixedCostsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MOCK_FIXED_COSTS } from '@/constants/fixed-costs.mock';
import { FixedCostListItem } from '@/types/fixed-costs.mock.types';

type TabValue = 'all' | 'active' | 'inactive';

export default function FixedCostsPage() {
  const [tab, setTab] = useState<TabValue>('all');
  const [items, setItems] = useState<FixedCostListItem[]>(MOCK_FIXED_COSTS);

  const filteredItems =
    tab === 'active'
      ? items.filter((i) => i.isActive)
      : tab === 'inactive'
        ? items.filter((i) => !i.isActive)
        : items;

  const counts = {
    all: items.length,
    active: items.filter((i) => i.isActive).length,
    inactive: items.filter((i) => !i.isActive).length,
  };

  const emptyMessage =
    tab === 'all'
      ? '등록된 고정비가 없습니다. \n\n상단의 + 버튼을 눌러 고정비를 추가해 주세요.'
      : tab === 'active'
        ? '활성화된 고정비가 없습니다.'
        : '비활성화된 고정비가 없습니다.';

  const handleToggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg space-y-6 p-4 md:p-6 lg:p-8">
      <FixedCostsAddButton />

      <header>
        <h1 className="text-xl font-semibold">고정비 관리</h1>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <span className="flex items-center gap-2">
              전체
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                {counts.all}
              </Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger value="active">
            <span className="flex items-center gap-2">
              활성
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                {counts.active}
              </Badge>
            </span>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            <span className="flex items-center gap-2">
              비활성
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                {counts.inactive}
              </Badge>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <FixedCostsList
            items={filteredItems}
            onToggleActive={handleToggleActive}
            emptyMessage={emptyMessage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
