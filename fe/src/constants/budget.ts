import {
  BudgetTemplate,
  CategoryGroupId,
  GroupInfo,
} from '@/types/budgetGuide';

export const MAX_BUDGET_AMOUNT = 1000000000 as const; // 10억

/** 카테고리별 그룹 매핑 */
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

/** 카테고리별 그룹 정의 */
export const BUDGET_GROUPS: GroupInfo[] = [
  {
    id: 'essential',
    label: 'Essential (필수)',
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    badgeColor:
      'bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-primary',
    description: '주거, 통신/구독, 교통, 식비, 교육, 육아, 금융',
  },
  {
    id: 'flexible',
    label: 'Flexible (유연)',
    color: 'bg-lime-500',
    textColor: 'text-lime-600',
    badgeColor:
      'bg-lime-100 text-lime-700 dark:bg-lime-700/30 dark:text-primary',
    description: '문화/여가, 쇼핑, 미용, 반려동물, 경조, 의료, 기타',
  },
] as const;

/** 예산 템플릿 */
export const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: 'keep-pattern',
    title: '지출 패턴 유지',
    subtitle: '현재 상태 유지',
    description:
      '최근 소비 비중을 반영하여 익숙한 패턴 안에서 예산을 설정합니다.',
    // 비율 제한 없음 (기존 데이터 그대로)
  },
  {
    id: 'save-flexible',
    title: '유연 지출 절감형',
    subtitle: 'Flexible ≤ 40%',
    description: '유연 지출을 40% 이내로 조정하여 불필요한 지출을 줄입니다.',
    flexibleLimitRatio: 0.4,
  },
  {
    id: 'extreme-save',
    title: '강력 절약형',
    subtitle: 'Flexible ≤ 30%',
    description:
      '유연 지출을 30% 이하로 엄격히 제한하여 불필요한 지출을 최소화합니다.',
    flexibleLimitRatio: 0.3,
  },
] as const;
