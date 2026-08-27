"use client"
import { apiUrl } from "@/api/client"

export default function PaymentInfoPage({orderId, isNewBuilt}) {
    return <div id="order-built-info-page" className="order-built-info-page">
        <div className="order-built-info-area">
            {
                isNewBuilt && <div className="text-3xl font-bold mb-4">訂單已建立</div> 
            }
            <div className="order-built-info-box">
                <div className="section-title mb-8 mt-4 w-full">付款須知</div>
                <div className="flex flex-col mb-8">
                    <div>1.本網站僅為個人作品，無實際商業用途</div>
                    <div className="mb-4">2.請使用以下信用卡資料測試付款功能：</div>
                    <p><span className="title-md">信用卡號</span>4311-9511-1111-1111</p>
                    <p><span className="title-md">安全碼</span>任意輸入三碼數字</p>
                    <p><span className="title-md">有效月/年</span>任意大於現在當下時間的月/年</p>
                </div>
                <button type="button" className="button-md button-dark" onClick={() => {
                    window.location.href = apiUrl(`/ecpayment?orderId=${orderId}`)
                }}>前往付款</button>
            </div>
        </div>
    </div>
}