import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel"
import ProductImgArea from "../../Components/ProductImgArea";

export default async ({ params }) => {
    const productDataList = []
    for (let i = 1; i <= 6; i++) {
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
                <div className="grid grid-cols-12">
                    {/* 圖片 */}
                    <div className="col-span-12 md:col-span-7">
                        <div className="w-full flex justify-center">
                            <ProductImgArea></ProductImgArea>
                        </div>
                    </div>
                    {/* 產品名稱/價格/連結/數量/款式/購物按鈕 */}
                    <div className="col-span-12 md:col-span-5">
                        <div className="flex flex-col">
                            <p className="text-3xl font-bold mb-4">商品名稱</p>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum quis sapien at efficitur. Suspendisse potenti. Phasellus tellus ligula, molestie eget tortor vitae, mattis rhoncus lorem. Mauris vulputate placerat turpis, eu pharetra risus maximus congue. Sed quis porta tellus. Duis ullamcorper, nisl at consequat lobortis, lacus lorem malesuada tortor, eget bibendum tellus dui posuere lectus. Fusce scelerisque justo et gravida consequat. Aliquam diam justo, mattis at libero eu, congue scelerisque diam. Fusce sed ante a nunc finibus varius. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus finibus cursus leo, sit amet rutrum turpis finibus in.

                    Nullam quis ex sit amet quam suscipit luctus. Sed aliquam mollis dui, a laoreet leo volutpat sed. Quisque ultricies lobortis nisi luctus egestas. Aenean ultricies interdum tempus. Phasellus accumsan magna non ante ullamcorper viverra. Proin et tellus sit amet magna porta blandit nec sit amet lectus. Pellentesque ut dolor eu leo ornare placerat. Nam condimentum ullamcorper nunc, id laoreet risus laoreet sed.

                    Morbi fringilla libero risus, luctus tincidunt dui malesuada eget. Proin quis enim rhoncus, congue lacus nec, commodo diam. Donec ultricies enim purus, et vestibulum magna feugiat sed. Fusce viverra diam ac risus interdum, vitae tincidunt quam iaculis. Nulla justo dolor, malesuada sit amet tempus ac, venenatis et turpis. Nam eu ultrices lorem. Nam ut magna cursus, auctor velit nec, accumsan neque. Praesent iaculis mauris quis turpis gravida pellentesque. Sed viverra est quis est accumsan euismod. Proin tincidunt tempor tortor, sed hendrerit nibh accumsan non. Sed posuere ultrices sapien, vitae iaculis augue suscipit vitae. Phasellus feugiat condimentum metus id vestibulum. Duis auctor cursus velit eget bibendum. In varius aliquam felis. Nunc ut ante sit amet nisl cursus eleifend. Vestibulum viverra tortor vel malesuada ullamcorper.
                </div>
                <div className="section-title mb-4">推薦商品</div>
                <ProductCarousel></ProductCarousel>
            </div>
        </div>
    </>
}