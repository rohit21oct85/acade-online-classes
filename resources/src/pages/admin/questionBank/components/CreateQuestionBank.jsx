import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../../../hooks/classes/useClassList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';

export default function CreateQuestionBank() {
      const params = useParams();
      const history = useHistory();
      const {data} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const questionTypes = [
            {key: 'mcq', value: 'Multiple Choice Question'}
      ]
      const answerTypes = [
            {key: 'msa', value: 'Multiple Select Answer'},
            {key: 'ssa', value: 'Single Select Answer'}
      ]

      return (
            <div>
                  <form>
                        <p className="form-heading">
                        <span className="fa fa-plus-circle mr-2"></span>Add New Question</p>
                        <hr className="mt-1"/>
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.class_id}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/`)  
                              }else{
                                    history.push(`/admin/question-bank/create/${e.target.value}`)  
                              }
                        }}>
                              <option value="_">Select Classes</option>
                              {data?.map(classess => {
                                    return(
                                         <option value={classess?._id} key={classess?._id}>{classess?.class_name} th, Section- {classess?.section} </option>       
                                    )
                              })}
                        </select>
                        </div>
                        
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.subject_id}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/${params?.class_id}`)                          
                              }else{
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${e.target.value}`)                          
                              }
                        }} 
                        >
                              <option value="_">{subjectLoading ? 'loading ...':'Select Subjects'}</option>
                              {subjects?.map( subject => {
                                    return(
                                          <option value={subject?._id} key={subject?._id}>{subject?.subject_name}</option>
                                    )
                              })}
                        </select>
                        </div>
                        
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.qtype}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}`)                          
                              }else{
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
                              }
                        }}     
                        > 
                              <option value="_">Select Question Type</option>
                              {questionTypes?.map( (questiontype, index) => {
                                    return(
                                    <option value={questiontype?.key} key={index}>{questiontype?.value}</option>
                                    )
                              })}
                        </select>
                        </div>
                        <div className="form-group">
                        <select className="form-control"
                         value={params?.atype}
                         onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.qtype}`)                          
                              }else{
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.qtype}/${e.target.value}`)                          
                              }
                         }}         
                        > <option value="_">Select Answer Type</option>
                              {answerTypes?.map( (answertype, index) => {
                                    return(
                                    <option value={answertype?.key} key={index}>{answertype?.value}</option>
                                    )
                              })}
                        </select>
                        </div>


                  </form>  
            </div>
      )
}
