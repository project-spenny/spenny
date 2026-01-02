'use client';

import { useEffect, useState } from 'react';
import FixedCostsAddButton from './FixedCostsAddButton';
import FixedCostsList from './FixedCostsList';
import ResponsivePanel from '../panel/ResponsivePanel';
import FixedCostSubmitForm from './FixedCostSubmitForm';
import { IFixedRule } from '@/types/fixed-costs';
import {
  fetchFixedRules,
  setFixedRuleActive,
} from '@/services/fixed-costs/fixed-costs';
import { toast } from 'sonner';
import { mapFixedRuleToFormData } from '@/utils/fixed-costs';

export default function FixedCostsPage() {
  const [items, setItems] = useState<IFixedRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingRule, setEditingRule] = useState<IFixedRule | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFixedRules();
      setItems(data);
    } catch {
      toast.error(
        '고정비 목록을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClick = () => {
    setFormMode('create');
    setEditingRule(null);
    setIsPanelOpen(true);
  };

  const handleCreateSuccess = async () => {
    await fetchData();
    setIsPanelOpen(false);
  };

  const handleEditClick = (rule: IFixedRule) => {
    setFormMode('edit');
    setEditingRule(rule);
    setIsPanelOpen(true);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg space-y-6 p-4 md:p-6 lg:p-8">
      <FixedCostsAddButton onClick={handleCreateClick} />
      <ResponsivePanel isOpen={isPanelOpen} setIsOpen={setIsPanelOpen}>
        <FixedCostSubmitForm
          mode={formMode}
          ruleId={editingRule?.id}
          initialData={
            editingRule ? mapFixedRuleToFormData(editingRule) : undefined
          }
          onSuccess={handleCreateSuccess}
        />
      </ResponsivePanel>

      <header>
        <h1 className="text-xl font-semibold">고정비 관리</h1>
      </header>

      <FixedCostsList
        items={items}
        isLoading={isLoading}
        onEdit={handleEditClick}
      />
    </div>
  );
}
