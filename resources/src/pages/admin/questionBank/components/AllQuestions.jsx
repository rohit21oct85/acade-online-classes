import useQuestionList from '../hooks/useQuestionList';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import './math.css'
import React, {useState, useContext, useEffect} from 'react'
import useDeleteQuestion from '../hooks/useDeleteQuestion';


export default function AllQuestions({update, Delete}) {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const params = useParams();
    const [formData, setFormData]    = useState({});
    const {data, isLoading} = useQuestionList();
    const deleteMutation = useDeleteQuestion(formData);
    const handleDelteQuestion = async (id) => {
        formData['qbank_id'] = id
        await deleteMutation.mutate(formData)
    }
    // script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
    useEffect(() => {
        const script = document.createElement("script");
        script.id = 'editor';
        script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
        script.async = true;
        document.body.appendChild(script);
    });

    let optionsDocx = [{key: 0,value: " A"},{key: 1,value: " B"},{key: 3,value: " C"},{key: 4,value: " D"}];
    
    return (
        <>
        <p className="form-heading">
        <span className="fa fa-plus-circle mr-2"></span>All Questions
        <span className="pull-right" style={{
            fontSize: '14px',
            marginRight: '20px',
            marginTop: '5px',
            fontweight: 'bold'

        }}>
            <span>{data && data[0]?.unit_name} </span>- <span>{data && data[0]?.chapter_name}</span>
        </span>
        </p>
        <hr className="mt-1"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 pr-0 row no-gutter" style={{ height: '460px', overflowY: 'scroll', overflowX: 'hidden'}}>
            {params?.chapter_id && data?.map((q,i) => {
                return(
                    <div className="card question col-md-12 pl-0 pr-0 mr-3 mb-2">
                        
                        <div className="pl-2 pr-2 dark bg-head flex">
                            QNo:  {i+1}
                            <span className="ml-2">QId: {q?._id}</span>
                            {update && (
                                <button className="dark bg-success"
                                onClick={e => {
                                    window.location.href = `/admin/question-bank/update/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}/${q?._id}`
                                    // history.push(`/admin/question-bank/update/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}/${q?._id}`)
                                }}>
                                   <span className="bi bi-pencil"></span></button>
                            )}
                            
                            {Delete && (
                                <button className="dark bg-danger"
                                onClick={handleDelteQuestion.bind(this, q?._id)}>
                                   <span className="bi bi-trash"></span></button>
                            )}

                            
                        </div>
                        <div className="question pl-3 pr-2 pt-3" dangerouslySetInnerHTML={{ __html: q?.question  }}></div>
                        
                        <div className="pl-3">Answers</div>
                        <div className="row ml-3 pb-3 option">
                            {q?.extension === 'docx' && optionsDocx?.map((option, index) => {
                                return(
                                    <div className="row col-md-6 pr-0">
                                        <div className="pl-3 pr-3"> {option.value}: </div>
                                        {(q?.answer === option.value) ? 
                                            <span className="bi bi-check-circle-fill text-success"></span>: 
                                            <span className="bi bi-x-circle-fill text-danger ml-1"></span>
                                        }
                                        <div className="pl-3 pr-3"  dangerouslySetInnerHTML={{ __html: q?.options[index] }}/>
                                        
                                    </div>
                                )
                            })}
                            {q?.extension !== 'docx' && (
                            <>    
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
                            </>
                            )}
                        </div>
                        
                    </div>
                )
            })}
        </div>
    </>
    )
}
