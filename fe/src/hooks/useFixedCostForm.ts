import { useState } from 'react';

export interface IFixedCostFormData {
  title: string;
  type: 'income' | 'expense' | '';
  amount: string;
  category_id: string;

  cycle: 'WEEKLY' | 'MONTHLY' | '';
  weekday: number | null; // WEEKLY일 때 필수 (1~7)
  monthday: number | null; // MONTHLY일 때 필수 (1~31)

  start_date: Date;
  end_date: Date | null;

  is_active: boolean;
}

const getInitialFormData = (
  initialData?: Partial<IFixedCostFormData>
): IFixedCostFormData => ({
  title: initialData?.title ?? '',
  type: initialData?.type ?? '',
  amount: initialData?.amount ?? '',
  category_id: initialData?.category_id ?? '',

  cycle: initialData?.cycle ?? '',
  weekday: initialData?.weekday ?? null,
  monthday: initialData?.monthday ?? null,

  start_date: initialData?.start_date ?? new Date(),
  end_date: initialData?.end_date ?? null,

  is_active: initialData?.is_active ?? true,
});

export const useFixedCostForm = (initialData?: Partial<IFixedCostFormData>) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [formData, setFormData] = useState<IFixedCostFormData>(
    getInitialFormData(initialData)
  );

  // 폼 데이터 검증 함수
  const validateFormData = () => {
    if (!formData.title.trim()) return '제목을 입력해주세요';
    if (formData.title.trim().length > 20)
      return '제목은 20자 이내로 입력해주세요';

    if (!formData.type) return '거래 유형을 선택해주세요';
    if (!formData.category_id) return '카테고리를 선택해주세요';

    if (!formData.amount || Number(formData.amount) <= 0)
      return '금액은 0보다 커야 합니다';

    if (!formData.cycle) return '반복 주기를 선택해주세요';

    if (formData.cycle === 'WEEKLY' && !formData.weekday)
      return '반복 요일을 선택해주세요';

    if (formData.cycle === 'MONTHLY' && !formData.monthday)
      return '반복 날짜를 선택해주세요';

    if (formData.end_date && formData.end_date < formData.start_date)
      return '종료일은 시작일 이후여야 합니다';

    return null;
  };

  // 필드별 업데이트 함수
  const UpdateField = <K extends keyof IFixedCostFormData>(
    field: K,
    value: IFixedCostFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    categoryOpen,
    setCategoryOpen,
    validateFormData,
    UpdateField,
  };
};
