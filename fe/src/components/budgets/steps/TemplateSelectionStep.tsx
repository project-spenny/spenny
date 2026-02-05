import { CheckCircle2, Info } from 'lucide-react';

import { BUDGET_TEMPLATES } from '@/constants/budget';
import { Card } from '@/components/ui/card';
import DialogStepHeader from '@/components/budgets/steps/DialogStepHeader';
import { TemplateId } from '@/types/budgetGuide';
import { cn } from '@/lib/utils';

type TemplateSelectionStepProps = {
  activeMonths: number;
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
};

const TemplateSelectionStep = ({
  activeMonths,
  selectedId,
  onSelect,
}: TemplateSelectionStepProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300 md:space-y-8">
      <DialogStepHeader
        step={3}
        subTitle="예산 템플릿"
        title="어떤 방식으로 예산을 짤까요?"
        description="선택하신 템플릿에 따라 가용 예산이 카테고리별로 자동 배분됩니다."
      />

      {/* 템플릿 선택 섹션 */}
      <section className="flex flex-col gap-2 md:gap-4">
        {BUDGET_TEMPLATES.map((template) => {
          const isSelected = selectedId === template.id;

          return (
            <Card
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={cn(
                'relative cursor-pointer gap-1 border-2 px-4 py-3 text-left transition-all md:px-5 md:py-4',
                isSelected
                  ? 'border-brand bg-brand-subtle dark:bg-brand/10 shadow-md'
                  : 'hover:border-brand/50 border-border/50'
              )}
            >
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-bold',
                    isSelected
                      ? 'bg-brand text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {template.subtitle}
                </p>
                {isSelected && (
                  <CheckCircle2 className="text-brand-strong h-4 w-4 shrink-0 md:h-5 md:w-5" />
                )}
              </div>

              <div>
                <p className="text-base font-bold md:text-lg">
                  {template.title}
                </p>
                <p className="text-muted-foreground mt-1 text-xs break-keep md:text-sm">
                  {template.description}
                </p>
              </div>
            </Card>
          );
        })}
      </section>

      <div className="text-muted-foreground flex items-center gap-1">
        <Info className="h-3 w-3 shrink-0" />
        <p className="text-[11px] break-keep md:text-xs">
          최근 {activeMonths}개월간의 소비를 기반으로 카테고리별 가중치를
          계산하여 이번 달 예산을 자동으로 배분합니다.
        </p>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
