'use client'
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard.js";
import PageButtonGroup from "../components/PageButtonGroup.js";

export default ({ categoryId }) => {
    const [lastPage, setLastPage] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageButtonList, setPageButtonList] = useState([])

    const [dataList, setDataList] = useState([])

    // 取得資料列表
    useEffect(() => {
        getDataList()
    }, [currentPage])

    const getDataList = async () => {
        const urlQuery = categoryId === "All" ? `page=${currentPage}` : `category_id=${categoryId}&page=${currentPage}`
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/productCategory/getCategoryProduct?${urlQuery}    `)
            .then(res => res.json())
            .then(res => {
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
            })
    }

    return <>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">商品列表</div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                    {
                        Array.isArray(dataList) && dataList.map((product, productIndex) =>
                            <ProductCard product={product}  key={product.product_id + productIndex}/>
                        )
                    }
                </div>
                <div className="flex justify-end">
                    <PageButtonGroup lastPage={lastPage} pageButtonList={pageButtonList} currentPage={currentPage} setCurrentPage={setCurrentPage} getDataList={getDataList} />
                </div>
            </div>
        </div>
    </>
}