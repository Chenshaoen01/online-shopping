import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">找不到頁面</div>
                <p className="text-center mt-16 text-xl">您要找的頁面不存在。</p>
                <div className="w-full flex justify-center items-center my-8">
                    <Link className="button-md button-dark" href="/">回到首頁</Link>
                </div>
            </div>
        </div>
    </>
}
