'use client'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

export default function App({productList}) {
    return (
        <>
            <div className="hidden lg:grid lg:grid-cols-4 gap-y-4 mt-8 mb-32">
                {
                    Array.isArray(productList) && productList.map((product, productIndex) =>
                        <div className="flex justify-center" key={product.product_id + productIndex}>
                            <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                                <div className="product-img" style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}/images/product/${product.product_img}')` }}></div>
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
                        Array.isArray(productList) && productList.map((product, productIndex) =>
                            <SwiperSlide key={productIndex}>
                                <div className="flex justify-center" key={product.product_id + productIndex}>
                                    <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                                        <div className="product-img" style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}/images/product/${product.product_img}')` }}></div>
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