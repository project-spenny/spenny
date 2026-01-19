'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

const TABS_CONFIG = [
  { value: '지출', label: '지출' },
  { value: '수입', label: '수입' },
  { value: '예산', label: '예산' },
];

const AnalysisTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs
      defaultValue="지출"
      className="mx-auto w-full max-w-4xl px-6 md:px-12"
    >
      <TabsList className="bg-brand-subtle dark:bg-brand/10 flex h-12 w-full gap-2 p-2">
        {TABS_CONFIG.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'flex-1 cursor-pointer transition-all md:text-base',
              'hover:bg-brand/10',
              'data-[state=active]:font-bold'
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* 탭 콘텐츠 영역 */}
      <div className="pt-2">{children}</div>
    </Tabs>
  );
};

export default AnalysisTabs;
