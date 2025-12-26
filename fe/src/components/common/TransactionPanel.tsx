'use client';

import { Button } from '@/components/ui/button';
import DrawerBottom from '@/components/common/DrawerBottom';
import ResponsiveWrapper from '@/components/common/ResponsiveWrapper';
import SheetSide from '@/components/common/SheetSide';
import { Transaction } from '@/types/testTransaction';
import TransactionSection from './TransactionSection';
import { useState } from 'react';

const TransactionPanel = ({ data }: { data: Transaction[] }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsPanelOpen(true)}>거래 내역 보기</Button>
      <ResponsiveWrapper
        mobile={
          <DrawerBottom open={isPanelOpen} onOpenChange={setIsPanelOpen}>
            <TransactionSection data={data} />
          </DrawerBottom>
        }
        desktop={
          <SheetSide
            data={data}
            open={isPanelOpen}
            onOpenChange={setIsPanelOpen}
          />
        }
      />
    </>
  );
};

export default TransactionPanel;
