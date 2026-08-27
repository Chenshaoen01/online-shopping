import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const OrderConfirmClient = dynamic(() => import("../../Components/OrderConfirmClient"), {ssr: false})

export default async function OrderConfirmPage() {
    return <>
        <Navbar></Navbar>
        <OrderConfirmClient></OrderConfirmClient>
    </>
}