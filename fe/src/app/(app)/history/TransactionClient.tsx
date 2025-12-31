'use client';

import TransactionSubmitForm from '@/components/transaction/TransactionSubmitForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { useRouter } from 'next/navigation';
import { useSelected } from './TransactionContext';

export default function TransactionClient() {
  const router = useRouter();
  const { selectedTransaction, isOpen, openCreate, close } = useSelected();

  const handleSuccess = () => {
    close();
    router.refresh();
  };

  const mode = selectedTransaction ? 'edit' : 'create';

  return (
    <>
      <Button
        onClick={openCreate}
        className="fixed right-0 bottom-0 z-50 m-4 h-16 w-16 rounded-full"
        asChild
      >
        <Plus size={20} />
      </Button>
      <ResponsivePanel isOpen={isOpen} setIsOpen={close}>
        <TransactionSubmitForm
          mode={mode}
          transaction={selectedTransaction}
          onClose={close}
          onSuccess={handleSuccess}
        />
      </ResponsivePanel>
    </>
  );
}
