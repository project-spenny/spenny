'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { IFixedRule } from '@/types/fixed-costs';

interface FixedCostsContextType {
  selectedRule: IFixedRule | null;
  isOpen: boolean;
  openCreate: () => void;
  openEdit: (rule: IFixedRule) => void;
  close: () => void;
}

const FixedCostsContext = createContext<FixedCostsContextType | undefined>(
  undefined
);

export function FixedCostsProvider({ children }: { children: ReactNode }) {
  const [selectedRule, setSelectedRule] = useState<IFixedRule | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCreate = () => {
    setSelectedRule(null);
    setIsOpen(true);
  };

  const openEdit = (rule: IFixedRule) => {
    setSelectedRule(rule);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return (
    <FixedCostsContext.Provider
      value={{ selectedRule, isOpen, openCreate, openEdit, close }}
    >
      {children}
    </FixedCostsContext.Provider>
  );
}

export function useFixedCosts() {
  const ctx = useContext(FixedCostsContext);
  if (!ctx) throw new Error('FixedCostsProvider 누락');
  return ctx;
}
