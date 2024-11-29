"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default ({ csrfToken }) => {
    const [isLogIn] = useState(csrfToken !== undefined)
    const [isMobileNavbarExpanded, setIsMobileNavbarExpanded] = useState(false)
    const [cartData, setCartData] = useState({})
    useEffect(() => {
        if (isLogIn) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.cookie.split('; ').find(row => row.startsWith('csrfToken='))?.split('=')[1]
                }
            })
                .then(res => res.json())
                .then(res => {
                    setCartData(res)
                })
        }
    }, [])

    const logOut = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include', // 包含 cookies
        })
            .then(res => {
                if (res.ok) {
                    document.cookie = 'csrfToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                    window.location.href = '/User/Login';
                } else {
                    console.error('登出失敗');
                }
            })
    };

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
                        cartData?.cart_items?.length > 0 ? <div className="me-4 navbar-option">購物車({cartData?.cart_items?.length})</div> : null
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