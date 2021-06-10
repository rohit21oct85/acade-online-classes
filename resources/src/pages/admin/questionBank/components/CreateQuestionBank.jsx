import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../class/hooks/useClassList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';
import { useState } from 'react';
import useUnitList from '../../units/hooks/useUnitList';
import useChapterList from '../../chapter/hooks/useChapterList';

export default function CreateQuestionBank() {
      const params = useParams();
      const history = useHistory();
      const {data} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const {data:units, isLoading: unitLoading} = useUnitList();
      const {data:chapters, isLoading: chapterLoading} = useChapterList();

      const questionTypes = [
            {key: 'mcq', value: 'Multiple Choice'}
      ]
      const options = [
            {key: 'option_a', value: 'Option A'},
            {key: 'option_b', value: 'Option B'},
            {key: 'option_c', value: 'Option C'},
            {key: 'option_d', value: 'Option D'},
      ]

      const answerTypes = [
            {key: 'cma', value: 'Choose Multiple'},
            {key: 'csa', value: 'Choose Single'}
      ]

      const [formData, setFormData] = useState({});
      function handleSubmit(e){
            e.preventDefault();
            formData.class = params?.class_id
            formData.subject = params?.subject_id
            formData.qtype = params?.qtype
            formData.atype = params?.atype
            console.log(formData)
      }
      return (
            <div>
                  <form>
                        <p className="form-heading">
                        <span className="fa fa-plus-circle mr-2"></span>Add New Question</p>
                        <hr className="mt-1"/>
                        <div className="row">
                        <div className="form-group col-md-4">
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
                                         <option value={classess?._id} key={classess?._id}>{classess?.class_name} th </option>       
                                    )
                              })}
                        </select>
                        </div>
                        <div className="form-group col-md-4 pl-0">
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
                        <div className="form-group col-md-4 pl-0">
                        <select className="form-control"
                        value={params?.unit_id}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}`)                          
                              }else{
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
                              }
                        }} 
                        >
                              <option value="_">{unitLoading ? 'loading ...':'Select Units'}</option>
                              {units?.map( unit => {
                                    return(
                                          <option value={unit?._id} key={unit?._id}>{unit?.unit_no}-{unit?.unit_name}</option>
                                    )
                              })}
                        </select>
                        </div>
                        <div className="form-group col-md-4">
                        <select className="form-control"
                        value={params?.chapter_id}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.unit_id}`)                          
                              }else{
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${e.target.value}`)                          
                              }
                        }} 
                        >
                              <option value="_">{chapterLoading ? 'loading ...':'Select Chapters'}</option>
                              {chapters?.map( chapter => {
                                    return(
                                          <option value={chapter?._id} key={chapter?._id}>{chapter?.chapter_no}-{chapter?.chapter_name}</option>
                                    )
                              })}
                        </select>
                        </div>

                        <div className="form-group col-md-4 pl-0">
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
                              <option value="_">Select Ques Type</option>
                              {questionTypes?.map( (questiontype, index) => {
                                    return(
                                    <option value={questiontype?.key} key={index}>{questiontype?.value}</option>
                                    )
                              })}
                        </select>
                        </div>
                        <div className="form-group col-md-4 pl-0">
                        <select className="form-control"
                         value={params?.atype}
                         onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.qtype}`)                          
                              }else{
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.qtype}/${e.target.value}`)                          
                              }
                         }}         
                        > <option value="_">Select Ans Type</option>
                              {answerTypes?.map( (answertype, index) => {
                                    return(
                                    <option value={answertype?.key} key={index}>{answertype?.value}</option>
                                    )
                              })}
                        </select>
                        </div>
                        </div>
                        
                        <div className="form-group">
                        <label>Question and Options </label>
                        <hr className="mt-0 mb-1"/>
                        <div className="pr-2" style={{ height: '300px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="form-group">
                              <label>Question: </label>
                              <CKEditor
                                editor={ ClassicEditor }
                                config={{
                                    toolbar: {
                                        items: [
                                            'MathType', 'ChemType','heading', 
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'imageUpload',
                                            'mediaEmbed',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                }}
                                data={data && data.question}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFormData( { ...formData, question: data } );
                                } }
                            />
                        </div>      
                        <div className="row">
                        {options?.map( option => {
                        return(
                              <div className="form-group col-md-6 pl-0">
                              <label>{option?.value}: </label>
                              <CKEditor
                                editor={ ClassicEditor }
                                config={{
                                    toolbar: {
                                        items: [
                                            'MathType', 'ChemType','heading', 
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'imageUpload',
                                            'mediaEmbed',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                }}
                                data={data && data.question}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFormData( { ...formData, [option?.key] : data } );
                                } }
                            />
                        </div>
                        )})}
                        </div>
                        </div>
                        </div>
                        <div className="form-group">
                                <select className="form-control"
                                onChange={e => {
                                    setFormData( { ...formData, answer : e.target.value } );
                                }}
                                >
                                      <option>Correct Answer</option>
                                      {options?.map( option => {
                                          return(
                                          <option value={option?.key}>{option?.value}</option>
                                          )})}
                                </select>
                        </div>
                        <div className="form-group mt-2">
                              <button className="btn btn-sm dark"
                              onClick={handleSubmit}>
                                    <span className="bi bi-save mr-2"></span>
                                    Save Question
                              </button>
                        </div> 
                  </form>  
            </div>
      )
}
