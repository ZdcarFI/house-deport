import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {routes} from "@/utils/routes";

export function middleware(request: NextRequest) {

    const token = request.cookies.get('userSession')?.value;
    const {pathname} = request.nextUrl;

    if (token) {
        if (pathname === '/login' || pathname === '/register') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }else{
        if (isProtectedRoute(pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};


function isProtectedRoute(pathname: string) {
    const allRoutes = routes.flatMap(route => route.routes.map(r => r.path));
    return allRoutes.includes(pathname);
}