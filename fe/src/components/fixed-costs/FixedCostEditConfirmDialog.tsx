'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';

type FixedCostEditConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasScheduleChange?: boolean;
  cycle: 'WEEKLY' | 'MONTHLY';
  onApplyIncludeCurrent: () => void;
  onApplyExcludeCurrent: () => void;
  pending?: boolean;
};

export default function FixedCostEditConfirmDialog({
  open,
  onOpenChange,
  hasScheduleChange = false,
  cycle,
  onApplyIncludeCurrent,
  onApplyExcludeCurrent,
  pending = false,
}: FixedCostEditConfirmDialogProps) {
  const unit = cycle === 'WEEKLY' ? '이번주' : '이번달';
  const includeDisabled = pending || hasScheduleChange;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>고정비 수정 적용 범위</DialogTitle>
          <DialogDescription>
            수정한 내용을 어디까지 적용할지 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        {hasScheduleChange && (
          <div className="bg-muted/40 mt-2 rounded-md border p-3 text-sm">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <p className="ml-2 font-medium">반복 날짜 변경 안내</p>
            </div>
            <p className="text-muted-foreground mt-1">
              반복 날짜(발생일/요일) 변경은 중복 생성 방지를 위해
              <br />
              <span className="font-bold">{unit}부터는 적용되지 않고</span>,
              다음 기간부터 적용됩니다.
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-md border p-3">
            <Button
              className="w-full"
              onClick={onApplyIncludeCurrent}
              disabled={includeDisabled}
            >
              {unit} 포함 이후 전부 적용
            </Button>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
              {!hasScheduleChange ? (
                <>
                  <Info className="h-3 w-3" />
                  이미 생성된 {unit} 거래도 새 규칙으로 수정됩니다.
                </>
              ) : (
                <>
                  <Info className="h-3 w-3" />
                  반복 날짜 변경이 포함되어 있어 선택할 수 없습니다.
                </>
              )}
            </p>
          </div>

          <div className="rounded-md border p-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={onApplyExcludeCurrent}
              disabled={pending}
            >
              {unit} 제외 이후 전부 적용
            </Button>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
              <Info className="h-3 w-3" />
              {unit} 거래는 유지되고 다음 기간부터 적용됩니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
