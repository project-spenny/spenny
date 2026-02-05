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
