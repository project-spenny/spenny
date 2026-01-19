'use client';

import { useEffect, useState } from 'react';
import FixedCostsAddButton from './FixedCostsAddButton';
import FixedCostsList from './FixedCostsList';
import ResponsivePanel from '../panel/ResponsivePanel';
import FixedCostSubmitForm from './FixedCostSubmitForm';
import { IFixedRule } from '@/types/fixed-costs';
import { fetchFixedRules } from '@/services/fixed-costs/fixed-costs';
import { toast } from 'sonner';
import { mapFixedRuleToFormData } from '@/utils/fixed-costs';
import { useAuth } from '@/providers/AuthProvider';

export default function FixedCostsPage() {
  const { userId, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<IFixedRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingRule, setEditingRule] = useState<IFixedRule | null>(null);

  const fetchData = async (userId: string) => {
    try {
      setIsLoading(true);
      const data = await fetchFixedRules(userId);
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
    if (authLoading) return;
    if (!userId) return;
    fetchData(userId);
  }, [authLoading, userId]);

  const handleCreateClick = () => {
    setFormMode('create');
    setEditingRule(null);
    setIsPanelOpen(true);
  };

  const handleCreateSuccess = async () => {
    if (!userId) return;
    await fetchData(userId);
    setIsPanelOpen(false);
  };

  const handleEditClick = (rule: IFixedRule) => {
    setFormMode('edit');
    setEditingRule(rule);
    setIsPanelOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <FixedCostsAddButton onClick={handleCreateClick} />

      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-6">
          <header>
            <h1 className="text-xl font-semibold">고정비 관리</h1>
          </header>
        </div>
      </div>

      <FixedCostsList
        items={items}
        isLoading={isLoading}
        onEdit={handleEditClick}
      />

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
    </div>
  );
}
