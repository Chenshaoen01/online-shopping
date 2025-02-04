'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from "@/components/ProductCard";

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
                       <ProductCard product={product}  key={product.product_id + productIndex}/>
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
                    centeredSlides={false}
                    loop={true}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper">
                    {
                        Array.isArray(productList) && productList.map((product, productIndex) =>
                            <SwiperSlide key={productIndex}>
                                <ProductCard product={product}  key={product.product_id + productIndex}/>
                            </SwiperSlide>
                        )
                    }
                </Swiper>
            </div>
        </>
    );
}