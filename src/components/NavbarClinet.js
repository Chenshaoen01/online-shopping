"use client"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from "react"
import { useCart } from "./CartContext"
import { apiFetch } from "@/api/client"
import alertify from "alertifyjs"

export default function NavbarClinet({ isLoginDefalut }) {

    const router = useRouter()
    const [isMobileNavbarExpanded, setIsMobileNavbarExpanded] = useState(false)
    const [isLogin, setIsLogin] = useState(isLoginDefalut)
    const { cartData, refreshCart } = useCart()

    useEffect(() => {
        if (!isLogin) {
            return
        }

        let cancelled = false
        refreshCart().then(status => {
            if (!cancelled && status === 401) {
                setIsLogin(false)
            }
        })

        return () => { cancelled = true }
    }, [isLogin, refreshCart])

    const logOut = useCallback(async () => {
        try {
            await apiFetch('/users/logout', { method: 'POST' })
            localStorage.removeItem("csrfToken")
            router.push("/User/Login")
        } catch (error) {
            alertify.alert("", error.message ? error.message : "登出失敗")
        }
    }, [router])

    return <div className={isMobileNavbarExpanded ? "navbar-area-container active" : "navbar-area-container"}
        onClick={() => { setIsMobileNavbarExpanded(false); }}>
        <div className="navbar-area justify-between"
            onClick={(e) => { e.stopPropagation(); }}>
            <Link className="mx-4 flex items-center" href="/">
                <img className="navbar-logo me-2" src="/logo1.png"></img>
                <div className="whitespace-nowrap me-4">毛孩物坊{isMobileNavbarExpanded}</div>
            </Link>
            <img className="navbar-hamburger block lg:hidden me-4" src="/menu-burger.svg"
                onClick={() => { setIsMobileNavbarExpanded(!isMobileNavbarExpanded); }}></img>
            <div className="navbar-options-area">
                <div className="navbar-options-front-area">
                    <Link className="me-4 navbar-option" href="/About">關於我們</Link>
                    <Link className="me-4 navbar-option" href="/Product/List/All">商品列表</Link>
                    <Link className="me-4 navbar-option" href="/FAQ">常見問答</Link>
                </div>
                <div className="navbar-options-back-area">
                    {
                        isLogin && <>
                            <Link href="/User/Cart" className="me-4 navbar-option">
                                <div className="flex items-center relative">
                                    <img className="cart-icon" src="/cart-primary.png"></img>
                                    <span className="ml-2 lg:hidden">購物車</span>
                                    {
                                        Array.isArray(cartData?.cart_items) && <span className="cart-count-badge">{cartData?.cart_items?.length}</span>
                                    }
                                </div>
                            </Link>
                            <Link href="/User/Order/List" className="me-4 navbar-option relative">我的訂單</Link>
                        </>
                    }
                    {isLogin && <button className="me-4 navbar-option" type="button" onClick={logOut}>登出</button>}
                    {!isLogin && <>
                        <Link className="me-4 navbar-option" href="/User/Login">登入</Link>
                        <Link className="me-8 navbar-option" href="/User/Register">註冊</Link>
                    </>}
                </div>
            </div>
        </div>
    </div>
}