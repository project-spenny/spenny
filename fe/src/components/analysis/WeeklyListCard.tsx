import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Card } from '@/components/ui/card';
import { TransactionAnalysis } from '@/types/analysis';

type WeeklyListCardProps = {
  index: number;
  detail: {
    label: string;
    period: string;
    amount: number;
    transactions: TransactionAnalysis[];
    isCurrentWeek: boolean;
  };
};

const WeeklyListCard = ({ index, detail }: WeeklyListCardProps) => {
  return (
    <Card className="border-border/50 gap-0 overflow-hidden p-0">
      {/* 요약 헤더 */}
      <div className="flex w-full items-center justify-between gap-2 px-4 py-2 md:px-6 md:py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm font-bold tracking-tight whitespace-nowrap">
              {detail.label}
            </span>

            {detail.isCurrentWeek && (
              <div className="bg-brand/10 text-brand ring-brand/20 rounded-full px-1.5 py-0.5 text-[11px] font-bold whitespace-nowrap ring-1 ring-inset">
                이번 주
              </div>
            )}
          </div>

          <span className="text-muted-foreground text-[11px] tracking-tight md:text-xs">
            ({detail.period})
          </span>
        </div>
        <div className="shrink-0 text-xs font-semibold whitespace-nowrap md:text-sm">
          {detail.amount.toLocaleString()}원
        </div>
      </div>

      {/* 토글 상세 내역 */}
      <Accordion
        type="single"
        collapsible
        key={index}
        defaultValue="detail"
        className="w-full"
      >
        <AccordionItem value="detail" className="border-none">
          <AccordionTrigger className="bg-brand-subtle dark:bg-brand/10 cursor-pointer p-4 text-xs shadow-sm md:text-sm">
            상세 거래 내역
          </AccordionTrigger>

          <AccordionContent className="p-0">
            <div className="bg-brand-neutral/15 divide-y rounded-b-xl px-4 py-2 md:px-6 md:py-2">
              {detail.transactions.length > 0 ? (
                detail.transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 py-2 text-xs tracking-tight break-keep md:text-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-[11px] md:text-xs">
                        {t.category?.name_ko}
                      </span>
                      <span className="font-semibold">{t.title}</span>
                    </div>
                    <span className="font-semibold">
                      {t.amount.toLocaleString()}원
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground py-2 text-center text-xs md:text-sm">
                  이 기간에는 거래 내역이 없어요.
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default WeeklyListCard;
