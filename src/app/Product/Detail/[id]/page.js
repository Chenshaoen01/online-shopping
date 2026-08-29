import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel"
import ProductImgArea from "../../Components/ProductImgArea";
import ProductInfo from "../../Components/ProductInfo";
import { notFound } from "next/navigation";
import { serverFetch, checkLogin } from "@/api/server";
import { imageUrl } from "@/api/files";

export async function generateMetadata({ params }) {
    const productRes = await serverFetch(`/product/${params.id}`, { cache: "no-cache" })
    if (!productRes.ok) {
        return { title: "找不到商品" }
    }

    const productData = await productRes.json()
    const description = productData.product_info ? productData.product_info.slice(0, 100) : ""
    const firstImage = Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images[0].product_img
        : ""

    return {
        title: productData.product_name,
        description,
        openGraph: {
            title: productData.product_name,
            description,
            images: firstImage === "" ? [] : [imageUrl(firstImage)]
        }
    }
}

export default async function ProductDetailPage({ params }) {
    // 同時取得商品資訊、相關商品資訊，並從cookie查詢是否登入
    const [productRes, relatedProductRes, isLogin] = await Promise.all([
        serverFetch(`/product/${params.id}`, { cache: "no-cache" }),
        serverFetch(`/product/related/${params.id}`, { cache: "no-cache" }),
        checkLogin()
    ])

    if (!productRes.ok) {
        notFound()
    }

    const productData = await productRes.json()
    const productSubImgList = Array.isArray(productData.images) ? productData.images.map(productImage => productImage.product_img) : []
    const relatedProductData = relatedProductRes.ok ? await relatedProductRes.json() : []

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">商品資訊</div>
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
