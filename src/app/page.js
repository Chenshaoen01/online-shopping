import Navbar from "@/components/Navbar";
import FAQComponent from "@/components/FAQComponent";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCarousel from "@/components/ProductCarousel"
import Link from 'next/link';
export default function Home() {
  const categoryDataList = [
    {
      category_id: "product1",
      category_img: 'http://localhost:3010/cat-tree.jpg',
      category_name: "找飼料",
      category_en_name: "Food",
    },
    {
      category_id: "product1",
      category_img: 'http://localhost:3010/cat-tree.jpg',
      category_name: "找玩具",
      category_en_name: "Toys",
    },
    {
      category_id: "product1",
      category_img: 'http://localhost:3010/cat-tree.jpg',
      category_name: "其他好物",
      category_en_name: "Others",
    }
  ]

  const productDataList = []
  for (let i = 1; i <= 4; i++) {
    productDataList.push({
      product_id: "product1",
      product_img: "",
      product_name: "商品名稱",
      product_info: "",
      product_price: 1500
    })
  }

  return <>
    <Navbar></Navbar>
    <div className="main-content-area">
      {/* Banner 輪播 */}
      <BannerCarousel></BannerCarousel>
      <div className="custom-container">
        {/* 商品類別連結 */}
        <div className="title-pill mt-12 mb-16">商品類別</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 mb-32 gap-x-4">
          {
            categoryDataList.map(category =>
              <div className="flex justify-center">
                <div className="category-card">
                  <p className="category-card-title">{category.category_name}</p>
                  <div className="category-card-en font-bold">{category.category_en_name}</div>
                  <img className="category-card-icon my-4" src='/arrow.png'></img>
                  <div className="category-card-img" style={{ backgroundImage: `url('${category.category_img}')` }}></div>
                </div>
              </div>)
          }
        </div>
        {/* 推薦商品 */}
        <div className="title-pill mb-16">推薦商品</div>
        <ProductCarousel></ProductCarousel>
        {/* 常見問題 */}
        <div className="title-pill mb-16">常見問題</div>
        <FAQComponent></FAQComponent>
        <Link href="/FAQ" className="mt-4 mx-auto button-dark button-extra-large">其他常見問題</Link>
      </div>
    </div>
  </>;
}
