'use client';

import { ChevronRight, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DrawerBottom() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer Bottom</Button>
      </DrawerTrigger>

      <DrawerContent className="h-[85vh] outline-none">
        {/* 헤더 영역: 날짜 및 닫기 버튼 */}
        <DrawerHeader className="flex shrink-0 flex-row items-center justify-between border-b px-6 py-4">
          <div className="text-left">
            <DrawerTitle className="text-xl font-bold">
              12월 24일 수요일
            </DrawerTitle>
            <DrawerDescription>오늘 날짜 거래 내역</DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* 콘텐츠 영역: 거래 내역 영역 */}
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
                  <DrawerDescription className="text-base font-semibold">
                    교통비
                  </DrawerDescription>
                </div>
                {/* 오른쪽 (상세 내역 보기)) */}
                <div>
                  <Button
                    variant="outline"
                    className="bg-background/60 h-15 w-15 cursor-pointer rounded-full shadow-md"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 푸터 영역: 이번 달 거래 내역 버튼 */}
        <DrawerFooter className="shrink-0 border-t p-6">
          <Button variant="outline" className="h-14 w-full text-base">
            이번 달 거래 내역 보러가기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
