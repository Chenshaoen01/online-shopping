import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const CartClient = dynamic(() => import("../Components/CartClient"), {ssr: false})

export default async () => {
    return <>
        <Navbar></Navbar>
        <CartClient></CartClient>
    </>
}