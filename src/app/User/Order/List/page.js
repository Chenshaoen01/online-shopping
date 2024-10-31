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
                <div className="section-title my-8">我的訂單</div>
                <div className="flex flex-col">
                    {
                        productDataList.map((product, productIndex) =>
                            <div className="flex" key={product.product_id + productIndex}>
                                <Link className="order-card mb-6" href={`/User/Order/Detail/${product.product_id}`}>
                                    <p><span class="title-md">訂單編號</span>20241009</p>
                                    <p><span class="title-md">訂單金額</span>$2500</p>
                                    <p><span class="title-md">訂單建立日期</span>2024/10/09</p>
                                    <p><span class="title-md">訂單狀態</span>已出貨</p>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </>
}