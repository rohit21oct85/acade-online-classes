import useQuestionList from '../hooks/useQuestionList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import './math.css'
import React, {useState, useContext} from 'react'
import useDeleteQuestion from '../hooks/useDeleteQuestion';


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
        <span className="fa fa-plus-circle mr-2"></span>All Questions
        <span className="pull-right">
            <span>{data && data[0]?.unit_name} </span>- <span>{data && data[0]?.chapter_name}</span>
        </span>
        </p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 pr-0 row no-gutter" style={{ height: '460px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {data?.map((q,i) => {
                return(
                    <div className="card question col-md-12 pl-0 pr-0 mr-3 mb-2">
                        
                        <div className="pl-2 pr-2 dark bg-head flex">
                            Question No:  {i+1}
                            <span className="ml-2">QId: {q?._id}</span>
                            {update && (
                                <button className="dark bg-success"
                                onClick={e => {
                                    history.push(`/admin/question-bank/update/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}/${q?._id}`)
                                }}>
                                   <span className="bi bi-pencil"></span></button>
                            )}
                            
                        </div>
                        <div className="col-md-12 pl-0 mt-2 mb-2">
                            
                        </div>
                        <div className="pl-3 pr-2 pt-3" dangerouslySetInnerHTML={{ __html: q?.question  }}></div>
                        
                        <div className="pl-3">Answers</div>
                        <div className="row ml-3 pb-3 option">
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3"> A: </div>
                                {(q?.answer === 'option_a') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_a }}/>
                                
                            </div>
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3"> B: </div>
                                
                                {(q?.answer === 'option_b') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_b }}/>
                            </div>
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3"> C: </div>
                                
                                {(q?.answer === 'option_c') ? 
                                    <span className="bi bi-check-circle-fill text-success"></span>: 
                                    <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                }
                                <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.option_c }}/>
                            </div>
                            <div className="row col-md-6 pr-0">
                                <div className="pl-3 pr-3"> D: </div>
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
