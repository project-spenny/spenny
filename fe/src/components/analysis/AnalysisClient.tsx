'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AnalysisData } from '@/types/analysis';
import AnalysisView from '@/components/analysis/AnalysisView';
import BudgetView from '@/components/budgets/BudgetView';
import MonthNavigator from '@/components/common/MonthNavigator';
import { useRouter } from 'next/navigation';

type AnalysisClientProps = {
  initialYear: number;
  initialMonth: number;
  initialData: {
    expense: AnalysisData;
    income: AnalysisData;
  };
};

const AnalysisClient = ({
  initialYear,
  initialMonth,
  initialData,
}: AnalysisClientProps) => {
  const router = useRouter();

  const year = Math.min(Math.max(initialYear, 1900), 2100);
  const month = Math.min(Math.max(initialMonth, 1), 12);

  const currentDate = new Date(year, month - 1);

  // 월 이동 및 URL 반영
  const moveMonth = (offset: number) => {
    const newDate = new Date(year, month - 1 + offset);
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth() + 1;

    // URL 변경 (페이지 전체 새로고침 없이 URL만 바뀜)
    router.push(`/analysis?year=${newYear}&month=${newMonth}`, {
      scroll: false,
    });
  };

  const analysisTabs = [
    {
      value: '지출',
      content: (
        <AnalysisView
          type="expense"
          selectedDate={currentDate}
          initialData={initialData.expense}
        />
      ),
    },
    {
      value: '수입',
      content: (
        <AnalysisView
          type="income"
          selectedDate={currentDate}
          initialData={initialData.income}
        />
      ),
    },
    { value: '예산', content: <BudgetView selectedDate={currentDate} /> },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col py-4">
      {/* 달 선택 */}
      <MonthNavigator
        year={year}
        month={month}
        onPrev={() => moveMonth(-1)}
        onNext={() => moveMonth(1)}
      />

      {/* 탭 리스트 */}
      <Tabs
        defaultValue="지출"
        className="mx-auto w-full max-w-4xl px-6 md:px-12"
      >
        <TabsList className="bg-brand-subtle dark:bg-brand/10 flex h-12 w-full gap-2 p-2">
          {analysisTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="hover:bg-brand/10 flex-1 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
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
