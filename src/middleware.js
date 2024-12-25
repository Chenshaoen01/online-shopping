import { NextResponse } from "next/server";

export function middleware(request) {
    if(request.nextUrl.pathname.startsWith('/User/Cart') || request.nextUrl.pathname.startsWith('/User/Order')) {
        const jwtToken = request.cookies.get('jwt')
        if(!jwtToken) {
            return NextResponse.redirect(new URL('/User/Login', request.url))
        }
        return NextResponse.next();
    }
}