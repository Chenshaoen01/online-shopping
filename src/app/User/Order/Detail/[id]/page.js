import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import OrderDatailClient from "@/app/User/Components/OrderDatailClient";

export default async ({ params }) => {

    const cookieHeader = cookies().toString()
    const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${params.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Cookie': cookieHeader
        }
    })

    if (!orderRes.ok) {
        notFound()
    }

    const orderData = await orderRes.json()

    return <>
        <Navbar></Navbar>
        <OrderDatailClient orderData={orderData}></OrderDatailClient>
    </>
}
