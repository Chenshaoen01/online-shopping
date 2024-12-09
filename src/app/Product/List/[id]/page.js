import Navbar from "@/components/Navbar";
import ProductListClient from "../../Components/ProductListClient";
import { LoadingPage } from '@/components/LoadingPage';

export default async ({ params }) => {
    return <>
        <LoadingPage></LoadingPage>
        <Navbar></Navbar>
        <ProductListClient categoryId={params.id}></ProductListClient>
    </>
}