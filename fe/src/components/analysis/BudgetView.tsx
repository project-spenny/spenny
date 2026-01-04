import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import BudgetSetupDialog from '@/components/analysis/BudgetSetupDialog';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import ConfirmDialog from './common/ConfirmDialog';
import useBudgetData from '@/hooks/useBudgetData';
import { useState } from 'react';

const BudgetView = ({ selectedDate }: { selectedDate: Date }) => {
  const { totalBudget, categoryBudgets, removeBudget, isLoading, isDeleting } =
    useBudgetData(selectedDate);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (isLoading)
    return (
      <div className="py-20">
        <AnalysisLoading />
      </div>
    );

  return (
    <div className="relative space-y-4">
      {/* 예산이 없을 때 보여줄 화면 */}
      {!totalBudget ? (
        <div className="py-20">
          <AnalysisEmpty
            title="이번 달 예산을 설정해 주세요"
            description="지출을 관리하기 위해 먼저 한 달 총 예산을 정해볼까요?"
            icon={Calculator}
          >
            <Button
              variant="secondary"
              className="bg-primary/5 hover:bg-primary/10 mt-2 cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              이번 달 예산 설정하기
            </Button>
          </AnalysisEmpty>
        </div>
      ) : (
        <>
          {/* 예산이 있을 때 보여줄 화면  */}
          <AnalysisSection title={'총 예산'}>
            <div className="flex flex-col items-center py-6">
              <div className="absolute top-8 right-8 flex gap-1">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground h-8 cursor-pointer px-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  수정
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive h-8 cursor-pointer px-2"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  초기화
                </Button>
              </div>

              {/* 메인 콘텐츠: 중앙 집중 */}
              <div className="space-y-1 text-center">
                <p className="text-muted-foreground text-base font-medium">
                  이번 달 총 예산
                </p>
                <p className="text-primary text-3xl font-bold tracking-tight">
                  {totalBudget.amount.toLocaleString()}
                  <span className="text-foreground text-lg font-normal">
                    {' '}
                    원
                  </span>
                </p>
              </div>
            </div>
          </AnalysisSection>
          <AnalysisSection title={'카테고리별 예산'}>카테고리</AnalysisSection>
        </>
      )}

      {/* 총 예산 설정 모달창 */}
      <BudgetSetupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        defaultAmount={totalBudget?.amount} // 기존 금액 전달
      />

      {/* 초기화 확인 모달창 */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => {
          removeBudget(null, {
            onSuccess: () => {
              setIsConfirmOpen(false); // 성공 후 닫기
            },
          });
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BudgetView;
