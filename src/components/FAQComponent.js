'use client'

import { useState } from "react"

export default () => {
    useState()
    const questionSourceList = []
    for (let i = 1; i <= 5; i++) {
        questionSourceList.push({
            question_id: "product1",
            question_title: `問題${i}`,
            question_answer: "回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答回答",
            isExpanded: false
        })
    }

    const [questionList, setQuestionList] = useState(questionSourceList)
    function faqCardToggle(toggleIndex) {
        const newQuestionList = [...questionList]
        newQuestionList[toggleIndex].isExpanded = !newQuestionList[toggleIndex].isExpanded
        setQuestionList([...newQuestionList])
    }

    return <>
        <div className="faq-card-list flex flex-col justify-center">
            {
                questionList.map((question, questionIndex) =>
                    <div className="faq-card"  key={questionIndex}>
                        <div className="faq-animal-img"></div>
                        <div className="faq-info"
                             onClick={() => {faqCardToggle(questionIndex)}}>
                            <div className="faq-corner"></div>
                            <div className={question.isExpanded? "faq-question expanded" : "faq-question"}>
                                {question.question_title}
                            </div>
                            {question.isExpanded && <div className="faq-answer">{question.question_answer}</div>}
                        </div>
                    </div>
                )
            }
        </div>
    </>
}