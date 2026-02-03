import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { THEME_COLOR } from '@/constants/colors';
import { cn } from '@/lib/utils';

type UnbudgetedItem = {
  key: string;
  amount: number;
  name: string;
};

type UnbudgetedListProps = {
  items: UnbudgetedItem[];
  onSetBudget: (key: string) => void;
};

const UnbudgetedList = ({ items, onSetBudget }: UnbudgetedListProps) => {
  if (items.length === 0) return null;

  return (
    <>
      <Separator className="my-4 md:my-8" />

      <div className="flex w-full flex-col items-center">
        <div className="mt-4 w-full max-w-lg">
          <div className="mb-4 flex flex-col justify-between md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="text-foreground text-sm font-bold md:text-base">
                예산 미설정 지출
              </span>
              <span
                className={cn(
                  'bg-destructive/10 rounded-full px-1.5 py-0.5 text-xs text-[10px] font-bold',
                  THEME_COLOR.EXPENSE
                )}
              >
                {items.length}
              </span>
            </div>
            <span className="text-muted-foreground pt-1 text-xs">
              설정하기를 눌러 예산을 설정해주세요
            </span>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            {items.map((item) => (
              <Card key={item.key} className="px-4 py-3 md:px-5 md:py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground text-sm font-bold transition-colors md:text-base">
                        {item.name}
                      </p>

                      <Badge className="bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] md:text-xs">
                        미설정
                      </Badge>
                    </div>

                    <p className="text-xs md:text-sm">
                      <span className={`font-semibold ${THEME_COLOR.EXPENSE}`}>
                        {item.amount.toLocaleString()}원
                      </span>{' '}
                      <span className="text-xs md:text-sm">지출됨</span>
                    </p>
                  </div>

                  {/* 오른쪽 아이콘 */}
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-1 hover:underline"
                      onClick={() => onSetBudget(item.key)}
                    >
                      <span className="text-[11px] font-bold md:text-xs">
                        설정하기
                      </span>
                      <Edit className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnbudgetedList;
