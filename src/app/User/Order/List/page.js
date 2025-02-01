import Link from "next/link"
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

export default async () => {
    const cookieHeader = cookies().toString()
    const userOrderList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/userOrders`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Cookie': cookieHeader
        }
    })
        .then(res => res.json())

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">我的訂單</div>
                {
                    (Array.isArray(userOrderList) && userOrderList.length > 0) ? (
                        <div className="flex flex-col">
                            {
                                userOrderList.map((order, orderIndex) =>
                                    <div className="flex" key={order.order_id + orderIndex}>
                                        <Link className="order-card mb-6" href={`/User/Order/Detail/${order.order_id}`}>
                                            <p><span className="title-md">訂單編號</span>{order.order_id}</p>
                                            <p><span className="title-md">訂單金額</span>${order.total_price}</p>
                                            <p><span className="title-md">訂單建立日期</span>{order.created_at}</p>
                                            <p><span className="title-md">訂單狀態</span>{order.order_status}</p>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    ) : <p className="text-center mt-16 text-xl">尚無訂單紀錄</p>
                }

            </div>
        </div>
    </>
}