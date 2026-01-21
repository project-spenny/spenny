'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import FixedCostsAddButton from './FixedCostsAddButton';
import ResponsivePanel from '../panel/ResponsivePanel';
import FixedCostSubmitForm from './FixedCostSubmitForm';

export default function FixedCostsClient() {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleCreateClick = () => {
    setIsPanelOpen(true);
  };

  const handleCreateSuccess = async () => {
    setIsPanelOpen(false);
    router.refresh();
  };

  return (
    <>
      <FixedCostsAddButton onClick={handleCreateClick} />

      <ResponsivePanel isOpen={isPanelOpen} setIsOpen={setIsPanelOpen}>
        <FixedCostSubmitForm mode="create" onSuccess={handleCreateSuccess} />
      </ResponsivePanel>
    </>
  );
}
