import { createClient } from '@/utils/supabase/server';

export async function requireUserServer() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error('로그인이 필요합니다');
  }

  return { supabase, user: data.user };
}
