import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import { serverFetchWithCookie } from "@/api/server";
import OrderDetailClient from "@/app/User/Components/OrderDetailClient";

export const metadata = {
    title: "訂單明細"
};

export default async function OrderDetailPage({ params }) {
    const orderRes = await serverFetchWithCookie(`/order/${params.id}`)

    if (!orderRes.ok) {
        notFound()
    }

    const orderData = await orderRes.json()

    return <>
        <Navbar></Navbar>
        <OrderDetailClient orderData={orderData}></OrderDetailClient>
    </>
}
