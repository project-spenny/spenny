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
    <div className="space-y-4">
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
            <div className="relative flex flex-col items-center">
              {/* 수정 버튼 */}
              <Button
                variant="ghost"
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                수정
              </Button>

              <Button
                variant="ghost"
                className="text-destructive cursor-pointer"
                onClick={() => setIsConfirmOpen(true)}
              >
                예산 초기화
              </Button>

              <div className="p-4 text-center">
                <p className="text-muted-foreground">이번 달 총 예산</p>
                <p className="text-2xl font-bold">
                  {totalBudget.amount.toLocaleString()}원
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
