import { redirect } from "next/navigation";
import { NextResponse } from "next/server";


export function middleware(request) {
    if(request.nextUrl.pathname.startsWith('/User/Cart') || request.nextUrl.pathname.startsWith('/User/Order')) {
        const csrftoken = request.cookies.get('csrfToken')
        if(!csrftoken) {
            return NextResponse.redirect(new URL('/User/Login', request.url))
        }
        return NextResponse.next();
    }
}