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
import { ChevronRight } from 'lucide-react';
import { ChevronsRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const SheetSide = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="bg-primary hover:bg-primary/80 text-background cursor-pointer rounded-xl px-4 py-2">
          Open Sheet Side
        </div>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[540px] max-w-none flex-col outline-none sm:max-w-none"
      >
        {/* 1. 헤더 영역 (고정) */}
        <SheetHeader className="flex shrink-0 justify-between border-b p-4">
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              <ChevronsRight size={20} />
            </Button>
          </SheetClose>

          <div className="pl-2 text-left">
            <SheetTitle className="py-2 text-xl font-bold">
              12월 24일 수요일
            </SheetTitle>
            <SheetDescription>오늘 날짜 거래 내역</SheetDescription>
          </div>

          <SheetDescription className="text-right">총 3개</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-6">
            {/* 예시로 3개 */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-secondary/80 flex w-full items-center justify-between rounded-lg border p-6"
              >
                {/* 왼쪽 (금액/카테고리) */}
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-bold">-18,000</div>
                  <SheetDescription className="text-base font-semibold">
                    교통비
                  </SheetDescription>
                </div>
                {/* 오른쪽 (상세 내역 보기)) */}
                <div>
                  <Button
                    variant="outline"
                    className="bg-background/60 h-12 w-12 cursor-pointer rounded-full shadow-md"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="shrink-0 border-t p-6">
          <Button variant="outline" className="h-14 w-full text-base">
            이번 달 거래 내역 보러가기
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetSide;
