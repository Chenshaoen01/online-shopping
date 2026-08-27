"use client";
import PaymentInfoPage from "@/components/PaymentInfoPage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/api/client";
import { formatDate } from "@/utils/date";

export default function OrderDatailClient({orderData}) {
    const [isPaymentInfoShow, setIsPaymentInfoShow] = useState(false)

    // 取得物流方式選項
    const [cvsTypeOptions, setCvsTypeOptions] = useState([])
    const getCvsTypeOptions = useCallback(async () => {
        try {
            setCvsTypeOptions(await apiFetch('/logistic/getCvsTypeOptions'))
        } catch (error) {
            setCvsTypeOptions([])
        }
    }, [])

    useEffect(() => {
        getCvsTypeOptions()
    }, [getCvsTypeOptions])

    // 取得物流方式名稱
    const csvTypeName = useMemo(() => {
        const targetCsvTypeOptionIndex = cvsTypeOptions.findIndex(option => option.CvsTypeCode === orderData.order.csv_type)
        return targetCsvTypeOptionIndex !== -1 ? cvsTypeOptions[targetCsvTypeOptionIndex].CvsTypeName : ""
    }, [cvsTypeOptions, orderData.order.csv_type])

    return <>
        {isPaymentInfoShow && <PaymentInfoPage isNewBuilt={false} orderId={orderData.order.order_id}></PaymentInfoPage>}
        <div className="main-content-area">
            <div className="custom-container">
                {/* 訂單基本資料 */}
                <div className="section-title my-8">訂單基本資料</div>
                <div className="flex">
                    <span className="title-md">訂單編號</span>
                    <span className="text-wrap break-all">{orderData.order.order_id}</span>
                </div>
                <div className="flex">
                    <span className="title-md">訂單金額</span>${orderData.order.total_price}
                </div>
                <div className="flex">
                    <span className="title-md">訂單建立日期</span>{formatDate(orderData.order.created_at)}
                </div>
                <div className="flex">
                    <span className="title-md">訂單狀態</span>{orderData.order.order_status}
                </div>
                {
                    orderData.order.order_status === '未付款' && <>
                        <div className="w-full flex justify-center items-center my-8">
                            <button type="button" className="button-md button-dark" onClick={() => {
                                setIsPaymentInfoShow(true) 
                            }}>前往付款</button>
                        </div>       
                    </>
                }
                <div className="section-title my-8">訂單明細</div>
                {/* 訂單明細 */}
                <div className="shopping-content-list">
                    {
                        Array.isArray(orderData.items) && orderData.items.map(orderItem => (
                            <div className="shopping-content-item" key={orderItem.order_item_id}>
                                <div className="shopping-content-item-info">
                                    <div className="flex">
                                        <span className="title-md">商品名稱</span>
                                        <span>{orderItem.product_name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="title-md">款式</span>
                                        <span>{orderItem.model_name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="title-md">數量</span>
                                        <span>{orderItem.quantity}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="title-md">單價</span>
                                        <span>NT$ {orderItem.model_price}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="title-md">小計</span>
                                        <span>NT$ {Number(orderItem.model_price) * orderItem.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <div className="flex justify-end pt-2">
                        <span className="me-2 font-bold text-xl">總計</span>
                        <span className="me-2 font-bold text-xl">NT$ {orderData.order.total_price}</span>
                    </div>
                </div>
                {/* 出貨資料 */}
                <div className="section-title my-8">出貨資料</div>
                <p><span className="title-md">超商種類</span>{csvTypeName}</p>
                <p><span className="title-md">出貨門市</span>{orderData.order.store_name}</p>
                {/* 收件人資料 */}
                <div className="section-title my-8">收件人資料</div>
                <p><span className="title-md">收件人姓名</span>{orderData.order.receiver_name}</p>
                <p><span className="title-md">收件人電話</span>{orderData.order.receiver_phone}</p>
            </div>
        </div>
    </>
}