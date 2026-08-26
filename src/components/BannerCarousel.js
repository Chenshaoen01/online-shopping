'use client'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function App({bannerSourceList}) {
    return (
        <>
            <Swiper 
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
                    bannerSourceList.map(image =>
                        <SwiperSlide key={image.banner_id}>
                            <a target="_blank" href={image.banner_link}
                                 className="homepage-carousel-item hidden md:block"
                                 style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_FILE_URL}/${image.banner_img}')` }}></a>
                            <a target="_blank" href={image.banner_link}
                                 className="homepage-carousel-item block md:hidden"
                                 style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_FILE_URL}/${image.mobile_banner_img}')` }}></a>
                        </SwiperSlide>
                    )
                }
            </Swiper>
        </>
    );
}