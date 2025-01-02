"use client"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from "react"

export default ({ isLogIn }) => {
    const router = useRouter()
    const [isMobileNavbarExpanded, setIsMobileNavbarExpanded] = useState(false)
    const [cartData, setCartData] = useState({})
    useEffect(() => {
        if (isLogIn && typeof window !== undefined) {
            getUserCart()
        }
    }, [])

    const getUserCart = useCallback(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if(!res.ok) {
                    return new Promise.reject(new Error())
                }
                return res.json()
            })
            .then(res => {
                setCartData(res)
                setTimeout(() => {
                    getUserCart()
                }, 2000)
            })
            .catch((err) => {
                console.log(err)
            })
    }, []) 

    const logOut = useCallback(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include', // 包含 cookies
        })
            .then(res => {
                if (res.ok) {
                    localStorage.removeItem("csrfToken")
                    router.push("/User/Login")
                } else {
                    console.error('登出失敗');
                }
            })
    }, [])

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
                        isLogIn && <>
                            <Link href="/User/Order/List" className="me-4 navbar-option relative">我的訂單</Link>
                            <Link href="/User/Cart" className="me-4 navbar-option">
                                <div className="flex items-center relative">
                                    <span>購物車</span>
                                    {
                                        Array.isArray(cartData?.cart_items) && <span className="cart-count-badge">{cartData?.cart_items?.length}</span>
                                    }
                                </div>
                            </Link>
                        </>
                    }
                    {isLogIn && <button className="me-4 navbar-option" type="button" onClick={logOut}>登出</button>}
                    {!isLogIn && <>
                        <Link className="me-4 navbar-option" href="/User/Login">登入</Link>
                        <Link className="me-8 navbar-option" href="/User/Register">註冊</Link>
                    </>}
                </div>
            </div>
        </div>
    </div>
}