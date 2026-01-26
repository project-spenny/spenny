import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import { PanelProps } from '@/types/panel';
import { X } from 'lucide-react';

const DrawerBottom = ({ children, open, onOpenChange }: PanelProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed inset-0 flex h-full flex-col overflow-hidden rounded-none border-none outline-none">
        {/* DialogTitle 누락 방지 */}
        <DrawerTitle className="sr-only">DrawerBottom</DrawerTitle>
        <DrawerDescription className="sr-only">DrawerBottom</DrawerDescription>

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
