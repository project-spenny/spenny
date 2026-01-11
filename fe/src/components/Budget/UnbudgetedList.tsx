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
      <Separator className="my-10" />

      <div className="flex w-full flex-col items-center">
        <div className="mt-4 w-full max-w-lg">
          <div className="mb-4 flex flex-col justify-between px-1 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="text-foreground text-sm font-bold">
                예산 미설정 지출
              </span>
              <span
                className={cn(
                  'bg-destructive/10 rounded-full px-2 py-0.5 text-xs font-bold',
                  THEME_COLOR.EXPENSE
                )}
              >
                {items.length}
              </span>
            </div>
            <span className="text-muted-foreground text-xs md:mt-0">
              설정하기를 눌러 예산을 설정해주세요
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="border-muted-foreground/30 bg-card rounded-xl border border-dashed p-5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground text-base font-bold transition-colors">
                        {item.name}
                      </p>
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                        미설정
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">
                      <span className="text-foreground">
                        {item.amount.toLocaleString()}원
                      </span>{' '}
                      지출됨
                    </p>
                  </div>

                  {/* 오른쪽 액션 아이콘 */}
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-1 hover:underline"
                      onClick={() => onSetBudget(item.key)}
                    >
                      <span className="text-xs font-bold">설정하기</span>
                      <Edit className="h-4 w-4 group-hover:hidden" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnbudgetedList;
