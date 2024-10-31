import Link from "next/link"
import Navbar from "@/components/Navbar";

export default async () => {
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
                <div className="section-title my-8">我的購物車</div>
                <div className="flex flex-col">
                    {
                        productDataList.map((product, productIndex) =>
                            <div className="w-full flex justify-between items-center mb-4"
                                 key={product.product_id + productIndex}>
                                <div className="flex">
                                    <img className="cart-img mr-4" src="/cat-tree.jpg"></img>
                                    <div className="flex flex-col">
                                        <p className="text-xl font-bold mb-4">商品名稱</p>
                                        <p className="text-xl font-bold mb-4">NT$ 1300</p>
                                    </div>
                                </div>
                                <button type="button" className="button-md button-dark">刪除</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>
}