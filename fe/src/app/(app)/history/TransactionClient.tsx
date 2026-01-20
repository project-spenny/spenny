'use client';

import TransactionSubmitForm from '@/components/transaction/TransactionSubmitForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { useRouter } from 'next/navigation';
import { useSelected } from './TransactionContext';
import { useEffect, useState, useTransition } from 'react';
import ReceiptOCR from '@/components/transaction/ReceiptOCR';

export default function TransactionClient() {
  const router = useRouter();
  const { selectedTransaction, isOpen, openCreate, close } = useSelected();
  const [isPending, startTransition] = useTransition();
  const [closeAfterRefresh, setCloseAfterRefresh] = useState(false);

  const handlePanelOpenChange = (open: boolean) => {
    if (!open) {
      close();
      setOcrData(null);
    }
  };

  const handleSuccess = () => {
    setCloseAfterRefresh(true);
    startTransition(() => {
      router.refresh();
    });
  };

  useEffect(() => {
    if (closeAfterRefresh && !isPending) {
      close();
      setCloseAfterRefresh(false);
    }
  }, [closeAfterRefresh, isPending, close]);

  const mode = selectedTransaction ? 'edit' : 'create';

  return (
    <>
      <div className="bg-foreground fixed bottom-0 z-50 m-4 flex gap-4 rounded-full p-1">
        <ReceiptOCR />
      </div>
      <Button
        onClick={openCreate}
        className="fixed right-0 bottom-0 z-50 m-4 h-16 w-16 rounded-full"
        asChild
      >
        <Plus size={20} />
      </Button>
      <ResponsivePanel isOpen={isOpen} setIsOpen={handlePanelOpenChange}>
        <TransactionSubmitForm
          mode={mode}
          transaction={selectedTransaction}
          onClose={() => handlePanelOpenChange(false)}
          onSuccess={handleSuccess}
        />
      </ResponsivePanel>
    </>
  );
}
