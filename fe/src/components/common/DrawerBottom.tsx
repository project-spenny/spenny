import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Transaction } from '@/types/testTransaction';
import TransactionSection from '@/components/common/TransactionSection';
import { X } from 'lucide-react';

interface DrawerBottomProps {
  data: Transaction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrawerBottom({ data, open, onOpenChange }: DrawerBottomProps) {
  const totalCount = data.length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
            {/* TODO: 선택된 날짜 데이터(item.date) 연동 및 포맷팅 필요 */}
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
        {totalCount > 0 ? (
          <TransactionSection data={data} />
        ) : (
          <div className="text-muted-foreground mt-4 text-center">
            거래 내역이 없습니다.
          </div>
        )}

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
