import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {


    const token = request.cookies.get('hG7$kL2@qT9&zX1!mN4#vB8*eW5^rY3')?.value;

    const { pathname } = request.nextUrl; 

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
