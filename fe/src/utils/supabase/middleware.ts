import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // 정적 이미지 파일은 인증 체크 제외
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    return supabaseResponse;
  }

  const isAuthPath = pathname.startsWith('/auth');
  const isLoginPath = pathname.startsWith('/login');
  const isOnboardingPath = pathname.startsWith('/onboarding');

  if (!user) {
    if (!isLoginPath && !isAuthPath) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const userId = user.sub; // claims의 subject = auth uid(uuid)

  // 유저 프로필 존재 여부 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  const hasProfile = !!profile && !profileError;

  // 로그인 상태에서 login 페이지 접근 차단
  if (isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = hasProfile ? '/' : '/onboarding';
    return NextResponse.redirect(url);
  }

  // 온보딩 미완료면 onboarding만 허용
  if (!hasProfile) {
    // /auth는 OAuth 플로우 때문에 허용
    if (!isOnboardingPath && !isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 온보딩 완료면 onboarding 접근 차단
  if (hasProfile && isOnboardingPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
