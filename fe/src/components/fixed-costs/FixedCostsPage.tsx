'use client';

import { useEffect, useState } from 'react';
import FixedCostsAddButton from './FixedCostsAddButton';
import FixedCostsList from './FixedCostsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ResponsivePanel from '../panel/ResponsivePanel';
import FixedCostCreateForm from './FixedCostsCreateForm';
import { IFixedRule } from '@/types/fixed-costs';
import { fetchFixedRules } from '@/services/fixed-costs';
import { toast } from 'sonner';

type TabValue = 'all' | 'active' | 'inactive';

export default function FixedCostsPage() {
  const [tab, setTab] = useState<TabValue>('all');
  const [items, setItems] = useState<IFixedRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFixedRules();
        setItems(data);
      } catch (err) {
        console.error('[고정비 목록 조회 실패]', err);
        toast.error(
          '고정비 목록을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems =
    tab === 'active'
      ? items.filter((i) => i.is_active)
      : tab === 'inactive'
        ? items.filter((i) => !i.is_active)
        : items;

  const counts = {
    all: items.length,
    active: items.filter((i) => i.is_active).length,
    inactive: items.filter((i) => !i.is_active).length,
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
        item.id === id ? { ...item, is_active: !item.is_active } : item
      )
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg space-y-6 p-4 md:p-6 lg:p-8">
      <ResponsivePanel trigger={<FixedCostsAddButton />}>
        <FixedCostCreateForm />
      </ResponsivePanel>

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
            isLoading={isLoading}
            emptyMessage={emptyMessage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
