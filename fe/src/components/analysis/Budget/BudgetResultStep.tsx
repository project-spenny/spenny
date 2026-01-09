import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { BUDGET_GROUPS } from '@/constants/analysis';
import { Badge } from '@/components/ui/badge';
import BudgetResultRow from './BudgetResultRow';
import { CalculatedBudgetItem } from '@/types/budgetGuide';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type BudgetResultStepProps = {
  budgetDraft: CalculatedBudgetItem[];
  spendableBudget: number;
};
const BudgetResultStep = ({
  budgetDraft,
  spendableBudget,
}: BudgetResultStepProps) => {
  const essentialGroup = BUDGET_GROUPS.find((g) => g.id === 'essential')!;
  const flexibleGroup = BUDGET_GROUPS.find((g) => g.id === 'flexible')!;

  // 그룹별로 데이터 분류
  const essentialItems = budgetDraft.filter(
    (item) => item.groupId === 'essential'
  );
  const flexibleItems = budgetDraft.filter(
    (item) => item.groupId === 'flexible'
  );

  // 그룹별 합계 계산
  const essentialTotal = essentialItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const flexibleTotal = flexibleItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // 전체 예산 대비 그룹별 비중(%) 계산
  const essentialPercent = Math.round(
    (essentialTotal / (spendableBudget || 1)) * 100
  );
  const flexiblePercent = Math.round(
    (flexibleTotal / (spendableBudget || 1)) * 100
  );

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader className="space-y-2">
        <div className="space-y-1">
          <div className="text-primary font-bold uppercase">
            Step 4. 예산 산출 결과 확인
          </div>
          <DialogTitle className="text-xl font-bold">
            이번 달, 이렇게 소비해 보는 건 어떨까요?
          </DialogTitle>
        </div>

        <DialogDescription>
          수입과 지출 습관을 바탕으로 항목별 예산을 나누었습니다.
          <br />
          확인 후 아래 버튼을 눌러 이번 달 자산 관리를 시작해 보세요!
        </DialogDescription>
      </DialogHeader>

      {/* 가용 예산 카드 */}
      <Card className="gap-2 p-5">
        <p>이번 달 가용 지출 예산</p>

        <div className="flex items-baseline gap-1 font-bold">
          <span className="text-2xl tracking-tight">
            {spendableBudget.toLocaleString()}
          </span>
          <span className="text-sm">원</span>
        </div>

        <div className="text-muted-foreground mt-2 flex gap-1 text-xs">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <p>수입에서 저축 목표를 제외한 금액입니다.</p>
        </div>
      </Card>

      <Separator />

      <div className="space-y-10">
        {/* 필수 지출 섹션 */}
        <div className="group space-y-4">
          <div className="flex items-end justify-between px-1">
            <div className="space-y-1">
              <h3
                className={`flex items-center gap-2 text-lg font-bold ${essentialGroup.textColor}`}
              >
                필수 지출
                <Badge
                  className={`${essentialGroup.badgeColor} px-2 py-0.5 font-bold`}
                >
                  {essentialPercent}%
                </Badge>
              </h3>
              <p className="text-muted-foreground text-xs font-medium">
                {essentialGroup.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-800">
                {essentialTotal.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {essentialItems.map((item) => (
              <BudgetResultRow
                key={item.categoryId}
                item={item}
                badgeColor={essentialGroup.badgeColor}
              />
            ))}
          </div>
        </div>

        {/* 유연 지출 섹션 */}
        <div className="group space-y-4">
          <div className="flex items-end justify-between px-1">
            <div className="space-y-1">
              <h3
                className={`flex items-center gap-2 text-lg font-bold ${flexibleGroup.textColor}`}
              >
                유연 지출
                <Badge
                  className={`${flexibleGroup.badgeColor} px-2 py-0.5 font-bold`}
                >
                  {flexiblePercent}%
                </Badge>
              </h3>
              <p className="text-muted-foreground text-xs font-medium">
                {flexibleGroup.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-800">
                {flexibleTotal.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {flexibleItems.map((item) => (
              <BudgetResultRow
                key={item.categoryId}
                item={item}
                badgeColor={flexibleGroup.badgeColor}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-muted-foreground flex gap-1 px-2 text-xs">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <p>
          과거 소비 비중을 바탕으로 산출된 예산입니다. 100원 단위 미만의 잔돈은
          가장 지출 비중이 높은 항목에 자동으로 포함되었습니다.
        </p>
      </div>
    </div>
  );
};

export default BudgetResultStep;
