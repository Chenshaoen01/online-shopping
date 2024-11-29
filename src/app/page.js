import Navbar from "@/components/Navbar";
import FAQComponent from "@/components/FAQComponent";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCarousel from "@/components/ProductCarousel"
import Link from 'next/link';
export default async function Home() {
  const categoryDataList = [
    {
      category_id: "food",
      category_img: 'http://localhost:3010/cat-tree.jpg',
      category_name: "找飼料",
      category_en_name: "Food",
    },
    {
      category_id: "toy",
      category_img: 'http://localhost:3010/cat-tree.jpg',
      category_name: "找玩具",
      category_en_name: "Toys",
    },
    {
      category_id: "others",
      category_img: 'http://localhost:3010/cat-tree.jpg',
      category_name: "其他好物",
      category_en_name: "Others",
    }
  ]


  const recommendedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getRecommendedProducts`, { cache:"no-cache" }).then(res => res.json())

  const bannerList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banner/getAll`, { cache:"no-cache" })
      .then(res => res.json())
  const questionList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/getTopThree`, { cache:"no-cache" })
      .then(res => res.json())

  return <>
    <Navbar></Navbar>
    <div className="main-content-area">
      {/* Banner 輪播 */}
      <BannerCarousel bannerSourceList={bannerList}></BannerCarousel>
      <div className="custom-container">
        {/* 商品類別連結 */}
        <div className="title-pill mt-12 mb-16">商品類別</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 mb-32 gap-x-4">
          {
            Array.isArray(categoryDataList) && categoryDataList.map(category =>
              <div className="flex justify-center" key={category.category_id}>
                <Link href={`/Product/List/${category.category_id}`} className="category-card">
                  <p className="category-card-title">{category.category_name}</p>
                  <div className="category-card-en font-bold">{category.category_en_name}</div>
                  <img className="category-card-icon my-4" src='/arrow.png'></img>
                  <div className="category-card-img" style={{ backgroundImage: `url('${category.category_img}')` }}></div>
                </Link>
              </div>)
          }
        </div>
        {/* 推薦商品 */}
        <div className="title-pill mb-16">推薦商品</div>
        <ProductCarousel productList={recommendedProducts}></ProductCarousel>
        {/* 常見問題 */}
        <div className="title-pill mb-16">常見問題</div>
        <FAQComponent questionSourceList={questionList}></FAQComponent>
        <Link href="/FAQ" className="mt-4 mx-auto button-dark button-extra-large">其他常見問題</Link>
      </div>
    </div>
  </>;
}
