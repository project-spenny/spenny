import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

type SavingGoalStepProps = {
  lastMonthIncome: number; // 가장 최근 수입 (기본값용)
};

const SavingGoalStep = ({ lastMonthIncome }: SavingGoalStepProps) => {
  const [income, setIncome] = useState<number>(lastMonthIncome || 0);
  const [savingsRate, setSavingsRate] = useState<number>(20); // 기본 저축률 20%

  const [savingsAmount, setSavingsAmount] = useState<number>(
    Math.floor((lastMonthIncome * 20) / 100) // 수입의 20%로 초기화
  );

  // 슬라이더 조절
  const handleSliderChange = (values: number[]) => {
    const rate = values[0];
    setSavingsRate(rate);
    setSavingsAmount(Math.floor((income * rate) / 100));
  };

  // 금액 직접 입력
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));

    if (income > 0) {
      const calculatedRate = Math.round((value / income) * 100);

      // 70% 제한 로직
      if (calculatedRate > 70) {
        setSavingsRate(70);
        setSavingsAmount(Math.floor((income * 70) / 100));
      } else {
        // 70% 이하일 때만 입력한 그대로 반영
        setSavingsRate(calculatedRate);
        setSavingsAmount(value);
      }
    } else {
      // 수입이 0인 경우 금액만 업데이트
      setSavingsAmount(value);
    }
  };

  // 수입 변경
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncome = Number(e.target.value);
    setIncome(newIncome);

    // 현재 설정된 저축률(savingsRate)에 맞춰 저축 금액 업데이트
    const newSavingsAmount = Math.floor((newIncome * savingsRate) / 100);
    setSavingsAmount(newSavingsAmount);
  };

  // 사용 가능한 예산
  const spendableBudget = income - savingsAmount || 0;

  return (
    <div className="animate-in fade-in slide-in-from-right-2 space-y-8 duration-300">
      <DialogHeader>
        <div className="text-primary font-bold uppercase">
          Step 2. 목표 설정
        </div>
        <DialogTitle className="text-xl font-bold">
          이번 달 수입과 저축 목표를 정해볼까요?
        </DialogTitle>

        <DialogDescription>
          이번 달 예상 수입은 지난 달 수입에 기반하여 제공됩니다.
        </DialogDescription>
      </DialogHeader>

      {/* 수입 입력 섹션 */}
      <div className="flex items-center justify-between rounded-xl">
        <div className="flex items-center">
          <Label htmlFor="income" className="text-base font-bold">
            이번 달 예상 수입
          </Label>
        </div>

        <div className="border-primary/20 focus-within:border-primary flex w-fit items-center gap-1 border-b-2">
          <input
            id="income"
            type="text"
            inputMode="numeric"
            value={income || ''}
            onChange={handleIncomeChange}
            className="w-32 text-right text-lg font-bold focus:outline-none"
            placeholder="0"
          />
          <span className="font-bold">원</span>
        </div>
      </div>

      {/* 저축 목표 슬라이더 */}
      <div className="space-y-6 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Label htmlFor="saving" className="text-base font-bold">
              저축 목표 ({savingsRate}%)
            </Label>
          </div>

          <div className="border-primary/20 focus-within:border-primary flex items-center gap-1 border-b-2">
            <input
              id="saving"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={savingsAmount || ''}
              onChange={handleAmountChange}
              className="w-32 text-right text-lg font-bold focus:outline-none"
              placeholder="0"
            />
            <span className="font-bold">원</span>
          </div>
        </div>

        <Slider
          value={[savingsRate]}
          onValueChange={handleSliderChange}
          max={70} // 최대 70%
          step={1}
          className="py-2"
        />

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>최소 0%</span>
            <span>적정 20~30%</span>
            <span>최대 70%</span>
          </div>

          {/* 최대치 도달 시 문구 표시 */}
          {savingsRate >= 70 && (
            <p className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1 pt-4 text-xs text-orange-400">
              <AlertTriangle className="h-3 w-3" />
              저축 목표는 최대 70%까지 설정할 수 있어요.
            </p>
          )}
        </div>
      </div>

      {/* 예산 미리보기 결과 */}
      <div className="space-y-2 py-2">
        <p className="font-bold">사용 가능한 한 달 예산</p>
        <p className="text-primary mt-1 text-2xl font-black tracking-tight">
          {Math.max(0, spendableBudget).toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default SavingGoalStep;
