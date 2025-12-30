'use client';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabase/client';

interface Transaction {
  id: string;
  title: string;
  user_id: string;
  category_id: string;
  type: 'income' | 'expense';
  date: string;
  amount: number;
  fixed_rule_id: string | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
  tags: string[];
}

interface TransactionListProps {
  onSelectTransaction: (transaction: Transaction) => void;
  refreshKey?: number;
}

export const TransactionList = ({
  onSelectTransaction,
  refreshKey,
}: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (!user || authError) {
          toast.warning('로그인이 필요합니다');
          return;
        }
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        setTransactions(data || []);
      } catch (err) {
        toast('데이터를 불러오는 데 실패했습니다');
      }
    };
    fetchTransactions();
  }, [refreshKey]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg space-y-6 p-4 md:p-6 lg:p-8">
      <Label className="text-xl">가계부</Label>
      {transactions.map((e, index) => (
        <Item variant="outline" key={index}>
          <ItemContent className="flex flex-row items-center">
            <div className="flex w-24 flex-col gap-1">
              <span className="text-muted-foreground text-xs">{e.date}</span>
              <span
                className={cn(
                  'text-sm font-bold',
                  e.type === 'income' ? 'text-blue-400' : 'text-red-400'
                )}
              >
                {e.type === 'income' ? '+' : '-'}
                {e.amount.toLocaleString()}원
              </span>
            </div>
            <ItemTitle className="p-2 text-left">{e.title}</ItemTitle>
            <ItemActions className="ml-auto">
              <Button
                className="cursor-pointer"
                size="sm"
                onClick={() => onSelectTransaction(e)}
              >
                <ChevronRight />
              </Button>
            </ItemActions>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
};
