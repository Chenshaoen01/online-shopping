'use client'

import { useState, useCallback} from "react"

export default ({questionSourceList}) => {
    const [questionList, setQuestionList] = useState(questionSourceList)

    // 展開/收起問答內容
    const faqCardToggle = useCallback((toggleIndex) => {
        const newQuestionList = [...questionList]
        newQuestionList[toggleIndex].isExpanded = !newQuestionList[toggleIndex].isExpanded
        setQuestionList([...newQuestionList])
    }, [questionList])

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
                            {question.isExpanded && <div className="faq-answer">{question.question_description}</div>}
                        </div>
                    </div>
                )
            }
        </div>
    </>
}