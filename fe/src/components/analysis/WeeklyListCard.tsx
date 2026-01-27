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
  };
};

const WeeklyListCard = ({ index, detail }: WeeklyListCardProps) => {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      {/* 요약 헤더 */}
      <div className="flex w-full items-center justify-between gap-2 p-4">
        <div className="pl-2">
          <div className="font-bold">{detail.label}</div>
          <span className="text-muted-foreground text-xs">
            ({detail.period})
          </span>
        </div>
        <div className="text-sm font-semibold md:text-base">
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
          <AccordionTrigger className="bg-brand-subtle dark:bg-brand/10 cursor-pointer p-4 shadow-sm">
            상세 거래 내역
          </AccordionTrigger>

          <AccordionContent className="p-0">
            <div className="bg-brand-neutral/15 space-y-3 divide-y rounded-b-xl px-3 py-1 md:px-6 md:py-2">
              {detail.transactions.length > 0 ? (
                detail.transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 py-2 text-xs tracking-tight break-keep md:text-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-[10px] md:text-xs">
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
                <p className="text-muted-foreground py-2 text-center text-xs">
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
