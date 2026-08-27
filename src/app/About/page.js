import Navbar from "@/components/Navbar";
import { serverFetch } from "@/api/server";

export const metadata = {
    title: "關於我們",
    description: "認識毛孩物坊。"
};

export default async function AboutPage() {
    const aboutContent = await serverFetch('/param/about', {cache: "no-cache"})
    .then(res => res.json())
    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">關於我們</div>
                <div className="about-us-content">{aboutContent?.param_content}</div>
            </div>
        </div>
    </>
}