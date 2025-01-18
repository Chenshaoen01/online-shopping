import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { LoadingPage } from '@/components/LoadingPage';

const OrderConfirmClient = dynamic(() => import("../../Components/OrderConfirmClient"), {ssr: false})

export default async () => {
    return <>
        <LoadingPage></LoadingPage>
        <Navbar></Navbar>
        <OrderConfirmClient></OrderConfirmClient>
    </>
}