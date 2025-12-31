'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ITransaction } from '@/types/transactions';
interface TransactionContextType {
  selectedTransaction: ITransaction | null;
  isOpen: boolean;
  openEdit: (transaction: ITransaction) => void;
  openCreate: () => void;
  close: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCreate = () => {
    setSelectedTransaction(null);
    setIsOpen(true);
  };

  const openEdit = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <TransactionContext.Provider
      value={{ selectedTransaction, isOpen, openEdit, openCreate, close }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useSelected = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('error');
  }
  return context;
};
