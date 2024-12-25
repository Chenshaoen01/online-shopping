import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { LoadingPage } from '@/components/LoadingPage';

const CartClient = dynamic(() => import("../Components/CartClient"), {ssr: false})

export default async () => {
    return <>
        <LoadingPage></LoadingPage>
        <Navbar></Navbar>
        <CartClient></CartClient>
    </>
}