import useQuestionList from '../hooks/useQuestionList';
import useSchoolLists from '../../../../hooks/schools/useSchoolLists';
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
        <div className="col-md-12 pr-0 row no-gutter data-container-category">
            {data?.map((q,i) => {
                return(
                    <div className="card question col-md-12 pl-0 pr-0 mr-1 mb-2">
                        <div className="pl-3 pr-3 dark bg-head flex">
                            Question:  {i+1}
                            <span className="ml-2">Unit: {romanize(q?.unit_no)} - {q?.unit_name}</span>
                            <span className="ml-2">Chapter: {q?.chapter_no} - {q?.chapter_name}</span>
                        </div>
                        <div className="pl-2 pr-2 pt-3" dangerouslySetInnerHTML={{ __html: q?.question  }}></div>
                        <div className="pl-2">Answers</div>
                        <div className="row pl-2 pr-2 pb-3 option">
                            <div className="col-md-3 flex">
                                option A: 
                                <span dangerouslySetInnerHTML={{ __html: q?.option_a }}/>
                                {(q?.answer === 'option_a') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                            </div>
                            <div className="col-md-3 flex">
                                
                                option B: 
                                
                                <span dangerouslySetInnerHTML={{ __html: q?.option_b }}/>
                                {(q?.answer === 'option_b') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger"></span>
                                }
                            </div>
                        
                            <div className="col-md-3 flex">
                                option C: 
                                <span dangerouslySetInnerHTML={{ __html: q?.option_c }}/>
                                {(q?.answer === 'option_c') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger"></span>
                                }
                            </div>
                            <div className="col-md-3 flex">
                                option D: 
                                <span dangerouslySetInnerHTML={{ __html: q?.option_d }}/>
                                {(q?.answer === 'option_d') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger"></span>
                                }
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </>
    )
}
