import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 인증이 필요한 경로
const PROTECTED_PATHS = ['/my', '/reviews/new'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증 보호 경로 체크
  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // pending 상태인 사용자는 마이페이지만 접근 가능
    if (token.status === 'pending' && pathname !== '/my') {
      return NextResponse.redirect(new URL('/my', request.url));
    }

    // suspended 상태인 사용자는 접근 불가
    if (token.status === 'suspended') {
      return NextResponse.redirect(new URL('/login?message=suspended', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
