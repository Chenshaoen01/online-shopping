'use client'
import { useEffect, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard.js";
import PageButtonGroup from "@/components/PageButtonGroup.js";
import { useLoading } from '@/components/LoadingProvider';
import { apiFetch } from '@/api/client';

export default function ProductListClient({ categoryId }) {
    const [isLoading, setIsLoading] = useState(true)
    const [lastPage, setLastPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageButtonList, setPageButtonList] = useState([])
    const [categoryData, setCategoryData] = useState({})

    const [dataList, setDataList] = useState([])
    const [loadError, setLoadError] = useState("")
    const { showLoading, hideLoading } = useLoading()

    const getDataList = useCallback(async () => {
        setIsLoading(true)
        setLoadError("")
        const urlQuery = categoryId === "All" ? `page=${currentPage}` : `category_id=${categoryId}&page=${currentPage}`

        showLoading()
        try {
            const result = await apiFetch(`/productCategory/getCategoryProduct?${urlQuery}`)
            if (result.categoryData) {
                setCategoryData(result.categoryData)
            }
            if (Array.isArray(result.dataList)) {
                setDataList(result.dataList)
            }
            if (result.lastPage) {
                setLastPage(result.lastPage)
            }
            if (result.pageList) {
                setPageButtonList(result.pageList)
            }
        } catch (error) {
            setLoadError("商品資料載入失敗，請稍後再試")
        } finally {
            hideLoading()
            setIsLoading(false)
        }
    }, [categoryId, currentPage, showLoading, hideLoading])

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [getDataList])

    return <>
        <div className="main-content-area">
            <div className="custom-container">
                {isLoading && <p className="text-center mt-16 text-xl">資料載入中</p>}
                {(!isLoading && loadError !== "") && <p className="text-center mt-16 text-xl">{loadError}</p>}
                {
                    (!isLoading && loadError === "") && (
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
                                        <div className="flex justify-center mt-6">
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