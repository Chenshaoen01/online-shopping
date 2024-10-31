import Navbar from "@/components/Navbar";
import FAQComponent from "@/components/FAQComponent";

export default async () => {
    const questionList = []
    for (let i = 1; i <= 5; i++) {
        questionList.push({
            question_id: "product1",
            question_title: "問題1",
            question_answer: "回答1",
        })
    }

    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">問題列表</div>
                <FAQComponent></FAQComponent>
            </div>
        </div>
    </>
}