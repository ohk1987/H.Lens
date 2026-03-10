import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = ['/my', '/reviews/new'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 인증 보호 경로
  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // user_type 미설정 → 온보딩으로
    if (!token.userType) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // pending → 마이페이지만 허용
    if (token.status === 'pending' && pathname !== '/my') {
      return NextResponse.redirect(new URL('/my', request.url));
    }

    // suspended → 접근 불가
    if (token.status === 'suspended') {
      return NextResponse.redirect(new URL('/login?message=suspended', request.url));
    }
  }

  // 로그인 후 user_type 없으면 온보딩으로 리다이렉트
  const isOnboarding = pathname.startsWith('/onboarding');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (token && !token.userType && !isOnboarding && !isAuthPage) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
