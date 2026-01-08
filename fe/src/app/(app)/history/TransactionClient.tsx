'use client';

import TransactionSubmitForm from '@/components/transaction/TransactionSubmitForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { useRouter } from 'next/navigation';
import { useSelected } from './TransactionContext';
import OCR from '@/components/transaction/OCR';
import { useState } from 'react';
import { OCRResult } from '@/types/transactions';

export default function TransactionClient() {
  const router = useRouter();
  const { selectedTransaction, isOpen, openCreate, close } = useSelected();
  const [ocrData, setOcrData] = useState<OCRResult | null>(null);

  const handleSuccess = () => {
    close();
    setOcrData(null);
    router.refresh();
  };

  const handleClose = () => {
    close();
    setOcrData(null);
  };
  const handleOCRResult = (data: OCRResult) => {
    setOcrData(data);
    openCreate();
  };

  const mode = selectedTransaction ? 'edit' : 'create';

  return (
    <>
      <OCR onResult={handleOCRResult} />
      <Button
        onClick={openCreate}
        className="fixed right-0 bottom-0 z-50 m-4 h-16 w-16 rounded-full"
        asChild
      >
        <Plus size={20} />
      </Button>
      <ResponsivePanel isOpen={isOpen} setIsOpen={handleSuccess}>
        <TransactionSubmitForm
          mode={mode}
          transaction={selectedTransaction}
          onClose={handleClose}
          onSuccess={handleSuccess}
          defaultValue={ocrData}
        />
      </ResponsivePanel>
    </>
  );
}
