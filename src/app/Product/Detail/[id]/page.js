import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel"
import { cookies } from "next/headers";
import ProductImgArea from "../../Components/ProductImgArea";
import ProductInfo from "../../Components/ProductInfo";
import { LoadingPage } from "@/components/LoadingPage";

export default async ({ params }) => {
    // 取得商品資訊
    const productData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${params.id}`, { cache: "no-cache" }).then(res => res.json())
    const productSubImgList = Array.isArray(productData.images) ? productData.images.map(productImage => productImage.product_img) : []


    // 取得相關商品資訊
    const relatedProductData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/related/${params.id}`, { cache: "no-cache" }).then(res => res.json())

    // 從cookie查詢是否登入
    const cookieHeader = cookies().toString()
    const isLogin = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/checkLogin`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Cookie': cookieHeader
        }
    }).then(res => {
        return new Promise(resolve => {
            resolve(res.status === 200)
        })
    })

    return <>
        <Navbar></Navbar>
        <LoadingPage></LoadingPage>
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
                        <ProductInfo productData={productData} isLoginDefault={isLogin}></ProductInfo>
                    </div>
                </div>
                <div className="section-title my-8">商品介紹</div>
                <div className="product-info mb-8">
                    {productData?.product_info}
                </div>
                {
                    (Array.isArray(relatedProductData) && relatedProductData.length > 0) && <>
                        <div className="section-title mb-4">相關商品</div>
                        <ProductCarousel productList={relatedProductData}></ProductCarousel>
                    </>
                }
            </div>
        </div>
    </>
}