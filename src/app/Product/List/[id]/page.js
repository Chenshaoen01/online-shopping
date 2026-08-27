import Navbar from "@/components/Navbar";
import ProductListClient from "../../Components/ProductListClient";
import { serverFetch } from "@/api/server";

export async function generateMetadata({ params }) {
    if (params.id === "All") {
        return { title: "全部商品" }
    }

    const categoryRes = await serverFetch(`/productCategory/${params.id}`, { cache: "no-cache" })
    if (!categoryRes.ok) {
        return { title: "商品列表" }
    }

    const categoryData = await categoryRes.json()
    return { title: categoryData.category_name ? categoryData.category_name : "商品列表" }
}

export default async function ProductListPage({ params }) {
    return <>
        <Navbar></Navbar>
        <ProductListClient categoryId={params.id} key={params.id}></ProductListClient>
    </>
}