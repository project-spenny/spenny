import { TransactionType } from '@/types/analysis';
import { supabase } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const useCategories = (type?: TransactionType) => {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      let query = supabase.from('categories').select('*');

      if (type) query = query.eq('type', type);

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export default useCategories;
