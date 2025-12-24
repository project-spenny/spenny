// 임시 데이터

import { Transaction } from '@/types/testTransaction';

export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: '점심 식사',
    category_id: 'cat-001',
    type: 'expense',
    date: '2024-12-23',
    amount: 15000,
  },
  {
    id: 't2',
    title: '출/퇴근 교통비',
    category_id: 'cat-002',
    type: 'expense',
    date: '2024-12-22',
    amount: 3500,
  },
  {
    id: 't3',
    title: '장갑 구매',
    category_id: 'cat-003',
    type: 'expense',
    date: '2024-12-21',
    amount: 45000,
  },
  {
    id: 't4',
    title: '월급',
    category_id: 'cat-004',
    type: 'income',
    date: '2024-12-20',
    amount: 3000000,
  },
  {
    id: 't5',
    title: '간식',
    category_id: 'cat-001',
    type: 'expense',
    date: '2024-12-20',
    amount: 8500,
  },
  {
    id: 't6',
    title: '대출 이자',
    category_id: 'cat-005',
    type: 'expense',
    date: '2024-12-19',
    amount: 120000,
  },
  {
    id: 't7',
    title: '티셔츠 구매',
    category_id: 'cat-006',
    type: 'expense',
    date: '2024-12-18',
    amount: 55000,
  },
];
