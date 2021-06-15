import useQuestionList from '../hooks/useQuestionList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../../../context/AuthContext';
import './math.css'
import React, {useState, useContext} from 'react'
import useDeleteQuestion from '../hooks/useDeleteQuestion';
import {romanize} from '../../../../utils/helper';
export default function AllQuestions({update, Delete}) {

      const history = useHistory();
      const {state} = useContext(AuthContext);
      const params = useParams();
      const {data, isLoading} = useQuestionList();
      const deleteMutation = useDeleteQuestion();
      const deleteQuestion = async (id) => {
            await deleteMutation.mutate(id)
      }

    return (
        <>
        <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>All Questions</p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 pr-0 row no-gutter" style={{ height: '460px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {data?.map((q,i) => {
                return(
                    <div className="card question col-md-12 pl-0 pr-0 mr-3 mb-2">
                        <div className="pl-3 pr-3 dark bg-head flex">
                            Question:  {i+1}
                            <span className="ml-2">Unit: {romanize(q?.unit_no)} - {q?.unit_name}</span>
                            <span className="ml-2">Chapter: {q?.chapter_no} - {q?.chapter_name}</span>
                        </div>
                        <div className="pl-3 pr-2 pt-3" dangerouslySetInnerHTML={{ __html: q?.question  }}></div>
                        <div className="pl-3">Answers</div>
                        <div className="row ml-3 pb-3 option">
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3">option A: </div>
                                {(q?.answer === 'option_a') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_a }}/>
                                
                            </div>
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3">option B: </div>
                                
                                {(q?.answer === 'option_b') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_b }}/>
                            </div>
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3">option C: </div>
                                
                                {(q?.answer === 'option_c') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_c }}/>
                            </div>
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3">option D: </div>
                                {(q?.answer === 'option_d') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_d }}/>
                            </div>
                            
                        </div>
                    </div>
                )
            })}
        </div>
    </>
    )
}
