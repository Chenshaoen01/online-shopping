import NavbarClinet from "./NavbarClinet.js"
import { checkLogin } from "@/api/server"

export default async function Navbar() {
    const isLogin = await checkLogin()

    return <NavbarClinet isLoginDefalut={isLogin}></NavbarClinet>
}
