"use client";
import { useState, useEffect, useMemo, useCallback } from "react"
import { LoadingPageShow, LoadingPageHide } from '@/components/LoadingPage';
import alertify from 'alertifyjs';

export default () => {
    const [cartData, setCartData] = useState([])
    useEffect(() => {
        if(typeof window !== undefined) { 
            updateCartData()   
        }
    }, [])

    const updateCartData = useCallback(() => {
        LoadingPageShow()
        if(typeof window !== undefined) {
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
                    LoadingPageHide()
                    if (res.cart_items) {
                        setCartData(res.cart_items)
                    }
                })
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

    const deleteCartItem = (deleteCartItemId) => {
        LoadingPageShow()
        if(typeof window !== undefined) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${deleteCartItemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': localStorage.getItem("csrfToken")
                }
            })
                .then(res => {
                    LoadingPageHide()
                    if (!res.ok) {
                        if(res.status === 401) {
                            alertify.alert("", "購物車品項刪除失敗：尚未登入")
                        } else {
                            alertify.alert("", "購物車品項刪除失敗")
                        }
                        return
                    }
                    alertify.alert("", "購物車品項刪除成功")
                    updateCartData()
                })
        }
    }

    const cartTotalPrice = useMemo(() => {
        return cartData.reduce((priceAccumulator, currentCartItem) => {
            if (currentCartItem.is_active === 1) {
                priceAccumulator += parseFloat(currentCartItem.quantity) * parseFloat(currentCartItem.model_price)
            }
            return priceAccumulator
        }, 0)
    }, [cartData])

    return <>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">我的購物車</div>
                {
                    (Array.isArray(cartData) && cartData.length > 0) ? (
                        <>
                            <div className="shopping-content-list">
                                {
                                    Array.isArray(cartData) && cartData.map(cartItem => (
                                        <div className={`shopping-content-item ${!(cartItem.is_active === 1) && "not-active"}`}
                                            key={cartItem.cart_item_id}>
                                            <div className="shopping-content-item-image" style={{ backgroundImage: (cartItem.product_img === "" || cartItem.product_img === null || cartItem.product_img === undefined) ? `url('/no-image.png')` : `url('${process.env.NEXT_PUBLIC_FILE_URL}/${cartItem.product_img}')` }}></div>
                                            <div className="w-full flex items-top justify-between">
                                                <div className="shopping-content-item-info">
                                                    <p className="font-bold text-xl mb-1">{cartItem.product_name}</p>
                                                    <p><span className="title-md">規格</span>{cartItem.model_name}</p>
                                                    <p><span className="title-md">數量</span>{cartItem.quantity}</p>
                                                    <p><span className="title-md">單價</span>NT$ {cartItem.model_price}</p>
                                                    <p><span className="title-md">小計</span>NT$ {parseFloat(cartItem.model_price) * parseFloat(cartItem.quantity)}</p>
                                                </div>
                                                <div className="flex items-center">
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
                            <div className="w-full flex justify-center items-center my-8">
                                <button type="button" className="button-md button-dark">結帳</button>
                            </div>
                        </>
                    ) : <p className="text-center mt-16 text-xl">購物車目前尚無內容</p>
                }
            </div>
        </div>
    </>
}