import { Button } from '../ui/button';
import { CATEGORY_MAP } from '@/constants/dummyData';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Transaction } from '@/types/testTransaction';
import { cn } from '@/lib/utils';

const TransactionSection = ({ data }: { data: Transaction[] }) => {
  const totalCount = data.length;
  // TODO: 선택된 날짜 데이터(data.date) 연동 및 포맷팅 필요
  const title = '12월 24일 수요일'; // 임시

  return (
    <>
      {/* 헤더 영역 */}
      <div className="flex shrink-0 flex-row items-center justify-between border-b p-4">
        <div className="text-left">
          {/* Title */}
          <div className="text-foreground py-2 text-xl font-bold">{title}</div>
          {/* SubTitle */}
          <div className="text-muted-foreground text-sm">
            해당 날짜 거래 내역을 확인할 수 있습니다.
          </div>
        </div>

        <div className="flex h-full items-end">
          {/* 총 개수 */}
          <div className="text-muted-foreground text-sm">총 {totalCount}개</div>
        </div>
      </div>

      {/* 콘텐츠 영역: 거래 내역 영역 */}
      {totalCount > 0 ? (
        <ScrollArea className="flex-1 overflow-y-auto">
          <section className="flex flex-col gap-4 p-6">
            {data.map((item) => (
              <TransactionItem key={item.id} item={item} />
            ))}
          </section>
        </ScrollArea>
      ) : (
        <div className="text-muted-foreground mt-4 text-center">
          거래 내역이 없습니다.
        </div>
      )}

      {/* 푸터 영역: 이번 달 거래 내역 버튼 */}
      <div className="shrink-0 border-t p-6">
        <Button
          variant="outline"
          className="h-14 w-full cursor-pointer text-base"
          asChild
        >
          <Link href="/history">이번 달 거래 내역 보러가기</Link>
        </Button>
      </div>
    </>
  );
};

export default TransactionSection;

const TransactionItem = ({ item }: { item: Transaction }) => {
  return (
    <div>
      <div className="bg-secondary/80 flex w-full items-center justify-between gap-4 rounded-lg border p-6">
        {/* 금액/카테고리 */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">{item.title}</div>
            <div className="text-muted-foreground text-sm font-medium">
              {CATEGORY_MAP[item.category_id]}
            </div>
          </div>

          <div
            className={cn(
              'text-lg font-bold',
              item.type === 'income' ? 'text-blue-400' : 'text-red-400'
            )}
          >
            {item.type === 'income' ? '+' : '-'}
            {item.amount.toLocaleString()}원
          </div>
        </div>

        {/* 상세 내역 보기 */}
        <div>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/60 h-12 w-12 cursor-pointer rounded-full shadow-md"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
