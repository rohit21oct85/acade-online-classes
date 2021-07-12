import React, { useState } from 'react'
import useMockQuestionList from '../hooks/useMockQuestionList'

export default function MockTestQuestionList() {
      const {data:mocktests} = useMockQuestionList();
      return (
            <div className="flex no-gutter" style={{ flexDirection: 'row', flexWrap: 'wrap', height: '500px', overflow: 'hidden scroll'}}>
                 {mocktests?.map((mq,ind) => {
                       return(
                              <div className="card flex col-md-6 p-2 mb-2" style={{ 
                                    cursor: 'pointer', 
                                    flexDirection: 'row', 
                                    flexWrap: 'wrap',
                                    alignItems: 'flex-start',
                                    color: 'white'
                              }}>
                                  <span className="col-md-9 text-dark">Que {ind+1}. &nbsp;{mq.question}</span>
                                  <span className={`col-md-3 ${mq.answer === 'a'? 'bg-success': 'bg-danger'}`}>
                                    Answer: {mq.answer} - {mq.answer === 'a' ? mq?.option_a : mq?.option_b} 
                                  </span>

                                  <hr />
                                  <div className="col-md-12 mt-3">
                                    <button className="dark mr-2">
                                        <span className="fa fa-pencil mr-2"></span>
                                        Edit
                                    </button>
                                    
                                    <button className="dark">
                                        <span className="fa fa-trash mr-2"></span>
                                        Delete
                                    </button>
                                    </div>  
                              </div>
                       )
                 })}
            </div>
      )
}
