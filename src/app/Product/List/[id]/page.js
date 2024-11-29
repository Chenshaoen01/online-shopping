import Link from "next/link"
import Navbar from "@/components/Navbar";
import ProductListClient from "@/components/ProductListClient";

export default async ({ params }) => {
    const urlQuery = params.id === "All"? "page=1" : `category_id=${params.id}&page=1`
    const productDataList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productCategory/getCategoryProduct?${urlQuery}`)
        .then(res => res.json())
        .then(res => res.dataList)


    return <>
        <Navbar></Navbar>
        <ProductListClient categoryId={params.id}></ProductListClient>
        {/* <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">商品列表</div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                    {
                        Array.isArray(productDataList) && productDataList.map((product, productIndex) =>
                            <div className="flex justify-center" key={product.product_id + productIndex}>
                                <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                                    <div className="product-img mb-4" style={{ backgroundImage: product.product_img? `url('${process.env.NEXT_PUBLIC_API_URL}/images/product/${product.product_img}')`: "" }}></div>
                                    <div className="product-title">{product.product_name}</div>
                                    <div className="product-price">{product.product_price}</div>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div> */}
    </>
}