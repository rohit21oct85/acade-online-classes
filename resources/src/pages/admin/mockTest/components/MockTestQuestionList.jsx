import React, { useState } from 'react'
import useMockQuestionList from '../hooks/useMockQuestionList'

export default function MockTestQuestionList() {
      const {data:mocktests} = useMockQuestionList();
      return (
            <div>
                 {mocktests?.map((mq,ind) => {
                       return(
                              <div className="card flex p-2 mb-2" style={{ cursor: 'pointer'}}>
                                  <div className="col-md-8">Question {ind+1}. &nbsp;    {mq.question}</div>
                                  <div className="col-md-4">
                                    Answer: {mq.answer}
                                  </div>
                              </div>
                       )
                 })}
            </div>
      )
}
