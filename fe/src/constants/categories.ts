interface ICATEGORIES {
  income: Category[];
  expense: Category[];
}

type Category = {
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
      icon: '',
    },
    {
      category_key: 'BONUS',
      name_en: 'Bonus',
      name_ko: '상여금',
      icon: '',
    },
    {
      category_key: 'ALLOWANCE',
      name_en: 'Allowance',
      name_ko: '용돈',
      icon: '',
    },
    {
      category_key: 'SIDE_JOB',
      name_en: 'Side Job',
      name_ko: '부업',
      icon: '',
    },
    {
      category_key: 'PART_TIME',
      name_en: 'Part-time',
      name_ko: '아르바이트',
      icon: '',
    },
    {
      category_key: 'BUSINESS_INCOME',
      name_en: 'Business Income',
      name_ko: '사업수익',
      icon: '',
    },
    {
      category_key: 'INVESTMENT_INCOME',
      name_en: 'Investment Income',
      name_ko: '금융수익',
      icon: '',
    },
    {
      category_key: 'INSURANCE',
      name_en: 'Insurance',
      name_ko: '보험금',
      icon: '',
    },
    {
      category_key: 'SCHOLARSHIP',
      name_en: 'Scholarship',
      name_ko: '장학금',
      icon: '',
    },
    {
      category_key: 'REAL_ESTATE',
      name_en: 'Real Estate',
      name_ko: '부동산',
      icon: '',
    },
    {
      category_key: 'RESALE',
      name_en: 'Resale',
      name_ko: '중고거래',
      icon: '',
    },
    {
      category_key: 'DUTCH_PAY',
      name_en: 'Dutch Pay',
      name_ko: '더치페이',
      icon: '',
    },
    {
      category_key: 'OTHER_INCOME',
      name_en: 'Other Income',
      name_ko: '기타',
      icon: '',
    },
  ],
  expense: [
    {
      category_key: 'FOOD',
      name_en: 'Food',
      name_ko: '식비',
      icon: '',
    },
    {
      category_key: 'TRANSPORT',
      name_en: 'Transport',
      name_ko: '교통',
      icon: '',
    },
    {
      category_key: 'CULTURE',
      name_en: 'Culture/Leisure',
      name_ko: '문화/여가',
      icon: '',
    },
    {
      category_key: 'SHOPPING',
      name_en: 'Shopping',
      name_ko: '쇼핑',
      icon: '',
    },
    {
      category_key: 'BEAUTY',
      name_en: 'Beauty',
      name_ko: '미용',
      icon: '',
    },
    {
      category_key: 'MEDICAL',
      name_en: 'Medical',
      name_ko: '의료',
      icon: '',
    },
    {
      category_key: 'EVENT',
      name_en: 'Event',
      name_ko: '경조',
      icon: '',
    },
    {
      category_key: 'EDUCATION',
      name_en: 'Education',
      name_ko: '교육',
      icon: '',
    },
    {
      category_key: 'CHILDCARE',
      name_en: 'Childcare',
      name_ko: '육아',
      icon: '',
    },
    {
      category_key: 'HOUSING',
      name_en: 'Housing',
      name_ko: '주거',
      icon: '',
    },
    {
      category_key: 'SUBSCRIPTION',
      name_en: 'Telecom/Subscription',
      name_ko: '통신/구독',
      icon: '',
    },
    {
      category_key: 'PET',
      name_en: 'Pet',
      name_ko: '반려동물',
      icon: '',
    },
    {
      category_key: 'FINANCE',
      name_en: 'Finance',
      name_ko: '금융',
      icon: '',
    },
    {
      category_key: 'OTHER_EXPENSE',
      name_en: 'Other Expense',
      name_ko: '기타',
      icon: '',
    },
  ],
};
