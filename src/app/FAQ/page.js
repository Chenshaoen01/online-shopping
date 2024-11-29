import Navbar from "@/components/Navbar";
import FAQComponent from "@/components/FAQComponent";

export default async () => {
    const questionList = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/getAll`, { cache:"no-cache" })
                               .then(res => res.json())

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">問題列表</div>
                <FAQComponent questionSourceList={questionList}></FAQComponent>
            </div>
        </div>
    </>
}