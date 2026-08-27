'use client'
import { useEffect, useState, useCallback } from "react"
import MicroModal from 'micromodal';
import Image from 'next/image';
import { imageUrl, backgroundImage } from '@/api/files';

export default function ProductImgArea({ productSubImgList }) {
    const [mainImgIndex, setMainImgIndex] = useState(0)

    const subImgOnclick = useCallback((action) => {
        if (action === 'prev' && mainImgIndex !== 0) {
            setMainImgIndex(mainImgIndex - 1)
        } else if (action === 'next' && mainImgIndex !== productSubImgList.length - 1) {
            setMainImgIndex(mainImgIndex + 1)
        }
    }, [mainImgIndex, productSubImgList])

    const subImgClassName = useCallback((imgIndex) => {
        const basicClassName = "product-sub-img"
        return ((mainImgIndex > imgIndex) && imgIndex < 3 && productSubImgList.length > 3) ? "hidden" : basicClassName
    }, [mainImgIndex, productSubImgList])

    useEffect(() => {
        MicroModal.init();
    })

    return <>
        <div className="product-detail-img-area mb-8">
            <div className="product-detail-main-img"
                onClick={() => MicroModal.show("modal-1")}
                style={backgroundImage(productSubImgList[mainImgIndex])}>
            </div>
            {
                (Array.isArray(productSubImgList) && productSubImgList.length > 0) && <div className="product-sub-img-area-container mt-4">
                    <button className="product-sub-img-switch-button product-sub-img-switch-button-prev" type="button"
                        onClick={() => { subImgOnclick('prev') }}>
                        <Image className="product-sub-img-switch-icon" src="/angle-left.svg" width={24} height={24} alt="上一張" unoptimized></Image>
                    </button>
                    <button className="product-sub-img-switch-button  product-sub-img-switch-button-next" type="button"
                        onClick={() => { subImgOnclick('next') }}>
                        <Image className="product-sub-img-switch-icon" src="/angle-right.svg" width={24} height={24} alt="下一張" unoptimized></Image>
                    </button>
                    <div className="product-sub-img-area">
                        {
                            productSubImgList.map((subImg, subImgIndex) =>
                                <div className={subImgClassName(subImgIndex)} key={subImgIndex}
                                    style={backgroundImage(subImg)}
                                    onClick={() => { setMainImgIndex(subImgIndex) }}>
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </div>

        <div className="modal micromodal-slide product-img-modal mt-8" id="modal-1" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                    <main className="flex" id="modal-1-content">
                        <div className="fixed top-4 right-4 modal__close cursor-pointer"
                             aria-label="Close modal" data-micromodal-close>
                             <Image className="close-icon" src="/x-circle-fill.svg" width={16} height={16} alt="" unoptimized></Image>
                        </div>
                        <Image className="product-modal-img w-full h-auto" src={imageUrl(productSubImgList[mainImgIndex])} width={800} height={800} alt="商品圖片"></Image>
                    </main>
                </div>
            </div>
        </div>
    </>
}