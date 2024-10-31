import Link from "next/link"
import Navbar from "@/components/Navbar";

export default async () => {
    // const productDataList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?page=1`)
    //     .then(res => res.json())
    //     .then(res => res.data)

    const productDataList = []
    for (let i = 1; i <= 10; i++) {
        productDataList.push({
            product_id: "product1",
            product_img: "",
            product_name: "商品名稱",
            product_info: "",
            product_price: 1500
        })
    }

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">商品列表</div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                    {
                        productDataList.map((product, productIndex) =>
                            <div className="flex justify-center" key={product.product_id + productIndex}>
                                <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                                    <div className="product-img" style={{ backgroundImage: `url('http://localhost:3010/cat-tree.jpg')` }}></    div>
                                    <div className="product-title">{product.product_name}</div>
                                    <div className="product-price">{product.product_price}</div>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>
}