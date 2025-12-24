'use client';

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
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Transaction } from '@/types/testTransaction';
import TransactionSection from '@/components/common/TransactionSection';
import { X } from 'lucide-react';

export function DrawerBottom({ data }: { data: Transaction[] }) {
  const totalCount = data.length;

  return (
    <Drawer>
      <DrawerTrigger>
        <span className="cursor-pointer">Open Drawer Bottom</span>
      </DrawerTrigger>

      <DrawerContent className="h-[85vh] outline-none">
        {/* 헤더 영역: 날짜 및 닫기 버튼 */}
        <DrawerHeader className="relative flex shrink-0 flex-row items-center justify-between border-b px-6 py-4">
          <DrawerClose className="absolute top-0 right-0 mr-4" asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 cursor-pointer rounded-full"
            >
              <X />
            </Button>
          </DrawerClose>

          <div className="text-left">
            <DrawerTitle className="py-2 text-xl font-bold">
              12월 24일 수요일
            </DrawerTitle>
            <DrawerDescription>
              해당 날짜 거래 내역을 확인할 수 있습니다.
            </DrawerDescription>
          </div>

          <div className="flex h-full items-end">
            <DrawerDescription>총 {totalCount}개</DrawerDescription>
          </div>
        </DrawerHeader>

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
        <DrawerFooter className="shrink-0 border-t p-6">
          <Button
            variant="outline"
            className="h-14 w-full cursor-pointer text-base"
            asChild
          >
            <Link href="/history">이번 달 거래 내역 보러가기</Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
