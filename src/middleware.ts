import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {environment} from "@/utils/environment";

export function middleware(request: NextRequest) {

    const token = request.cookies.get(environment.JWT_SECRET)?.value;

    const {pathname} = request.nextUrl;

    if (token) {
        if (pathname === '/login' || pathname === '/register' || pathname === '/') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        if (pathname === '/') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
