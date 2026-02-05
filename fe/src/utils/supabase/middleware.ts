import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const isPublicAsset = (pathname: string) => {
  // Next 내부 정적 자원, 파비콘 등
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  )
    return true;

  // 이미지 파일
  return /\.(png|jpg|jpeg|gif|svg|webp|ico)$/.test(pathname);
};

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 정적 자원은 인증/세션 로직 제외
  if (isPublicAsset(pathname)) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
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
  const claims = data?.claims;
  const userId = claims?.sub;

  const isAuthPath = pathname.startsWith('/auth');
  const isLoginPath = pathname.startsWith('/login');
  const isOnboardingPath = pathname.startsWith('/onboarding');
  const isOnboardingIntroPath = pathname.startsWith('/onboarding/intro');

  // 쿠키를 통해 온보딩 완료 여부 판단
  const onboardedCookie = request.cookies.get('onboarded')?.value;
  let isOnboarded = onboardedCookie === '1';

  // 비로그인 : login/auth만 허용
  if (!userId) {
    if (!isLoginPath && !isAuthPath) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 쿠키가 없으면 DB로 profiles 존재 확인
  if (!isOnboarded) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!error && profile) {
      isOnboarded = true;

      // 쿠키 재발급
      supabaseResponse.cookies.set('onboarded', '1', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365, // 1년
      });
    } else {
      // 프로필 없으면 쿠키 제거
      supabaseResponse.cookies.set('onboarded', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
      });
    }
  }

  // 로그인 상태에서 /login 접근 차단
  if (isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = isOnboarded ? '/' : '/onboarding';
    return NextResponse.redirect(url);
  }

  // 온보딩 미완료면 /onboarding만 허용
  if (!isOnboarded) {
    // /auth는 OAuth 플로우 때문에 허용
    if (!isOnboardingPath && !isAuthPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 온보딩 완료면 /onboarding 접근 차단
  if (isOnboardingPath && !isOnboardingIntroPath) {
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
