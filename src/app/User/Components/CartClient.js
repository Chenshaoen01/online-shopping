"use client";
import { useState, useEffect, useCallback } from "react"
import Link from "next/link";

import { LoadingPageShow, LoadingPageHide } from '@/components/LoadingPage';
import alertify from 'alertifyjs';
import { useCart } from '@/components/CartContext';

export default () => {
    const [isLoading, setIsLoading] = useState(true)
    const [cartTotalPrice, setCartTotalPrice] = useState(0)
    const [cartData, setCartData] = useState([])
    const [loadError, setLoadError] = useState("")
    const { refreshCart } = useCart()
    useEffect(() => {
        updateCartData()
    }, [])

    const updateCartData = useCallback(async () => {
        LoadingPageShow()
        setLoadError("")
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': localStorage.getItem("csrfToken")
                }
            })
            if (!res.ok) {
                throw new Error()
            }

            const result = await res.json()
            if (result.cart_items) {
                setCartTotalPrice(result.total_price)
                setCartData(result.cart_items)
            }
        } catch (error) {
            setLoadError("購物車資料載入失敗，請稍後再試")
        } finally {
            LoadingPageHide()
            setIsLoading(false)
        }
    }, [])

    const deleteConfirm = (deleteCartItemId) => {
        alertify.confirm(
            "確認刪除", // 標題
            "是否刪除一件購物車商品？", // 內容
            function () {
                deleteCartItem(deleteCartItemId);
            },
            function () {
                alertify.closeAll();
            }
        ).set('labels', { ok: '確認', cancel: '取消' });
    }

    const deleteCartItem = async (deleteCartItemId) => {
        LoadingPageShow()
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${deleteCartItemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': localStorage.getItem("csrfToken")
                }
            })

            if (!res.ok) {
                if (res.status === 401) {
                    alertify.alert("", "購物車品項刪除失敗：尚未登入")
                } else {
                    alertify.alert("", "購物車品項刪除失敗")
                }
                return
            }

            alertify.alert("", "購物車品項刪除成功")
            await updateCartData()
            refreshCart()
        } catch (error) {
            alertify.alert("", "購物車品項刪除失敗，請確認網路連線")
        } finally {
            LoadingPageHide()
        }
    }

    return <>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">我的購物車</div>
                {isLoading && <p className="text-center mt-16 text-xl">資料載入中</p>}
                {(!isLoading && loadError !== "") && <p className="text-center mt-16 text-xl">{loadError}</p>}
                {
                    (!isLoading && loadError === "") && <>
                        {
                            (Array.isArray(cartData) && cartData.length > 0) ? (
                                <>
                                    <div className="shopping-content-list">
                                        {
                                            Array.isArray(cartData) && cartData.map(cartItem => (
                                                <div className={`shopping-content-item ${!(cartItem.is_active === 1) && "not-active"}`}
                                                    key={cartItem.cart_item_id}>
                                                    <div className="shopping-content-item-image" style={{ backgroundImage: (cartItem.product_img === "" || cartItem.product_img === null || cartItem.product_img === undefined) ? `url('/no-image.png')` : `url('${process.env.NEXT_PUBLIC_FILE_URL}/${cartItem.product_img}')` }}></div>
                                                    <div className="w-full flex flex-col md:flex-row items-top justify-between">
                                                        <div className="shopping-content-item-info">
                                                            <p className="font-bold text-xl mb-1">{cartItem.product_name}</p>
                                                            <p><span className="title-md">規格</span>{cartItem.model_name}</p>
                                                            <p><span className="title-md">數量</span>{cartItem.quantity}</p>
                                                            <p><span className="title-md">單價</span>NT$ {cartItem.model_price}</p>
                                                            <p><span className="title-md">小計</span>NT$ {cartItem.item_price}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center mt-4 md:mt-0">
                                                            <button type="button" className="button-md button-dark"
                                                                onClick={() => { deleteConfirm(cartItem.cart_item_id) }}>刪除</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className="flex justify-end pt-2">
                                            <span className="me-2 font-bold text-xl">總計</span>
                                            <span className="me-2 font-bold text-xl">NT$ {cartTotalPrice}</span>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col justify-center items-center my-8">
                                        {
                                            cartData.some(cartItem => cartItem.is_active !== 1)
                                                ? <>
                                                    <button type="button" className="button-md button-dark disabled-button" disabled>建立訂單</button>
                                                    <p className="mt-4">購物車內有已下架的商品，請先移除後再結帳</p>
                                                </>
                                                : <Link className="button-md button-dark" href="/User/Order/Confirm">建立訂單</Link>
                                        }
                                    </div>
                                </>
                            ) : <p className="text-center mt-16 text-xl">購物車目前尚無內容</p>
                        }
                    </>
                }
            </div>
        </div>
    </>
}