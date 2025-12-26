import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import { PanelProps } from '@/types/panel';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DrawerBottom = ({
  children,
  open,
  onOpenChange,
  isFull = false,
}: PanelProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn('outline-none', isFull ? 'h-screen' : 'h-[80vh]')}
      >
        {/* DialogTitle 누락 방지 */}
        <DrawerTitle className="sr-only">DrawerBottom</DrawerTitle>

        <DrawerClose className="absolute top-0 right-0 z-10 m-4" asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 cursor-pointer rounded-full"
          >
            <X />
          </Button>
        </DrawerClose>

        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerBottom;
