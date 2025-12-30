'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import ExpenseAnalysis from '@/components/analysis/ExpenseAnalysis';
import IncomeAnalysis from '@/components/analysis/IncomeAnalysis';
import { useState } from 'react';

const AnalysisPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const analysisTabs = [
    { value: '지출', content: <ExpenseAnalysis selectedDate={currentDate} /> },
    { value: '수입', content: <IncomeAnalysis selectedDate={currentDate} /> },
    { value: '예산', content: '예산 분석 컴포넌트' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 달 선택 */}

      <div className="flex flex-col items-center justify-center py-6 md:py-10">
        <span className="text-muted-foreground text-sm font-bold md:text-base">
          {currentDate.getFullYear()}
        </span>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={handlePrevMonth}
          >
            <ChevronLeft />
          </Button>

          <span className="text-2xl font-bold">
            {currentDate.getMonth() + 1}월
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={handleNextMonth}
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

export default AnalysisPage;
