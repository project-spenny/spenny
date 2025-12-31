interface ICATEGORIES {
  income: Category[];
  expense: Category[];
}

type Category = {
  category_key: string;
  name_en: string;
  name_ko: string;
};

export const CATEGORIES: ICATEGORIES = {
  income: [
    {
      category_key: 'SALARY',
      name_en: 'Salary',
      name_ko: '급여',
    },
    {
      category_key: 'BONUS',
      name_en: 'Bonus',
      name_ko: '상여금',
    },
    {
      category_key: 'ALLOWANCE',
      name_en: 'Allowance',
      name_ko: '용돈',
    },
    {
      category_key: 'SIDE_JOB',
      name_en: 'Side Job',
      name_ko: '부업',
    },
    {
      category_key: 'PART_TIME',
      name_en: 'Part-time',
      name_ko: '아르바이트',
    },
    {
      category_key: 'BUSINESS_INCOME',
      name_en: 'Business Income',
      name_ko: '사업수익',
    },
    {
      category_key: 'INVESTMENT_INCOME',
      name_en: 'Investment Income',
      name_ko: '금융수익',
    },
    {
      category_key: 'INSURANCE',
      name_en: 'Insurance',
      name_ko: '보험금',
    },
    {
      category_key: 'SCHOLARSHIP',
      name_en: 'Scholarship',
      name_ko: '장학금',
    },
    {
      category_key: 'REAL_ESTATE',
      name_en: 'Real Estate',
      name_ko: '부동산',
    },
    {
      category_key: 'RESALE',
      name_en: 'Resale',
      name_ko: '중고거래',
    },
    {
      category_key: 'DUTCH_PAY',
      name_en: 'Dutch Pay',
      name_ko: '더치페이',
    },
    {
      category_key: 'OTHER_INCOME',
      name_en: 'Other Income',
      name_ko: '기타',
    },
  ],
  expense: [
    {
      category_key: 'FOOD',
      name_en: 'Food',
      name_ko: '식비',
    },
    {
      category_key: 'TRANSPORT',
      name_en: 'Transport',
      name_ko: '교통',
    },
    {
      category_key: 'CULTURE',
      name_en: 'Culture/Leisure',
      name_ko: '문화/여가',
    },
    {
      category_key: 'SHOPPING',
      name_en: 'Shopping',
      name_ko: '쇼핑',
    },
    {
      category_key: 'BEAUTY',
      name_en: 'Beauty',
      name_ko: '미용',
    },
    {
      category_key: 'MEDICAL',
      name_en: 'Medical',
      name_ko: '의료',
    },
    {
      category_key: 'EVENT',
      name_en: 'Event',
      name_ko: '경조',
    },
    {
      category_key: 'EDUCATION',
      name_en: 'Education',
      name_ko: '교육',
    },
    {
      category_key: 'CHILDCARE',
      name_en: 'Childcare',
      name_ko: '육아',
    },
    {
      category_key: 'HOUSING',
      name_en: 'Housing',
      name_ko: '주거',
    },
    {
      category_key: 'SUBSCRIPTION',
      name_en: 'Telecom/Subscription',
      name_ko: '통신/구독',
    },
    {
      category_key: 'PET',
      name_en: 'Pet',
      name_ko: '반려동물',
    },
    {
      category_key: 'FINANCE',
      name_en: 'Finance',
      name_ko: '금융',
    },
    {
      category_key: 'OTHER_EXPENSE',
      name_en: 'Other Expense',
      name_ko: '기타',
    },
  ],
};
