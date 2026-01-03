'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type FixedCostEditConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle: 'WEEKLY' | 'MONTHLY';
  onApplyIncludeCurrent: () => void;
  onApplyExcludeCurrent: () => void;
};

export default function FixedCostEditConfirmDialog({
  open,
  onOpenChange,
  cycle,
  onApplyIncludeCurrent,
  onApplyExcludeCurrent,
}: FixedCostEditConfirmDialogProps) {
  const unit = cycle === 'WEEKLY' ? '이번주' : '이번달';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>고정비 수정 적용 범위</DialogTitle>
          <DialogDescription>
            수정한 내용을 어디까지 적용할지 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-md border p-3">
            <Button className="w-full" onClick={onApplyIncludeCurrent}>
              {unit} 포함 이후 전부 적용
            </Button>
            <p className="text-muted-foreground mt-1 text-sm">
              이미 생성된 {unit} 거래도 새 규칙으로 수정됩니다.
            </p>
          </div>

          <div className="rounded-md border p-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={onApplyExcludeCurrent}
            >
              {unit} 제외 이후 전부 적용
            </Button>
            <p className="text-muted-foreground mt-1 text-sm">
              {unit} 거래는 유지되고 다음 기간부터 적용됩니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
