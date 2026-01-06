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
import { THEME_COLOR } from '@/constants/colors';
import { toast } from 'sonner';
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
  const [isTouched, setIsTouched] = useState(false); // 사용자가 입력창을 건드렸는지 여부

  const { saveBudget, isSaving } = useBudgetData(selectedDate);

  // 유효성 검사
  const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
  const isInvalid = numericAmount <= 0;

  useEffect(() => {
    if (open) setAmount(defaultAmount ? defaultAmount.toLocaleString() : '');

    setIsTouched(false);
  }, [open, defaultAmount]);

  const handleSave = () => {
    if (numericAmount <= 0) {
      toast.error('예산은 0원보다 커야 합니다.');
      return;
    }

    saveBudget(
      {
        amount: numericAmount,
        categoryId: null,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  // 금액 입력 시 콤마(,) 포맷팅 함수
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTouched) setIsTouched(true);

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
            {isTouched && isInvalid && (
              <p className={`text-sm ${THEME_COLOR.EXPENSE}`}>
                {amount === ''
                  ? '예산 금액을 입력해주세요.'
                  : '0보다 큰 숫자를 입력해야 합니다.'}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSave}
            disabled={isSaving || isInvalid}
          >
            {isSaving ? '저장 중' : '저장하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSetupDialog;
