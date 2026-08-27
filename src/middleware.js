import { NextResponse } from "next/server";

// 只擋掉明顯未登入的請求，實際的身分驗證由 API 負責
export function middleware(request) {
    if (!request.cookies.get('jwt')) {
        return NextResponse.redirect(new URL('/User/Login', request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/User/Cart', '/User/Cart/:path*', '/User/Order', '/User/Order/:path*'],
}
