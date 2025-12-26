'use client';

import DrawerBottom from '@/components/panel/DrawerBottom';
import { ResponsivePanelProps } from '@/types/panel';
import ResponsiveWrapper from '@/components/panel/ResponsiveWrapper';
import SheetSide from '@/components/panel/SheetSide';
import { useState } from 'react';

const ResponsivePanel = ({
  trigger,
  children,
  isFull = false,
}: ResponsivePanelProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <div
        className="inline-block cursor-pointer"
        onClick={() => setIsPanelOpen(true)}
      >
        {trigger}
      </div>

      <ResponsiveWrapper
        mobile={
          <DrawerBottom
            open={isPanelOpen}
            onOpenChange={setIsPanelOpen}
            isFull={isFull}
          >
            {children}
          </DrawerBottom>
        }
        desktop={
          <SheetSide open={isPanelOpen} onOpenChange={setIsPanelOpen}>
            {children}
          </SheetSide>
        }
      />
    </>
  );
};

export default ResponsivePanel;
