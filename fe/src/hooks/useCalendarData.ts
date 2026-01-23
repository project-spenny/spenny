'use client'
import { useMemo } from "react"
import { ITransaction } from "@/types/transactions"
import { formatLocalDate } from "@/utils/date"
interface DayData{
      income : number;
      expense : number;
      transactions : ITransaction[];
}
export const useCalendarData =(transactions : ITransaction[])=>{
const groupedTransaction = useMemo(() => {
    const grouped: Record<string, DayData> = {};

    transactions.forEach((transaction) => {
      const dateKey = transaction.date;

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          income: 0,
          expense: 0,
          transactions: [],
        };
      }

      if (transaction.type === 'income') {
        grouped[dateKey].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        grouped[dateKey].expense += transaction.amount;
      }

      grouped[dateKey].transactions.push(transaction);
    });

    return grouped;
  }, [transactions]);
  const TransactionSummary = useMemo(() => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else if (transaction.type === 'expense') {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return summary;
  }, [transactions]);

  return{
      groupedTransaction, TransactionSummary
  }
}