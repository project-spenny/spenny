import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { ChevronsRight } from 'lucide-react';
import { PanelProps } from '@/types/panel';

const SheetSide = ({ children, open, onOpenChange }: PanelProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[540px] max-w-none flex-col outline-none sm:max-w-none"
      >
        {/* DialogTitle 누락 방지 */}
        <SheetTitle className="sr-only">SheetSide</SheetTitle>
        <SheetDescription className="sr-only">SheetSide</SheetDescription>

        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="m-4 h-10 w-10 cursor-pointer rounded-full"
          >
            <ChevronsRight size={20} />
          </Button>
        </SheetClose>

        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetSide;
