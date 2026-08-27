import Navbar from "@/components/Navbar";
import FAQComponent from "@/components/FAQComponent";
import { serverFetch } from "@/api/server";

export default async function FaqPage() {
    const questionList = await serverFetch('/question/getAll', { cache: "no-cache" })
        .then(res => res.json())

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">問題列表</div>
                {
                    (Array.isArray(questionList) && questionList.length > 0) ? (
                        <FAQComponent questionSourceList={questionList}></FAQComponent>
                    ) : <p className="text-center mt-16 text-xl">尚無常見問答</p>
                }
            </div>
        </div>
    </>
}