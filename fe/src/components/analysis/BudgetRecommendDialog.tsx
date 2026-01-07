import { ArrowRight, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useState } from 'react';

type BudgetRecommendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
};

const BudgetRecommendDialog = ({
  open,
  onOpenChange,
  selectedDate,
}: BudgetRecommendDialogProps) => {
  const [step, setStep] = useState(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[800px] w-full flex-col md:max-w-2xl">
        {/* 상단 Step 표시 */}
        <div className="px-6 pt-6">
          <Progress value={(step / 3) * 100} className="h-1" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
              <header className="space-y-2">
                <div className="font-semibold">소비 패턴 분석</div>
                <DialogTitle className="text-lg font-bold">
                  최근 3개월 지출을 그룹별로 분석해봤어요
                </DialogTitle>
                <DialogDescription>
                  가장 정교한 예산 초안을 만들기 위한 데이터입니다.
                </DialogDescription>
              </header>

              {/* 그룹별 비중 바 차트 */}
              <div className="space-y-3">그룹별 비중 바 차트</div>

              {/* 분석 인사이트 */}
              <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
                분석 인사이트
              </div>

              {/* 상세 리스트 */}
              <div className="space-y-2 pt-2">상세 리스트</div>
            </div>
          )}

          {/* step 2, 3 등 추후 추가 예정 */}
          {step === 2 && (
            <div className="text-muted-foreground py-10 text-center italic">
              템플릿 선택 화면 준비 중...
            </div>
          )}
        </div>

        <DialogFooter className="border-t p-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="h-12 flex-1 cursor-pointer text-base font-bold"
                  onClick={() => setStep(step - 1)}
                >
                  이전
                </Button>
              )}
              <Button
                className="h-12 flex-2 cursor-pointer text-base font-bold"
                onClick={() => setStep(step + 1)}
              >
                {step === 1 ? '내게 맞는 템플릿 선택하기' : '다음 단계'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-1 text-xs">
              <Info className="h-3 w-3" />
              과거 소비 비중을 가중치로 활용하여 분배됩니다.
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetRecommendDialog;
