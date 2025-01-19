import { NextResponse } from "next/server";

export async function middleware(request) {
    // if(request.nextUrl.pathname.startsWith('/User/Cart') || request.nextUrl.pathname.startsWith('/User/Order')) {
    //     const jwtToken = request.cookies.get('jwt')
    //     if(!jwtToken) {
    //         return NextResponse.redirect(new URL('/User/Login', request.url))
    //     }
    //     return NextResponse.next();
    // }

    if(request.nextUrl.pathname.startsWith('/User/Cart') || request.nextUrl.pathname.startsWith('/User/Order')) {
        const cookieHeader = request.cookies.toString()
        const checkLoginResult = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/checkLogin`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': cookieHeader
            }
        })

        if(checkLoginResult.status === 200) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/User/Login', request.url))
    }
}