import { CheckCircle2, Info, Lightbulb } from 'lucide-react';

import { BUDGET_GROUPS } from '@/constants/budget';
import { BUDGET_TEMPLATES } from '@/constants/budget';
import { Badge } from '@/components/ui/badge';
import BudgetResultSection from '@/components/budgets/steps/BudgetResultSection';
import { CalculatedBudgetItem } from '@/types/budgetGuide';
import { Card } from '@/components/ui/card';
import DialogStepHeader from '@/components/budgets/steps/DialogStepHeader';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type BudgetResultStepProps = {
  activeMonths: number;
  budgetDraft: CalculatedBudgetItem[];
  spendableBudget: number;
  isAdjusted: boolean;
  templateId: string;
};
const BudgetResultStep = ({
  activeMonths,
  budgetDraft,
  spendableBudget,
  isAdjusted,
  templateId,
}: BudgetResultStepProps) => {
  const essentialGroup = BUDGET_GROUPS.find((g) => g.id === 'essential')!;
  const flexibleGroup = BUDGET_GROUPS.find((g) => g.id === 'flexible')!;
  const currentTemplate = BUDGET_TEMPLATES.find((t) => t.id === templateId);

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

  // 1. 전체 예산 대비 그룹별 비중(%) 계산 (소수점 첫째 자리까지)
  const getPercent = (total: number) => {
    if (!spendableBudget || spendableBudget === 0) return 0;
    return Math.round((total / spendableBudget) * 1000) / 10;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <DialogStepHeader
        step={4}
        subTitle="예산 산출 결과 확인"
        title="이번 달, 이렇게 소비해 보는 건 어떨까요?"
        description="최근 지출 패턴을 분석하여 항목별 최적 예산을 제안해 드려요. 확인 후 아래 버튼을 눌러 계획적인 자산 관리를 시작해 보세요!"
      />

      {/* 조정 상태 피드백 섹션 */}
      <Card className="border-border/50 flex flex-col gap-3 rounded-xl border p-4 transition-all">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-1">
            {isAdjusted ? (
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-600 md:h-4 md:w-4" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 md:h-4 md:w-4" />
            )}
            <span className="text-sm font-bold md:text-base">
              {currentTemplate?.title || '맞춤 예산'} 적용 결과
            </span>
          </div>

          <Badge
            className={cn(
              'px-1.5 py-0.5 text-[10px] font-bold md:text-xs',
              isAdjusted
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
            )}
          >
            {isAdjusted ? '조정됨' : '기준 만족'}
          </Badge>
        </div>

        <p className="text-muted-foreground text-xs md:text-sm">
          {templateId === 'keep-pattern'
            ? `최근 ${activeMonths}개월간의 지출 패턴을 그대로 반영하여 예산을 구성했습니다.`
            : isAdjusted
              ? `유연 지출 비중이 기준보다 높아, 목표 비중에 맞춰 예산을 효율적으로 재배분했습니다.`
              : `이미 선택하신 ${currentTemplate?.title}의 지출 기준을 잘 지키고 계시네요!`}
        </p>

        <Separator />

        <div className="flex items-center justify-between px-2 text-[11px] md:text-xs">
          <span className="text-muted-foreground">유연 지출 비중</span>
          <span
            className={cn(
              'font-bold',
              isAdjusted
                ? 'text-amber-700 dark:text-amber-300'
                : 'text-emerald-700 dark:text-emerald-300'
            )}
          >
            {getPercent(flexibleTotal)}%{' '}
            <span className="font-normal">
              {currentTemplate?.flexibleLimitRatio
                ? `(Max ${currentTemplate.flexibleLimitRatio * 100}%)`
                : ''}
            </span>
          </span>
        </div>
      </Card>

      <Separator />

      <section className="space-y-6 md:space-y-8">
        {/* 가용 예산 카드 */}
        <Card className="border-border/50 gap-1 px-5 py-4">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <p className="text-sm md:text-base">이번 달 가용 지출 예산</p>

            <div className="text-brand flex items-baseline gap-1 font-bold">
              <span className="text-base tracking-tight md:text-xl">
                {spendableBudget.toLocaleString()}
              </span>
              <span className="text-base">원</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-1 text-[11px] md:text-xs">
            <Info className="h-3 w-3 shrink-0" />
            <p>수입에서 저축 목표를 제외한 금액입니다.</p>
          </div>
        </Card>

        {/* 필수 지출 섹션 */}
        <BudgetResultSection
          title="필수 지출"
          totalAmount={essentialTotal}
          percent={getPercent(essentialTotal)}
          description={essentialGroup.description}
          items={essentialItems}
          textColor={essentialGroup.textColor}
          badgeColor={essentialGroup.badgeColor}
        />

        {/* 유연 지출 섹션 */}
        <BudgetResultSection
          title="유연 지출"
          totalAmount={flexibleTotal}
          percent={getPercent(flexibleTotal)}
          description={flexibleGroup.description}
          items={flexibleItems}
          textColor={flexibleGroup.textColor}
          badgeColor={flexibleGroup.badgeColor}
        />
      </section>

      <div className="text-muted-foreground flex items-center gap-1 text-[11px] md:text-xs">
        <Info className="h-3 w-3 shrink-0" />
        <p className="break-keep">
          과거 소비 비중을 반영해 관리하기 편한 100원 단위로 산출되었습니다.
        </p>
      </div>
    </div>
  );
};

export default BudgetResultStep;
