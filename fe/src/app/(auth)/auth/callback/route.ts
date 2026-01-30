import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// The client you created from the Server-Side Auth instructions
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/';
  }

  if (!code) {
    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 로그인된 유저 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // 유저 프로필 존재 여부 조회 (로그인 직후 1회만)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  const onboarded = !!profile;
  const nextPath = onboarded ? next : '/onboarding';

  const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
  const isLocalEnv = process.env.NODE_ENV === 'development';

  let redirectUrl: string;
  if (isLocalEnv) {
    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
    redirectUrl = `${origin}${nextPath}`;
  } else if (forwardedHost) {
    redirectUrl = `https://${forwardedHost}${nextPath}`;
  } else {
    redirectUrl = `${origin}${nextPath}`;
  }

  const response = NextResponse.redirect(redirectUrl);
  if (onboarded) {
    response.cookies.set('onboarded', '1', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !isLocalEnv,
      maxAge: 60 * 60 * 24 * 365,
    });
  } else {
    // 미완료 시 쿠키 삭제
    response.cookies.set('onboarded', '', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !isLocalEnv,
      maxAge: 0,
    });
  }

  return response;
}
