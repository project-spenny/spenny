import { BudgetTemplate } from '@/types/budgetGuide';

export const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: 'keep-pattern',
    title: '지출 패턴 유지',
    subtitle: '현재 상태 유지',
    description: '최근 3개월 소비 비율을 그대로 유지하여 예산을 짭니다.',
    // 비율 제한 없음 (기존 데이터 그대로)
  },
  {
    id: 'save-flexible',
    title: '유연 지출 절감형',
    subtitle: 'Flexible ≤ 40%',
    description: '쇼핑, 외식 등 유연 지출을 40% 이하로 줄여 예산을 짭니다.',
    flexibleLimitRatio: 0.4,
  },
  {
    id: 'extreme-save',
    title: '강력 절약형',
    subtitle: 'Flexible ≤ 30%',
    description:
      '꼭 필요한 지출 위주로 70%를 배분하고 유연 지출을 30%로 제한합니다.',
    flexibleLimitRatio: 0.3,
  },
];
