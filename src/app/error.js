'use client'
import Link from "next/link";

export default function Error({ reset }) {
    return <div className="main-content-area">
        <div className="custom-container">
            <div className="section-title my-8">發生錯誤</div>
            <p className="text-center mt-16 text-xl">頁面載入時發生問題，請稍後再試。</p>
            <div className="w-full flex justify-center items-center my-8">
                <button type="button" className="button-md button-dark me-4" onClick={() => reset()}>重新載入</button>
                <Link className="button-md button-dark" href="/">回到首頁</Link>
            </div>
        </div>
    </div>
}
