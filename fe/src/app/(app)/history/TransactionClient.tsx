'use client';

import TransactionSubmitForm from '@/components/transaction/TransactionSubmitForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { useRouter } from 'next/navigation';
import { useSelected } from './TransactionContext';
import ReceiptCapture from '@/components/transaction/ReceiptCapture';
import { useEffect, useState, useTransition } from 'react';
import { OCRResult } from '@/types/transactions';
import ReceiptMulti from '@/components/transaction/ReceiptMulti';
import { Receipt } from 'lucide-react';
import { X } from 'lucide-react';

export default function TransactionClient() {
  const router = useRouter();
  const { selectedTransaction, isOpen, openCreate, close } = useSelected();
  const [ocrData, setOcrData] = useState<OCRResult | null>(null);
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
      setOcrData(null);
      setCloseAfterRefresh(false);
    }
  }, [closeAfterRefresh, isPending, close]);

  const handleOCRResult = (data: OCRResult) => {
    setOcrData(data);
    openCreate();
  };

  const mode = selectedTransaction ? 'edit' : 'create';

  return (
    <>
      <div className="bg-foreground fixed bottom-0 z-50 m-4 flex gap-4 rounded-full p-1">
        <ReceiptCapture onResult={handleOCRResult} />
        <ReceiptMulti />
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
          defaultValue={ocrData}
        />
      </ResponsivePanel>
    </>
  );
}
