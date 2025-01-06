import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
    console.log(request.cookies);
    console.log(request.cookies.get('exampled_secret'));
    const token = request.cookies.get('exampled_secret')?.value;
    console.log(".-.-.-..");
    console.log('middleware', token);
    console.log(".-.-.-..");

    const {pathname} = request.nextUrl;

    console.error('middleware', pathname, token);

    if (token) {
        if (pathname === '/login' || pathname === '/register') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }else{
        if (pathname === '/dashboard') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
