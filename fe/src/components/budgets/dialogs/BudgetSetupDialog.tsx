import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_BUDGET_AMOUNT } from '@/constants/budget';
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
  const [isFocused, setIsFocused] = useState(false);

  const { saveBudget, isSaving } = useBudgetData(selectedDate);

  // 유효성 검사
  const numericAmount = Number(amount);
  const isOverLimit = numericAmount > MAX_BUDGET_AMOUNT; // 10억 초과 여부
  const isInvalid = numericAmount <= 0 || isOverLimit; // 0 이하이거나 최대치 초과면 Invalid
  // 변경 여부 확인 (기존 값과 비교)
  const isChanged = defaultAmount !== numericAmount;

  useEffect(() => {
    if (open) setAmount(defaultAmount ? defaultAmount.toString() : '');

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

    // 10억 초과 입력 시도 시 10억으로 고정
    if (Number(value) > MAX_BUDGET_AMOUNT) {
      setAmount(MAX_BUDGET_AMOUNT.toString());
      return;
    }

    setAmount(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">월 예산 설정</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            지출 계획을 세우기 위해 이번 달 총 예산을 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="md:py-2">
          <div className="space-y-2">
            <Label htmlFor="total-amount">목표 금액 (원)</Label>
            <Input
              id="total-amount"
              type="text"
              inputMode="numeric"
              placeholder="예: 1,000,000"
              value={
                isFocused
                  ? amount
                  : amount !== ''
                    ? Number(amount).toLocaleString()
                    : ''
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleAmountChange}
              className="focus-visible:ring-brand-soft text-sm font-semibold tracking-tight md:text-base"
            />

            {isTouched && (
              <div className={`text-destructive space-y-1 text-xs md:text-sm`}>
                {numericAmount <= 0 && amount !== '' && (
                  <p>0보다 큰 숫자를 입력해야 합니다.</p>
                )}
                {amount === '' && <p>예산 금액을 입력해주세요.</p>}

                {numericAmount >= MAX_BUDGET_AMOUNT && (
                  <p>최대 10억 원까지 설정 가능합니다.</p>
                )}
              </div>
            )}

            {!isInvalid && !isChanged && defaultAmount !== undefined && (
              <p className="text-muted-foreground text-xs md:text-sm">
                기존에 설정된 금액과 동일합니다.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSave}
            disabled={isSaving || isInvalid || !isChanged}
          >
            {isSaving ? '저장 중' : '저장하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSetupDialog;
