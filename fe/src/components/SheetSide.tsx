'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from './ui/button';
import { ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Transaction } from '@/types/testTransaction';
import TransactionSection from '@/components/common/TransactionSection';

const SheetSide = ({ data }: { data: Transaction[] }) => {
  const totalCount = data.length;

  return (
    <Sheet>
      <SheetTrigger>
        <span className="cursor-pointer">Open Sheet Side</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[540px] max-w-none flex-col outline-none sm:max-w-none"
      >
        {/* 헤더 영역: 날짜 및 닫기 버튼 */}
        <SheetHeader className="flex shrink-0 justify-between border-b p-4">
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 cursor-pointer rounded-full"
            >
              <ChevronsRight size={20} />
            </Button>
          </SheetClose>

          <div className="pl-2 text-left">
            <SheetTitle className="py-2 text-xl font-bold">
              12월 24일 수요일
            </SheetTitle>
            <SheetDescription>
              해당 날짜 거래 내역을 확인할 수 있습니다.
            </SheetDescription>
          </div>

          <SheetDescription className="text-right">
            총 {totalCount}개
          </SheetDescription>
        </SheetHeader>

        {/* 콘텐츠 영역: 거래 내역 영역 */}
        <ScrollArea className="flex-1 overflow-y-auto">
          {totalCount > 0 ? (
            <TransactionSection data={data} />
          ) : (
            <div className="text-muted-foreground text-center">
              거래 내역이 없습니다.
            </div>
          )}
        </ScrollArea>

        {/* 푸터 영역: 이번 달 거래 내역 버튼 */}
        <SheetFooter className="shrink-0 border-t p-6">
          <Button
            variant="outline"
            className="h-14 w-full cursor-pointer text-base"
            asChild
          >
            <Link href="/history">이번 달 거래 내역 보러가기</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetSide;
