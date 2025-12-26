'use client';

import DrawerBottom from '@/components/common/DrawerBottom';
import { ResponsivePanelProps } from '@/types/panel';
import ResponsiveWrapper from '@/components/common/ResponsiveWrapper';
import SheetSide from '@/components/common/SheetSide';
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
