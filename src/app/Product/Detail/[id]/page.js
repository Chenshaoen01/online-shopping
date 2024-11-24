import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel"
import ProductImgArea from "../../Components/ProductImgArea";

export default async ({ params }) => {
    const productData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${params.id}`).then(res => res.json())
    const productSubImgList = Array.isArray(productData.images) ? productData.images.map(productImage => productImage.product_img) : []
    console.log("productData.images", productData.images)
    console.log("productSubImgList", productSubImgList)

    const relatedProductData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/related/${params.id}`).then(res => res.json())

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">商品列表</div>
                <div className="grid grid-cols-12">
                    {/* 圖片 */}
                    <div className="col-span-12 md:col-span-7">
                        <div className="w-full flex justify-center">
                            <ProductImgArea productSubImgList={productSubImgList}></ProductImgArea>
                        </div>
                    </div>
                    {/* 產品名稱/價格/連結/數量/款式/購物按鈕 */}
                    <div className="col-span-12 md:col-span-5">
                        <div className="flex flex-col">
                            <p className="text-3xl font-bold mb-4">{productData?.product_name}</p>
                            <p className="text-2xl font-bold">NT$ 1200</p>
                            <div className="devider"></div>
                            <div className="flex flex-col mb-6">
                                <p className="text-xl font-bold mb-2">購買數量</p>
                                <input type="number" className="w-full primary-input"></input>
                            </div>
                            <div className="flex flex-col mb-6">
                                <p className="text-xl font-bold mb-2">選擇款式</p>
                                <select className="w-full primary-input">
                                    <option>款式一</option>
                                </select>
                            </div>
                            <button type="button" className="mx-auto mt-4 button-light button-large">加入購物車</button>
                        </div>
                    </div>
                </div>
                <div className="section-title my-8">商品介紹</div>
                <div className="product-info mb-8">
                    {productData?.product_info}
                </div>
                <div className="section-title mb-4">推薦商品</div>
                <ProductCarousel productList={relatedProductData}></ProductCarousel>
            </div>
        </div>
    </>
}