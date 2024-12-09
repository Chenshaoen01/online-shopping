import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

export default async ({ params }) => {

    const cookieHeader = cookies().toString()
    const orderData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${params.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Cookie': cookieHeader
        }
    }).then(res => res.json())

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">我的訂單 / {orderData.order.order_id}</div>
                <p><span className="title-md">訂單編號</span>{orderData.order.order_id}</p>
                <p><span className="title-md">訂單金額</span>${orderData.order.total_price}</p>
                <p><span className="title-md">訂單建立日期</span>{orderData.order.created_at}</p>
                <p><span className="title-md">訂單狀態</span>{orderData.order.order_status}</p>
                <div className="section-title my-8">訂單明細</div>
                <div className="shopping-content-list">
                    {
                        Array.isArray(orderData.items) && orderData.items.map(orderItem => (
                            <div className="shopping-content-item" key={orderItem.order_item_id}>
                                <div className="shopping-content-item-info">
                                    <p className="font-bold text-lg mb-1">{orderItem.product_name}</p>
                                    <p><span className="title-md">規格</span>{orderItem.model_name}</p>
                                    <p><span className="title-md">數量</span>{orderItem.quantity}</p>
                                    <p><span className="title-md">單價</span>NT$ {orderItem.model_price}</p>
                                    <p><span className="title-md">小計</span>NT$ {parseFloat(orderItem.model_price) * parseFloat(orderItem.quantity)}</p>
                                </div>
                            </div>
                        ))
                    }
                    <div className="flex justify-end pt-2">
                        <span className="me-2 font-bold text-xl">總計</span>
                        <span className="me-2 font-bold text-xl">NT$ {orderData.order.total_price}</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}