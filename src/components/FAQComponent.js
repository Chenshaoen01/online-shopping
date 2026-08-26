'use client'

import { useState, useCallback} from "react"

export default ({questionSourceList}) => {
    const [expandedIdList, setExpandedIdList] = useState([])

    // 展開/收起問答內容
    const faqCardToggle = useCallback((questionId) => {
        setExpandedIdList(previousList => previousList.includes(questionId)
            ? previousList.filter(expandedId => expandedId !== questionId)
            : [...previousList, questionId])
    }, [])

    return <>
        <div className="faq-card-list flex flex-col justify-center">
            {
                questionSourceList.map(question => {
                    const isExpanded = expandedIdList.includes(question.question_id)

                    return <div className="faq-card" key={question.question_id}>
                        <div className="faq-animal-img"></div>
                        <div className="faq-info"
                             onClick={() => {faqCardToggle(question.question_id)}}>
                            <div className="faq-corner"></div>
                            <div className={isExpanded? "faq-question expanded" : "faq-question"}>
                                {question.question_title}
                            </div>
                            {isExpanded && <div className="faq-answer">{question.question_description}</div>}
                        </div>
                    </div>
                })
            }
        </div>
    </>
}
