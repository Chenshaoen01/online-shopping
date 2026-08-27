import { serverFetch } from "@/api/server"
import { SITE_URL } from "@/siteConfig"

const fetchProductPage = (page) => serverFetch(`/productCategory/getCategoryProduct?page=${page}`, { cache: "no-cache" })
    .then(res => res.ok ? res.json() : { dataList: [], lastPage: 0 })

// 商品列表一次只回傳一頁，先取第一頁得知總頁數，再把其餘頁數一起取回
const getProductIdList = async () => {
    const firstPage = await fetchProductPage(1)
    const restPageNumberList = []
    for (let pageNumber = 2; pageNumber <= firstPage.lastPage; pageNumber++) {
        restPageNumberList.push(pageNumber)
    }

    const restPageList = await Promise.all(restPageNumberList.map(fetchProductPage))
    const allDataList = [firstPage, ...restPageList].flatMap(page => page.dataList ?? [])

    return allDataList.map(product => product.product_id)
}

const getCategoryIdList = async () => {
    const categoryList = await serverFetch('/productCategory/getAll', { cache: "no-cache" })
        .then(res => res.ok ? res.json() : [])

    return Array.isArray(categoryList) ? categoryList.map(category => category.category_id) : []
}

export default async function sitemap() {
    const [productIdList, categoryIdList] = await Promise.all([getProductIdList(), getCategoryIdList()])

    return [
        { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
        { url: `${SITE_URL}/About`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/FAQ`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/Product/List/All`, changeFrequency: 'daily', priority: 0.8 },
        ...categoryIdList.map(categoryId => ({
            url: `${SITE_URL}/Product/List/${categoryId}`,
            changeFrequency: 'daily',
            priority: 0.8
        })),
        ...productIdList.map(productId => ({
            url: `${SITE_URL}/Product/Detail/${productId}`,
            changeFrequency: 'weekly',
            priority: 0.6
        }))
    ]
}
