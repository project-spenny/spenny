'use client';

import TransactionSubmitForm from '@/components/transaction/TransactionSubmitForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { useRouter } from 'next/navigation';
import { useSelected } from './TransactionContext';
import ReceiptOCR from '@/components/transaction/ReceiptOCR';
import { useQueryClient } from '@tanstack/react-query';

export default function TransactionClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedTransaction, isOpen, openCreate, close } = useSelected();

  const handlePanelOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  const handleSuccess = () => {
    close();
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['transactions-infinite'] });
    router.refresh();
  };

  const mode = selectedTransaction ? 'edit' : 'create';

  return (
    <>
      <ReceiptOCR />
      <Button
        onClick={openCreate}
        className="fixed right-0 bottom-16 z-50 m-4 h-16 w-16 rounded-full"
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
