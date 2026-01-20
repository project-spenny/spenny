import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { onboardingProfileSchema, profilePatchSchema } from '@/schemas/profile';

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
      response: NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      ),
    };
  }

  return { supabase, user, response: null };
}

async function resolveProfileImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  avatarUrl?: string
) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('profile_image_url')
    .eq('id', userId)
    .maybeSingle();

  return existing?.profile_image_url ?? avatarUrl ?? null;
}

// 프로필 조회
export async function GET() {
  const { supabase, user, response } = await requireUser();
  if (response) return response;

  const { data, error: selectError } = await supabase
    .from('profiles')
    .select('nickname, birth_date, gender, profile_image_url, is_guest')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json(
      { ok: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }

  // 온보딩 진행 중
  if (!data) {
    return NextResponse.json({
      ok: true,
      state: 'ONBOARDING',
      profile: null,
    });
  }

  // 온보딩 완료
  return NextResponse.json({
    ok: true,
    state: 'ONBOARDED',
    profile: data,
  });
}

// onboarding - 프로필 수정
export async function PUT(req: Request) {
  const { supabase, user, response } = await requireUser();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = onboardingProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Validation error', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { nickname, birth_date, gender } = parsed.data;

  const profile_image_url = await resolveProfileImageUrl(
    supabase,
    user.id,
    user.user_metadata?.avatar_url as string | undefined
  );

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      nickname,
      gender,
      birth_date,
      profile_image_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// MyInfo - 프로필 수정
export async function PATCH(req: Request) {
  const { supabase, user, response } = await requireUser();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = profilePatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid body', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 업데이트할 필드만 선택적으로 설정
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.nickname !== undefined)
    updatePayload.nickname = parsed.data.nickname;
  if (parsed.data.birth_date !== undefined)
    updatePayload.birth_date = parsed.data.birth_date;
  if (parsed.data.gender !== undefined)
    updatePayload.gender = parsed.data.gender;

  const { data, error: updateError } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id)
    .select('nickname, birth_date, gender, profile_image_url')
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
