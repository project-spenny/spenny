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
        className={cn(
          'flex-col overflow-hidden outline-none',
          isFull ? 'h-screen' : 'h-[80vh]'
        )}
      >
        {/* DialogTitle 누락 방지 */}
        <DrawerTitle className="sr-only">DrawerBottom</DrawerTitle>

        <div className="flex justify-end pr-2">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 cursor-pointer rounded-full"
            >
              <X />
            </Button>
          </DrawerClose>
        </div>

        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerBottom;
