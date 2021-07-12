import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useDeleteMockQuestion from '../hooks/useDeleteMockQuestion';
import useMockQuestionList from '../hooks/useMockQuestionList'

export default function MockTestQuestionList() {
      const {data:mocktests} = useMockQuestionList();
      const params = useParams();
      const history = useHistory();
      const [formData, setFormData] = useState({});
      const deleteMutation = useDeleteMockQuestion(formData);
      async function handleDelete(id){
            formData['test_id'] = id
            await deleteMutation.mutate(formData);
      }
      return (
            <div className="flex no-gutter" style={{ flexDirection: 'row', flexWrap: 'wrap', height: '500px', overflow: 'hidden scroll'}}>
                 {mocktests !== undefined && Array.from(mocktests)?.map((mq,ind) => {
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
                                    <button className="dark mr-2"
                                    onClick={(e) => history.push(`/admin/mock-test/create/mock-test-question/${params?.question_for}/${mq?._id}`)}>
                                        <span className="fa fa-pencil mr-2"></span>
                                        Edit
                                    </button>
                                    
                                    <button className="dark"
                                    disabled={deleteMutation.isLoading}
                                    onClick={(e) => handleDelete(mq?._id)}
                                    >
                                          {deleteMutation.isLoading ? (
                                                <>
                                                <span className="fa fa-spinner mr-2"></span>
                                                processing...
                                                </>
                                          ) : (
                                                <>
                                                <span className="fa fa-trash mr-2"></span>
                                                Delete
                                                </>
                                          )}
                                        
                                    </button>
                                    </div>  
                              </div>
                       )
                 })}
            </div>
      )
}
