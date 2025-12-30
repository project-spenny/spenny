'use client';

import DrawerBottom from '@/components/panel/DrawerBottom';
import { ResponsivePanelProps } from '@/types/panel';
import ResponsiveWrapper from '@/components/panel/ResponsiveWrapper';
import SheetSide from '@/components/panel/SheetSide';
import { useState } from 'react';

// 외부 제어 모드 일 경우의 optional props
interface ExternalResponsivePanelProps extends ResponsivePanelProps {
  isOpen?: boolean;
  setIsOpen?: (oepn: boolean) => void;
}

const ResponsivePanel = ({
  trigger,
  children,
  isFull = false,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}: ExternalResponsivePanelProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isExternalControlled = externalIsOpen !== undefined;

  const isPanelOpen = isExternalControlled ? externalIsOpen : internalOpen;
  const setIsPanelOpen = isExternalControlled
    ? externalSetIsOpen || (() => {})
    : setInternalOpen;

  return (
    <>
      {trigger && (
        <div
          className="inline-block cursor-pointer"
          onClick={() => setIsPanelOpen(true)}
        >
          {trigger}
        </div>
      )}

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
