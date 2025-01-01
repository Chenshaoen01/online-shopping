'use client'
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function App({bannerSourceList}) {
    const [bannerImageList] = useState(bannerSourceList);

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
                            <a target="_blank" href={image.banner_link}
                                 className="homepage-carousel-item"
                                 style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_FILE_URL}/${image.banner_img}')` }}></a>
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </>
    );
}