'use client';

import DrawerBottom from '@/components/common/DrawerBottom';
import ResponsiveWrapper from '@/components/common/ResponsiveWrapper';
import SheetSide from '@/components/common/SheetSide';
import { useState } from 'react';

interface ResponsivePanelProps {
  trigger: React.ReactNode; // 패널을 열 버튼 등 트리거
  children: React.ReactNode; // 패널 내부에 들어갈 내용
}

const ResponsivePanel = ({ trigger, children }: ResponsivePanelProps) => {
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
          <DrawerBottom open={isPanelOpen} onOpenChange={setIsPanelOpen}>
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
