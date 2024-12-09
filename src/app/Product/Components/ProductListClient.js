'use client'
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard.js";
import PageButtonGroup from "@/components/PageButtonGroup.js";
import { LoadingPageShow, LoadingPageHide } from '@/components/LoadingPage';

export default ({ categoryId }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [lastPage, setLastPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageButtonList, setPageButtonList] = useState([])
    const [categoryData, setCategoryData] = useState({})

    const [dataList, setDataList] = useState([])

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = async () => {
        setIsLoading(true)
        const urlQuery = categoryId === "All" ? `page=${currentPage}` : `category_id=${categoryId}&page=${currentPage}`

        LoadingPageShow()
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/productCategory/getCategoryProduct?${urlQuery}    `)
            .then(res => res.json())
            .then(res => {
                if (res.categoryData) {
                    setCategoryData(res.categoryData)
                }
                if (Array.isArray(res.dataList)) {
                    res.dataList.forEach(data => data.isChecked = false)
                    setDataList(res.dataList)
                }
                if (res.lastPage) {
                    setLastPage(res.lastPage)
                }
                if (res.pageList) {
                    setPageButtonList(res.pageList)
                }
                LoadingPageHide()
                setIsLoading(false)
            })
    }

    return <>
        <div className="main-content-area">
            <div className="custom-container">
                {
                    !isLoading && (
                        <>
                            <div className="section-title my-8">
                                <span>商品列表</span>{
                                    (
                                        categoryId === "All" ? <>
                                            <span className="mx-4">/</span>
                                            <span>全部商品</span>
                                        </> : <>
                                            {
                                                categoryData?.category_name && <>
                                                    <span className="mx-4">/</span>
                                                    <span>{categoryData?.category_name}</span>
                                                </>
                                            }
                                        </>
                                    )
                                }

                            </div>
                            {
                                (Array.isArray(dataList) && dataList.length > 0) ? (
                                    <>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                                            {
                                                Array.isArray(dataList) && dataList.map((product, productIndex) =>
                                                    <ProductCard product={product} key={product.product_id + productIndex} />
                                                )
                                            }
                                        </div>
                                        <div className="flex justify-end">
                                            <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList} />
                                        </div>
                                    </>
                                ) : <p className="text-center mt-16 text-xl">查無符合條件的產品</p>
                            }
                        </>
                    )
                }
            </div>
        </div>
    </>
}