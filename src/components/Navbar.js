import { cookies } from "next/headers"
import NavbarClinet from "./NavbarClinet.js"


export default async () => {
    const cookieStore = await cookies()
    const csrfToken = cookieStore.get('csrfToken')
    console.log(csrfToken)
    return <NavbarClinet csrfToken={csrfToken?.value}></NavbarClinet>
}