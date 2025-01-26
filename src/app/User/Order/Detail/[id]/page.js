import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import OrderDatailClient from "@/app/User/Components/OrderDatailClient";

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
        <OrderDatailClient orderData={orderData}></OrderDatailClient>
    </>
}