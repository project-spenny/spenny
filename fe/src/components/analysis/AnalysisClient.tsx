'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';

import AnalysisView from '@/components/analysis/AnalysisView';
import BudgetView from '@/components/analysis/Budget/BudgetView';
import { Button } from '@/components/ui/button';

const AnalysisClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const now = new Date();

  // URL에서 읽어오되, 결과가 NaN이거나 0이면 현재 연/월을 사용
  const yearParam = Number(searchParams.get('year')) || now.getFullYear();
  const monthParam = Number(searchParams.get('month')) || now.getMonth() + 1;

  // 숫자 범위 제한
  const year = Math.min(Math.max(yearParam, 1900), 2100);
  const month = Math.min(Math.max(monthParam, 1), 12);

  const currentDate = new Date(year, month - 1);

  // 월 이동 및 URL 반영
  const moveMonth = (offset: number) => {
    const newDate = new Date(year, month - 1 + offset);
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', newDate.getFullYear().toString());
    params.set('month', (newDate.getMonth() + 1).toString());

    // URL 변경 (페이지 전체 새로고침 없이 URL만 바뀜)
    router.push(`/analysis?${params.toString()}`, { scroll: false });
  };

  const analysisTabs = [
    {
      value: '지출',
      content: <AnalysisView type="expense" selectedDate={currentDate} />,
    },
    {
      value: '수입',
      content: <AnalysisView type="income" selectedDate={currentDate} />,
    },
    { value: '예산', content: <BudgetView selectedDate={currentDate} /> },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col py-4">
      {/* 달 선택 */}
      <div className="flex flex-col items-center justify-center py-6 md:py-10">
        <span className="text-muted-foreground text-sm font-bold md:text-base">
          {year}
        </span>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => moveMonth(-1)}
          >
            <ChevronLeft />
          </Button>

          <span className="text-2xl font-bold">{month}월</span>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => moveMonth(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {/* 탭 리스트 */}
      <Tabs
        defaultValue="지출"
        className="mx-auto w-full max-w-4xl px-6 md:px-12"
      >
        <TabsList className="flex h-12 w-full gap-2 p-2">
          {analysisTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="hover:bg-primary/10 flex-1 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
            >
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 탭 콘텐츠 영역 */}
        {analysisTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="animate-in fade-in pt-2 duration-300">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalysisClient;
