'use client'
import { useEffect, useState, useCallback } from "react"
import MicroModal from 'micromodal';

export default ({ productSubImgList }) => {
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
                style={{ backgroundImage: (productSubImgList[mainImgIndex] === "" || productSubImgList[mainImgIndex] === null || productSubImgList[mainImgIndex] === undefined) ? `url('/no-image.png')` : `url('${process.env.NEXT_PUBLIC_FILE_URL}/${productSubImgList[mainImgIndex]}')` }}
                data-fancybox>
            </div>
            {
                (Array.isArray(productSubImgList) && productSubImgList.length > 0) && <div className="product-sub-img-area-container mt-4">
                    <button className="product-sub-img-switch-button product-sub-img-switch-button-prev" type="button"
                        onClick={() => { subImgOnclick('prev') }}>
                        <img className="product-sub-img-switch-icon" src="/angle-left.svg"></img>
                    </button>
                    <button className="product-sub-img-switch-button  product-sub-img-switch-button-next" type="button"
                        onClick={() => { subImgOnclick('next') }}>
                        <img className="product-sub-img-switch-icon" src="/angle-right.svg"></img>
                    </button>
                    <div className="product-sub-img-area">
                        {
                            productSubImgList.map((subImg, subImgIndex) =>
                                <div className={subImgClassName(subImgIndex)} key={subImgIndex}
                                    style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_FILE_URL}/${subImg}')` }}
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
                    <main className="modal__content" id="modal-1-content">
                        <div className="flex modal__close-area">
                            <button className="modal__close" aria-label="Close modal" data-micromodal-close>X</button>
                        </div>
                        <img className="product-modal-img" src={`${process.env.NEXT_PUBLIC_API_URL}/images/product/${productSubImgList[mainImgIndex]}`}></img>
                    </main>
                </div>
            </div>
        </div>
    </>
}