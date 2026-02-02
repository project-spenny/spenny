import DialogStepHeader from '@/components/budgets/steps/DialogStepHeader';
import { Label } from '@/components/ui/label';
import { MAX_BUDGET_AMOUNT } from '@/constants/budget';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

type SavingGoalStepProps = {
  income: number;
  savingsAmount: number;
  onChange: (income: number, savingsAmount: number) => void;
};

const SavingGoalStep = ({
  income,
  savingsAmount,
  onChange,
}: SavingGoalStepProps) => {
  const [isIncomeFocused, setIsIncomeFocused] = useState(false);
  const [isSavingsFocused, setIsSavingsFocused] = useState(false);

  const savingsRate =
    income > 0 ? Math.round((savingsAmount / income) * 100) : 0;
  const spendableBudget = income - savingsAmount || 0;

  // 슬라이더 변경 시
  const handleSliderChange = (values: number[]) => {
    const rate = values[0];
    const newAmount = Math.floor((income * rate) / 100);

    onChange(income, newAmount);
  };

  // 수입 입력 시
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));

    let newIncome = value;
    if (value > MAX_BUDGET_AMOUNT) {
      newIncome = MAX_BUDGET_AMOUNT;
    }

    // 현재 설정된 저축률(savingsRate)에 맞춰 저축 금액 업데이트
    const newAmount = Math.floor((newIncome * savingsRate) / 100);

    onChange(newIncome, newAmount);
  };

  // 저축 금액 입력 시
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));

    let newAmount = value > MAX_BUDGET_AMOUNT ? MAX_BUDGET_AMOUNT : value;

    // 70% 제한 로직
    if (income > 0) {
      const calculatedRate = Math.round((value / income) * 100);
      if (calculatedRate > 70) {
        newAmount = Math.floor((income * 70) / 100);
      }
    }

    onChange(income, newAmount);
  };

  const titleDesc =
    income === 0
      ? '수입과 저축 목표를 입력해 주세요. 입력하신 금액을 바탕으로 이번 달 예산을 추천해 드릴게요.'
      : '지난 소비 데이터를 기반으로 이번 달 예산을 미리 구성해 보았습니다. 필요에 따라 금액을 직접 수정해 보세요.';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-300">
      <DialogStepHeader
        step={2}
        subTitle="저축 및 가용 예산 목표 설정"
        title="얼마를 저축하고 얼마를 쓰실 건가요?"
        description={titleDesc}
      />

      {/* 수입 입력 섹션 */}
      <div className="flex items-center justify-between rounded-xl">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <Label htmlFor="income" className="text-base font-bold">
            이번 달 예상 수입
          </Label>

          {income === 0 && (
            <p className="animate-in fade-in slide-in-from-top-1 text-destructive flex items-center gap-1 text-xs">
              수입을 먼저 입력해 주세요.
            </p>
          )}
          {income >= MAX_BUDGET_AMOUNT && (
            <p className="animate-in fade-in slide-in-from-top-1 text-destructive flex items-center gap-1 text-xs">
              최대 10억 원까지 입력 가능합니다.
            </p>
          )}
        </div>

        <div className="border-primary/20 focus-within:border-brand flex w-fit items-center gap-1 border-b-2">
          <input
            id="income"
            type="text"
            inputMode="numeric"
            value={
              isIncomeFocused
                ? income || ''
                : income !== 0
                  ? income.toLocaleString()
                  : ''
            }
            onFocus={() => setIsIncomeFocused(true)}
            onBlur={() => setIsIncomeFocused(false)}
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

          <div className="border-primary/20 focus-within:border-brand flex items-center gap-1 border-b-2">
            <input
              id="saving"
              type="text"
              inputMode="numeric"
              value={
                isSavingsFocused
                  ? savingsAmount || ''
                  : savingsAmount !== 0
                    ? savingsAmount.toLocaleString()
                    : ''
              }
              onFocus={() => setIsSavingsFocused(true)}
              onBlur={() => setIsSavingsFocused(false)}
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
          className="**:data-[slot=slider-range]:bg-brand py-2"
        />

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>최소 0%</span>
            <span>적정 20~30%</span>
            <span>최대 70%</span>
          </div>

          {/* 최대치 도달 시 문구 표시 */}
          {savingsRate >= 70 && (
            <p className="animate-in fade-in slide-in-from-top-1 text-destructive flex items-center gap-1 text-xs">
              저축 목표는 최대 70%까지 설정할 수 있어요.
            </p>
          )}
        </div>
      </div>

      {/* 예산 미리보기 결과 */}
      <div className="space-y-2 py-2">
        <p className="font-bold">사용 가능한 한 달 예산</p>
        <p className="text-brand mt-1 text-2xl font-black tracking-tight">
          {Math.max(0, spendableBudget).toLocaleString()}원
        </p>
      </div>
    </div>
  );
};

export default SavingGoalStep;
