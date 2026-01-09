import { CheckCircle2, Info } from 'lucide-react';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { BUDGET_TEMPLATES } from '@/constants/budgetTemplates';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TemplateId } from '@/types/budgetGuide';
import { cn } from '@/lib/utils';

type TemplateSelectionStepProps = {
  selectedId: TemplateId;
  onSelect: (id: TemplateId) => void;
  spendableBudget: number;
};

const TemplateSelectionStep = ({
  selectedId,
  onSelect,
  spendableBudget,
}: TemplateSelectionStepProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
      <DialogHeader className="space-y-2">
        <div className="space-y-1">
          <div className="text-primary font-bold uppercase">
            Step 3. 예산 템플릿
          </div>
          <DialogTitle className="text-xl font-bold">
            어떤 방식으로 예산을 짤까요?
          </DialogTitle>
        </div>

        <DialogDescription>
          선택하신 템플릿에 따라 가용 예산이 카테고리별로 자동 배분됩니다.
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

      <div className="text-muted-foreground flex gap-1 text-xs">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <p>
          최근 3개월간의 소비 습관을 기반으로 카테고리별 가중치를 계산하여 이번
          달 예산을 자동으로 배분합니다.
        </p>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
