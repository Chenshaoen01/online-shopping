import Navbar from "@/components/Navbar";
import ProductListClient from "../../Components/ProductListClient";

export default async function ProductListPage({ params }) {
    return <>
        <Navbar></Navbar>
        <ProductListClient categoryId={params.id} key={params.id}></ProductListClient>
    </>
}