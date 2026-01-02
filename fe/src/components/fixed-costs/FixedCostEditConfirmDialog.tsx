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

        <div className="mt-4 flex flex-col gap-2">
          <Button variant="outline" onClick={onApplyIncludeCurrent}>
            {unit} 포함 이후 전부 적용
          </Button>

          <Button variant="outline" onClick={onApplyExcludeCurrent}>
            {unit} 제외 이후 전부 적용
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
