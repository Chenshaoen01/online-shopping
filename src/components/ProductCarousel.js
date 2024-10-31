'use client'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

export default function App() {
    const productDataList = []
    for (let i = 1; i <= 4; i++) {
        productDataList.push({
            product_id: "product1",
            product_img: "",
            product_name: `商品名稱${i}`,
            product_info: "",
            product_price: 1500
        })
    }

    return (
        <>
            <div className="hidden lg:grid lg:grid-cols-4 gap-y-4 mt-8 mb-32">
                {
                    productDataList.map((product, productIndex) =>
                        <div className="flex justify-center" key={product.product_id + productIndex}>
                            <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                                <div className="product-img" style={{ backgroundImage: `url('http://localhost:3010/cat-tree.jpg')` }}></div>
                                <div className="product-title">{product.product_name}</div>
                                <div className="product-price">{product.product_price}</div>
                            </Link>
                        </div>
                    )
                }
            </div>
            <div className="block lg:hidden mt-8 mb-32">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        768: {
                          slidesPerView: 3,
                        },
                      }}
                    centeredSlides={true}
                    loop={true}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper">
                    {
                        productDataList.map((product, productIndex) =>
                            <SwiperSlide key={productIndex}>
                                <div className="flex justify-center" key={product.product_id + productIndex}>
                                    <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                                        <div className="product-img" style={{ backgroundImage: `url('http://localhost:3010/cat-tree.jpg')` }}></div>
                                        <div className="product-title">{product.product_name}</div>
                                        <div className="product-price">{product.product_price}</div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            </div>
        </>
    );
}