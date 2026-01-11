import { CheckCircle2, Info } from 'lucide-react';

import { BUDGET_TEMPLATES } from '@/constants/budgetTemplates';
import { Card } from '@/components/ui/card';
import DialogStepHeader from '@/components/analysis/Budget/common/DialogStepHeader';
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
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
      <DialogStepHeader
        step={3}
        subTitle="예산 템플릿"
        title="어떤 방식으로 예산을 짤까요?"
        description="선택하신 템플릿에 따라 가용 예산이 카테고리별로 자동 배분됩니다."
      />

      {/* 템플릿 선택 섹션 */}
      <section className="flex flex-col gap-4">
        {BUDGET_TEMPLATES.map((template) => {
          const isSelected = selectedId === template.id;

          return (
            <Card
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={cn(
                'hover:border-primary/50 relative cursor-pointer gap-1 border-2 p-5 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-bold',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {template.subtitle}
                </span>
                {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              </div>

              <div>
                <p className="text-lg font-bold">{template.title}</p>
                <p className="text-muted-foreground mt-1 text-sm break-keep">
                  {template.description}
                </p>
              </div>
            </Card>
          );
        })}
      </section>

      <div className="text-muted-foreground flex gap-1 px-2 text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p className="break-keep">
          최근 {activeMonths}개월간의 소비 습관을 기반으로 카테고리별 가중치를
          계산하여 이번 달 예산을 자동으로 배분합니다.
        </p>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
