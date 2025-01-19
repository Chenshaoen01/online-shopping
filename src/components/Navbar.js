import { cookies } from "next/headers"
import NavbarClinet from "./NavbarClinet.js"

export default async () => {
    const cookieHeader = cookies().toString()
    const isLogin = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/checkLogin`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Cookie': cookieHeader
        }
    }).then(res => {
        return new Promise(resolve => {
            resolve(res.status === 200)
        })
    })

    return <NavbarClinet isLoginDefalut={isLogin}></NavbarClinet>
}