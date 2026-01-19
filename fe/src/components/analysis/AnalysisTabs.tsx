'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalysisTabs = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs
      defaultValue="지출"
      className="mx-auto w-full max-w-4xl px-6 md:px-12"
    >
      <TabsList className="bg-brand-subtle dark:bg-brand/10 flex h-12 w-full gap-2 p-2">
        <TabsTrigger
          value="지출"
          className="hover:bg-brand/10 flex-1 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
        >
          지출
        </TabsTrigger>
        <TabsTrigger
          value="수입"
          className="hover:bg-brand/10 flex-1 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
        >
          수입
        </TabsTrigger>
        <TabsTrigger
          value="예산"
          className="hover:bg-brand/10 flex-1 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
        >
          예산
        </TabsTrigger>
      </TabsList>

      {/* 탭 콘텐츠 영역 */}
      <div className="animate-in fade-in pt-2 duration-300">{children}</div>
    </Tabs>
  );
};

export default AnalysisTabs;
