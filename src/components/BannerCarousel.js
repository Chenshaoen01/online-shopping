'use client'
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function App() {
    const [bannerImageList] = useState([
        "/banner-01.png",
        "/banner-02.png",
        "/banner-03.png"
    ]);

    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                }}
                pagination={{
                    clickable: true,
                }}
                loop={true}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper">
                {
                    bannerImageList.map((image, imageIndex) =>
                        <SwiperSlide key={imageIndex}>
                            <div className="homepage-carousel-item" style={{ backgroundImage: `url('${image}')` }}></div>
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </>
    );
}