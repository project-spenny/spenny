import { FixedCostListItem } from '@/types/fixed-costs.mock.types';

export const MOCK_FIXED_COSTS: FixedCostListItem[] = [
  {
    id: '1',
    title: '넷플릭스',
    type: 'expense',
    displayCycle: '매달 25일',
    amount: 17000,
    isActive: true,
  },
  {
    id: '2',
    title: '헬스장',
    type: 'expense',
    displayCycle: '매주 월요일',
    amount: 45000,
    isActive: false,
  },
  {
    id: '3',
    title: '월급',
    type: 'income',
    displayCycle: '매달 1일',
    amount: 3000000,
    isActive: true,
  },
  {
    id: '4',
    title: '사무실 임대료',
    type: 'expense',
    displayCycle: '매달 1일',
    amount: 500000,
    isActive: true,
  },
  {
    id: '5',
    title: '통신비',
    type: 'expense',
    displayCycle: '매달 10일',
    amount: 30000,
    isActive: false,
  },
];
