import Navbar from "@/components/Navbar";
import CartClient from "../Components/CartClient";
import { LoadingPage } from '@/components/LoadingPage';

export default async () => {
    return <>
        <LoadingPage></LoadingPage>
        <Navbar></Navbar>
        <CartClient></CartClient>
    </>
}