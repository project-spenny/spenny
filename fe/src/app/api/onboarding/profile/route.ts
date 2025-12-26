import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

type Gender = 'male' | 'female';

function isValidBirthDate(v: string) {
  // YYYY-MM-DD 형식 검사
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  // 유효한 날짜인지 확인
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return false;
  return d.toISOString().slice(0, 10) === v;
}

export async function POST(req: Request) {
  const supabase = await createClient();

  // 로그인 유저 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const nickname = (body?.nickname ?? '').trim();
  const birth_date = (body?.birth_date ?? '').trim();
  const gender = body?.gender as Gender;

  // 입력값 검증
  const errors: Record<string, string> = {};

  if (!nickname) errors.nickname = '닉네임을 입력해주세요.';
  if (!birth_date) errors.birth_date = '생년월일을 입력해주세요.';
  else if (!isValidBirthDate(birth_date))
    errors.birth_date = 'YYYY-MM-DD 형식으로 입력해주세요.';
  if (gender !== 'male' && gender !== 'female')
    errors.gender = '성별을 선택해주세요.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: 'Validation error', errors },
      { status: 400 }
    );
  }

  // profiles 저장
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      nickname,
      gender,
      birth_date,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
