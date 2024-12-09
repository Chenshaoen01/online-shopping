import { cookies } from "next/headers"
import NavbarClinet from "./NavbarClinet.js"


export default async () => {
    const cookieStore = await cookies()
    const jwtToken = cookieStore.get('jwt')
    const isLogIn = jwtToken !== undefined
    return <NavbarClinet isLogIn={isLogIn}></NavbarClinet>
}