import { supabase } from '@/utils/supabase/client';

// 현재 로그인한 유저 정보 가져오기
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) throw new Error('로그인이 필요합니다');
  return user;
};
