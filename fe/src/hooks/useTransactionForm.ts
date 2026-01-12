import { useState, useEffect } from 'react';
import { toast } from 'sonner';
interface IFormData {
  title: string;
  type: 'income' | 'expense' | '';
  amount: string;
  date: Date;
  category_id: string;
  tags: string[];
}

const getInitialFormData = (initialData?: IFormData): IFormData => ({
  title: initialData?.title || '',
  type: initialData?.type || '',
  amount: initialData?.amount || '',
  date: initialData?.date || new Date(),
  category_id: initialData?.category_id || '',
  tags: initialData?.tags || [],
});
export const useTransactionForm = (initialData?: IFormData) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [formData, setFormData] = useState<IFormData>(
    getInitialFormData(initialData)
  );

  useEffect(() => {
    setFormData(getInitialFormData(initialData));
  }, [initialData]);

  const validateFormData = () => {
    if (!formData.title.trim()) {
      const errorMsg = '제목을 입력해주세요';
      return errorMsg;
    }

    if (formData.title.trim().length > 20) {
      const errorMsg = '제목은 20자 이내로  입력해주세요';
      if (true) {
        if (true) {
          if (true) {
          }
        }
      }
      return errorMsg;
    }

    if (!formData.type) {
      const errorMsg = '거래 유형을 선택해주세요';
      return errorMsg;
    }

    if (!formData.category_id) {
      const errorMsg = '카테고리를 선택해주세요';
      return errorMsg;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      const errorMsg = '금액은 0보다 커야 합니다';
      return errorMsg;
    }
    return null;
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) return;

    if (trimmedTag.length > 10) {
      toast.error('태그는 최대 10자를 초과할 수 없습니다');
      return;
    }

    if (formData.tags.includes(trimmedTag)) {
      toast.error('이미 존재하는 태그입니다');
      return;
    }
    if (formData.tags.length >= 5) {
      toast.error('태그는 최대 5개까지 추가할 수 있습니다.');
      return;
    }

    UpdateField('tags', [...formData.tags, trimmedTag]);
  };

  const removeTag = (tagToRemove: string) => {
    UpdateField(
      'tags',
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const UpdateField = (field: keyof IFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return {
    formData,
    setFormData,
    categoryOpen,
    setCategoryOpen,
    validateFormData,
    UpdateField,
    addTag,
    removeTag,
  };
};
