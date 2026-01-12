interface ICATEGORIES {
  income: Category[];
  expense: Category[];
}

export type Category = {
  category_key: string;
  name_en: string;
  name_ko: string;
  icon: string;
};

export const CATEGORIES: ICATEGORIES = {
  income: [
    {
      category_key: 'SALARY',
      name_en: 'Salary',
      name_ko: '급여',
      icon: '/icon/salary.png',
    },
    {
      category_key: 'BONUS',
      name_en: 'Bonus',
      name_ko: '상여금',
      icon: '/icon/bonus.png',
    },
    {
      category_key: 'ALLOWANCE',
      name_en: 'Allowance',
      name_ko: '용돈',
      icon: '/icon/allowance.png',
    },
    {
      category_key: 'SIDE_JOB',
      name_en: 'Side Job',
      name_ko: '부업',
      icon: '/icon/side-job.png',
    },
    {
      category_key: 'PART_TIME',
      name_en: 'Part-time',
      name_ko: '아르바이트',
      icon: '/icon/part-time.png',
    },
    {
      category_key: 'BUSINESS_INCOME',
      name_en: 'Business Income',
      name_ko: '사업수익',
      icon: '/icon/business-income.png',
    },
    {
      category_key: 'INVESTMENT_INCOME',
      name_en: 'Investment Income',
      name_ko: '금융수익',
      icon: '/icon/investment-income.png',
    },
    {
      category_key: 'INSURANCE',
      name_en: 'Insurance',
      name_ko: '보험금',
      icon: '/icon/insurance.png',
    },
    {
      category_key: 'SCHOLARSHIP',
      name_en: 'Scholarship',
      name_ko: '장학금',
      icon: '/icon/scholarship.png',
    },
    {
      category_key: 'REAL_ESTATE',
      name_en: 'Real Estate',
      name_ko: '부동산',
      icon: '/icon/real-estate.png',
    },
    {
      category_key: 'RESALE',
      name_en: 'Resale',
      name_ko: '중고거래',
      icon: '/icon/resale.png',
    },
    {
      category_key: 'DUTCH_PAY',
      name_en: 'Dutch Pay',
      name_ko: '더치페이',
      icon: '/icon/dutch-pay.png',
    },
    {
      category_key: 'OTHER_INCOME',
      name_en: 'Other Income',
      name_ko: '기타',
      icon: '/icon/etc.png',
    },
  ],
  expense: [
    {
      category_key: 'FOOD',
      name_en: 'Food',
      name_ko: '식비',
      icon: '/icon/food.png',
    },
    {
      category_key: 'TRANSPORT',
      name_en: 'Transport',
      name_ko: '교통',
      icon: '/icon/transport.png',
    },
    {
      category_key: 'CULTURE',
      name_en: 'Culture/Leisure',
      name_ko: '문화/여가',
      icon: '/icon/culture.png',
    },
    {
      category_key: 'SHOPPING',
      name_en: 'Shopping',
      name_ko: '쇼핑',
      icon: '/icon/shopping.png',
    },
    {
      category_key: 'BEAUTY',
      name_en: 'Beauty',
      name_ko: '미용',
      icon: '/icon/beauty.png',
    },
    {
      category_key: 'MEDICAL',
      name_en: 'Medical',
      name_ko: '의료',
      icon: '/icon/medical.png',
    },
    {
      category_key: 'EVENT',
      name_en: 'Event',
      name_ko: '경조',
      icon: '/icon/event.png',
    },
    {
      category_key: 'EDUCATION',
      name_en: 'Education',
      name_ko: '교육',
      icon: '/icon/education.png',
    },
    {
      category_key: 'CHILDCARE',
      name_en: 'Childcare',
      name_ko: '육아',
      icon: '/icon/childcare.png',
    },
    {
      category_key: 'HOUSING',
      name_en: 'Housing',
      name_ko: '주거',
      icon: '/icon/housing.png',
    },
    {
      category_key: 'SUBSCRIPTION',
      name_en: 'Telecom/Subscription',
      name_ko: '통신/구독',
      icon: '/icon/subscription.png',
    },
    {
      category_key: 'PET',
      name_en: 'Pet',
      name_ko: '반려동물',
      icon: '/icon/pet.png',
    },
    {
      category_key: 'FINANCE',
      name_en: 'Finance',
      name_ko: '금융',
      icon: '/icon/finance.png',
    },
    {
      category_key: 'OTHER_EXPENSE',
      name_en: 'Other Expense',
      name_ko: '기타',
      icon: '/icon/etc.png',
    },
  ],
};
