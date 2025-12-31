'use client';
import { useState } from 'react';
import TransactionSubmitForm from '@/components/transaction/TransactionSubmitForm';
import { TransactionList } from '@/components/transaction/TransactionList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ITransaction } from '@/types/transactions';
import ResponsivePanel from '@/components/panel/ResponsivePanel';

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<
    ITransaction | undefined
  >();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setFormMode('edit');
    setIsSidebarOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTransaction(undefined);
    setFormMode('create');
    setIsSidebarOpen(true);
  };

  const handleClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <Button
          onClick={handleCreateNew}
          className="fixed right-0 bottom-0 z-50 m-4 h-16 w-16 rounded-full"
          asChild
        >
          <Plus size={20} />
        </Button>
        <div className="w-full flex-1 overflow-auto">
          <TransactionList
            refreshKey={refreshKey}
            onSelectTransaction={handleSelectTransaction}
          />
        </div>
        <ResponsivePanel isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
          <TransactionSubmitForm
            mode={formMode}
            transaction={selectedTransaction}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        </ResponsivePanel>
      </div>
    </>
  );
}
