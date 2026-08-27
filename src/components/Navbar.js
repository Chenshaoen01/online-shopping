import NavbarClient from "./NavbarClient.js"
import { checkLogin } from "@/api/server"

export default async function Navbar() {
    const isLogin = await checkLogin()

    return <NavbarClient isLoginDefault={isLogin}></NavbarClient>
}
