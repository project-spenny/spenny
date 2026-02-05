'use client';

import { useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import FixedCostsAddButton from './FixedCostsAddButton';
import ResponsivePanel from '../panel/ResponsivePanel';
import FixedCostSubmitForm from './FixedCostSubmitForm';
import { useFixedCosts } from '@/app/(app)/fixed-costs/FixedCostsContext';
import { mapFixedRuleToFormData } from '@/utils/fixed-costs/fixedCosts';

export default function FixedCostsClient() {
  const router = useRouter();
  const { selectedRule, isOpen, openCreate, close } = useFixedCosts();

  const [isPending, startTransition] = useTransition();
  const closeAfterRefreshRef = useRef(false);

  const handlePanelOpenChange = (open: boolean) => {
    if (!open) close();
  };

  const handleSuccess = () => {
    closeAfterRefreshRef.current = true;
    startTransition(() => router.refresh());
  };

  useEffect(() => {
    if (closeAfterRefreshRef.current && !isPending) {
      close();
      closeAfterRefreshRef.current = false;
    }
  }, [isPending, close]);

  const mode = selectedRule ? 'edit' : 'create';

  return (
    <>
      <FixedCostsAddButton onClick={openCreate} />

      <ResponsivePanel isOpen={isOpen} setIsOpen={handlePanelOpenChange}>
        <FixedCostSubmitForm
          mode={mode}
          ruleId={selectedRule?.id}
          initialData={
            selectedRule ? mapFixedRuleToFormData(selectedRule) : undefined
          }
          onSuccess={handleSuccess}
        />
      </ResponsivePanel>
    </>
  );
}
