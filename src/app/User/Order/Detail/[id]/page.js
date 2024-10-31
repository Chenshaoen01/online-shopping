import Link from "next/link"
import Navbar from "@/components/Navbar";

export default async () => {
    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">我的訂單 / 20241009</div>
                <p><span className="title-md">訂單編號</span>20241009</p>
                <p><span className="title-md">訂單金額</span>$2500</p>
                <p><span className="title-md">訂單建立日期</span>2024/10/09</p>
                <p><span className="title-md">訂單狀態</span>已出貨</p>
                <div className="section-title my-8">訂單明細</div>
                <div className="order-content-list">
                    <div className="order-content-item">
                        <div className="order-content-item-image" style={{backgroundImage: `url('/cat-tree.jpg')`}}></div>
                        <div className="order-content-item-info">
                            <p className="font-bold text-lg mb-1">產品名稱</p>
                            <p><span className="title-md">規格</span>規格1</p>
                            <p><span className="title-md">單價</span>1500</p>
                            <p><span className="title-md">數量</span>3</p>
                            <p><span className="title-md">小計</span>1500</p>
                        </div>
                    </div>
                    <div className="order-content-item">
                        <div className="order-content-item-image" style={{backgroundImage: `url('/cat-tree.jpg')`}}></div>
                        <div className="order-content-item-info">
                            <p className="font-bold text-lg mb-1">產品名稱</p>
                            <p><span className="title-md">規格</span>規格1</p>
                            <p><span className="title-md">單價</span>1500</p>
                            <p><span className="title-md">數量</span>3</p>
                            <p><span className="title-md">小計</span>1500</p>
                        </div>
                    </div>
                    <div className="order-content-item">
                        <div className="order-content-item-image" style={{backgroundImage: `url('/cat-tree.jpg')`}}></div>
                        <div className="order-content-item-info">
                            <p className="font-bold text-lg mb-1">產品名稱</p>
                            <p><span className="title-md">規格</span>規格1</p>
                            <p><span className="title-md">單價</span>1500</p>
                            <p><span className="title-md">數量</span>3</p>
                            <p><span className="title-md">小計</span>1500</p>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <span className="me-2 font-bold text-xl">總計</span>
                        <span className="me-2 font-bold text-xl">NT$ 4500</span>
                    </div>
                </div>
            </div>
        </div>
    </>
}