import { CategoryGroupId, GroupInfo } from '@/types/budgetGuide';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { THEME_COLOR } from '@/constants/colors';

export const ANALYSIS_CONFIG = {
  expense: {
    label: '지출',
    color: THEME_COLOR.EXPENSE,
    icon: TrendingDown,
    emptyDescription: '지출을 기록하고 소비 습관을 파악해보세요',
    increaseText: '더 썼어요',
    decreaseText: '적게 썼어요',
  },
  income: {
    label: '수입',
    color: THEME_COLOR.INCOME,
    icon: TrendingUp,
    emptyDescription: '월급이나 부수입을 기록해보세요',
    increaseText: '더 벌었어요',
    decreaseText: '적게 벌었어요',
  },
} as const;

// 카테고리별 그룹 매핑
export const EXPENSE_CATEGORY_GROUP_MAP: Record<string, CategoryGroupId> = {
  // Essential (필수)
  FOOD: 'essential', // 식비
  TRANSPORT: 'essential', // 교통
  HOUSING: 'essential', // 주거
  SUBSCRIPTION: 'essential', // 통신/구독
  EDUCATION: 'essential', // 교육
  CHILDCARE: 'essential', // 육아
  FINANCE: 'essential', // 금융

  // Flexible (유연)
  CULTURE: 'flexible', // 문화/여가
  SHOPPING: 'flexible', // 쇼핑
  BEAUTY: 'flexible', // 미용
  PET: 'flexible', // 반려동물
  OTHER_EXPENSE: 'flexible', // 기타
  EVENT: 'flexible', // 경조
  MEDICAL: 'flexible', // 의료
} as const;

// 그룹 정의
export const BUDGET_GROUPS: GroupInfo[] = [
  {
    id: 'essential',
    label: 'Essential (필수)',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: '주거, 통신/구독, 교통, 식비, 교육, 육아, 금융',
  },
  {
    id: 'flexible',
    label: 'Flexible (유연)',
    color: 'bg-lime-500',
    textColor: 'text-lime-600',
    badgeColor: 'bg-lime-100 text-lime-700',
    description: '문화/여가, 쇼핑, 미용, 반려동물, 경조, 의료, 기타',
  },
] as const;
