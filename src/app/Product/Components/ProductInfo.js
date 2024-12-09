'use client'
import { useState } from "react"
import alertify from "alertifyjs"
import { LoadingPageShow, LoadingPageHide } from '@/components/LoadingPage';

export default ({ productData, isLogin }) => {
    const [purchaseQuantity, setPurchaseQuantity] = useState(1)
    const [selectedModelId, setSelectedModelId] = useState("")
    const [selectedProductPrice, setSelectedProductPrice] = useState(productData?.product_price)

    // 價格更新：檢查數量是否大於1
    const handleQuantityOnChange = (newQuantity) => {
        const newQuantityParseFloat = parseFloat(newQuantity)
        if (parseFloat(newQuantityParseFloat) < 1) {
            alertify.alert("", "商品數量須大於 1")
            setPurchaseQuantity(1)
        } else if (!Number.isInteger(newQuantityParseFloat)) {
            alertify.alert("", "商品數量須為整數")
            setPurchaseQuantity(1)
        } else {
            setPurchaseQuantity(newQuantity)
        }
    }

    // 款式更新：更新價格
    const handleModelOnChange = (newModelId) => {
        setSelectedModelId(newModelId)

        const selectedModel = productData.models.find(model => model.model_id === newModelId)
        if (selectedModel !== null) {
            setSelectedProductPrice(selectedModel.model_price)
        } else {
            setSelectedProductPrice(productData?.product_price)
        }
    }

    // 商品加入購物車前，檢查有沒有選款式
    const validateBeforeAddCart = () => {
        if (selectedModelId === null || selectedModelId === "" || selectedModelId === undefined) {
            alertify.alert("", "請選擇商品款式")
        } else {
            addCartItem()
        }
    }

    // 商品加入購物車
    const addCartItem = () => {
        const newCartItemData = {
            product_id: productData.product_id,
            model_id: selectedModelId,
            quantity: purchaseQuantity
        }

        LoadingPageShow()
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(newCartItemData),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.cookie.split('; ').find(row => row.startsWith('csrfToken='))?.split('=')[1]
            }
        })
            .then(res => {
                if (!res.ok) {
                    if(res.status === 401) {
                        alertify.alert("", "商品加入購物車失敗：尚未登入")
                    } else {
                        alertify.alert("", "商品加入購物車失敗")
                    }
                    return new Promise.reject(new Error("商品加入購物車失敗"))
                }
                LoadingPageHide()
                return res.json()
            })
            .then(data => {
                LoadingPageHide()
                alertify.alert("", "商品已加入購物車")
            })
            .catch(error => {
                LoadingPageHide()
                console.error(error);
            });
    }

    return <>
        <div className="flex flex-col">
            <p className="text-3xl font-bold mb-4">{productData?.product_name}</p>
            <p className="text-2xl font-bold">NT$ {selectedProductPrice}</p>
            <div className="devider"></div>
            <div className="flex flex-col mb-6">
                <p className="text-xl font-bold mb-2">購買數量</p>
                <input type="number" className="w-full primary-input" min="1"
                    value={purchaseQuantity} onChange={(e) => { handleQuantityOnChange(e.target.value) }}></input>
            </div>
            <div className="flex flex-col mb-6">
                <p className="text-xl font-bold mb-2">選擇款式</p>
                <select className="w-full primary-input" value={selectedModelId}
                    onChange={(e) => { handleModelOnChange(e.target.value) }}>
                    <option value="" disabled>請選擇商品款式</option>
                    {
                        Array.isArray(productData.models) && productData.models.map(model => (
                            <option value={model.model_id} key={model.model_id}>{model.model_name}</option>
                        ))
                    }
                </select>
            </div>
            <div className="flex flex-col items-center">
                <button type="button" disabled={!isLogin}
                        className={`mx-auto mt-2 button-light button-large ${!isLogin && "disabled-button"}`}
                        onClick={() => { validateBeforeAddCart() }}>加入購物車{isLogin}</button>
                { !isLogin && <p className="mt-4">尚未登入</p> }
            </div>
        </div>
    </>
}