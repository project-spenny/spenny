import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';

const AnalysisPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 달 선택 */}
      <div className="flex items-center justify-center gap-3 py-6">
        <Button variant="ghost" className="cursor-pointer">
          <ChevronLeft />
        </Button>

        <span className="text-2xl font-bold">12월</span>

        <Button variant="ghost" className="cursor-pointer">
          <ChevronRight />
        </Button>
      </div>

      {/* 탭 리스트 */}
      <Tabs defaultValue="지출" className="px-10 md:px-30">
        <TabsList className="flex h-12 w-full gap-2 p-2">
          <TabsTrigger
            value="지출"
            className="hover:bg-primary/10 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
          >
            지출
          </TabsTrigger>
          <TabsTrigger
            value="수입"
            className="hover:bg-primary/10 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
          >
            수입
          </TabsTrigger>
          <TabsTrigger
            value="예산"
            className="hover:bg-primary/10 cursor-pointer transition-all data-[state=active]:font-bold md:text-base"
          >
            예산
          </TabsTrigger>
        </TabsList>

        {/* 탭 콘텐츠 영역 */}
        <TabsContent value="지출">
          <div>지출 분석 컴포넌트</div>
        </TabsContent>
        <TabsContent value="수입">
          <div>수입 분석 컴포넌트</div>
        </TabsContent>
        <TabsContent value="예산">
          <div>예산 분석 컴포넌트</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisPage;
