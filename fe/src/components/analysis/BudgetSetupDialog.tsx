import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import useBudgetData from '@/hooks/useBudgetData';

type BudgetSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  defaultAmount?: number; // 기존 금액 전달용
};

const BudgetSetupDialog = ({
  open,
  onOpenChange,
  selectedDate,
  defaultAmount,
}: BudgetSetupDialogProps) => {
  const [amount, setAmount] = useState<string>(
    defaultAmount ? defaultAmount.toLocaleString() : ''
  );
  const { saveBudget, isSaving } = useBudgetData(selectedDate);

  useEffect(() => {
    if (open) setAmount(defaultAmount ? defaultAmount.toLocaleString() : '');
  }, [open, defaultAmount]);

  const handleSave = async () => {
    saveBudget(
      {
        amount: Number(amount.replace(/[^0-9]/g, '')),
        categoryId: null,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  // 금액 입력 시 콤마(,) 포맷팅 함수
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value ? Number(value).toLocaleString() : '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">💰 월 예산 설정</DialogTitle>
          <DialogDescription>
            지출 계획을 세우기 위해 이번 달 총 예산을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="total-amount">목표 금액 (원)</Label>
            <Input
              id="total-amount"
              type="text"
              inputMode="numeric"
              placeholder="예: 500,000"
              value={amount}
              onChange={handleAmountChange}
              className="text-lg font-semibold"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중' : '설정 완료'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSetupDialog;
