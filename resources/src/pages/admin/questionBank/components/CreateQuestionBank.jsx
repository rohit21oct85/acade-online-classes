import React from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../class/hooks/useClassList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import { useState } from 'react';
import useUnitList from '../../units/hooks/useUnitList';
import { getFilteredData } from '../../../../utils/helper';
import useCreateQuestion from '../hooks/useCreateQuestion';
import useSingleQuestion from '../hooks/useSingleQuestion';
import {romanize} from '../../../../utils/helper';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';
import useSubjectChapterList from '../../mappingSubjectChapter/hooks/useSubjectChapterList';

export default function CreateQuestionBank() {
      const params = useParams();
      const history = useHistory();
      const {data:classDatas} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const {data:units, isLoading: unitLoading} = useUnitList();
      const {data:chapters, isLoading: chapterLoading} = useSubjectChapterList();
      const {data:chapter} = useSingleQuestion();
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
      
      const createMutation = useCreateQuestion(formData);

      async function handleSubmit(e){
            e.preventDefault();
            let class_id = params?.class_id
            let subject_id = params?.subject_id
            let unit_id = params?.unit_id
            let chapter_id = params?.chapter_id
      
            let class_name = getFilteredData(classDatas,'_id' ,class_id, 'class_name');
            let subject_name = getFilteredData(subjects,'subject_id' , subject_id, 'subject_name');
            let unit_no = getFilteredData(units,'_id' , unit_id, 'unit_no');
            let unit_name = getFilteredData(units,'_id' , unit_id, 'unit_name');
            let chapter_no = getFilteredData(chapters,'_id' , chapter_id, 'chapter_no');
            let chapter_name = getFilteredData(chapters,'_id' , chapter_id, 'chapter_name');
            
            formData.class_id = class_id
            formData.class_name = class_name
            formData.subject_id = subject_id
            formData.subject_name = subject_name
            formData.unit_id = unit_id
            formData.unit_no = unit_no
            formData.unit_name = unit_name
            formData.chapter_id = chapter_id
            formData.chapter_no = chapter_no
            formData.chapter_name = chapter_name
            formData.qtype = params?.qtype
            formData.atype = params?.atype
            console.log(formData);

            await createMutation.mutate(formData);
            
      }
      return (
            <div>
                  
                  <p className="form-heading">
                  <span className="fa fa-plus-circle mr-2"></span>Add New Question
                  </p>
                  <hr className="mt-1"/>
                  <div className="row">
                  <div className="form-group col-md-4">
                  <select className="form-control"
                  value={params?.class_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/${params?.page_type}/`)  
                        }else{
                              history.push(`/admin/question-bank/${params?.page_type}/${e.target.value}`)  
                        }
                  }}>
                        <option value="_">Classes</option>
                        {classDatas?.map(classess => {
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
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}`)                          
                        }else{
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${e.target.value}`)                          
                        }
                  }} 
                  >
                        <option value="_">{subjectLoading ? 'loading ...':'Subjects'}</option>
                        {subjects?.map( subject => {
                              return(
                                    <option value={subject?.subject_id} key={subject?.subject_id}>{subject?.subject_name}</option>
                              )
                        })}
                  </select>
                  </div>
                  <div className="form-group col-md-4 pl-0">
                  <select className="form-control"
                  value={params?.unit_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}`)                          
                        }else{
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
                        }
                  }} 
                  >
                        <option value="_">{unitLoading ? 'loading ...':'Units'}</option>
                        {units?.map( unit => {
                              return(
                                    <option value={unit?._id} key={unit?._id}>{romanize(unit?.unit_no)}-{unit?.unit_name}</option>
                              )
                        })}
                  </select>
                  </div>
                  <div className="form-group col-md-4">
                  <select className="form-control"
                  value={params?.chapter_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}`)                          
                        }else{
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${e.target.value}`)                          
                        }
                  }} 
                  >
                        <option value="_">{chapterLoading ? 'loading ...':'Chapters'}</option>
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
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}`)                          
                        }else{
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}/${e.target.value}`)                          
                        }
                  }}     
                  > 
                        <option value="_">Ques Type</option>
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
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}/${params?.qtype}`)                          
                        }else{
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}/${params?.qtype}/${e.target.value}`)                          
                        }
                        }}         
                  > <option value="_">Ans Type</option>
                        {answerTypes?.map( (answertype, index) => {
                              return(
                              <option value={answertype?.key} key={index}>{answertype?.value}</option>
                              )
                        })}
                  </select>
                  </div>
                  </div>
            {params?.page_type === 'create' && (
                          
            <form>
                  <div className="form-group">
                  <label>Add Questions and Options </label>
                  <hr className="mt-0 mb-1"/>
                  <div className="pr-2" style={{ height: '350px', overflowY: 'scroll', overflowX: 'hidden'}}>
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

                              onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              setFormData( { ...formData, question: data } );
                              } }
                        />
                  </div>      
                  <div className="row">
                  {options?.map( option => {
                  return(
                        <div className="form-group col-md-6">
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
                              onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              setFormData( { ...formData, [option?.key] : data } );
                              } }
                        />
                  </div>
                  )})}
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
                  <div className="form-group">
                        <label>Solution: </label>
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

                              onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              setFormData( { ...formData, solution: data } );
                              } }
                        />
                  </div> 
                  </div>
                  </div>
                  
                                          
                  <div className="form-group mt-2">
                        <button className="btn btn-sm dark"
                        disabled={createMutation?.isLoading}
                        onClick={handleSubmit}>
                        {(createMutation?.isLoading) 
                        ?
                        <><span className="bi bi-spinner mr-2"></span>
                        Processing...</>
                        :
                        <><span className="bi bi-save mr-2"></span>
                        Save Question</>      
                        }
                              
                        </button>
                  </div>

            </form>  
            )}    
            {params?.page_type === 'upload' && (
                <form>
                  <label>Upload Questions and Options </label>
                  <hr className="mt-1 mb-2"/>
                  <div className="form-group">
                        <label>Choose Question CSV File</label>
                        <input type="file" className="form-control"/>
                  </div>
                  <div className="form-group mt-2">
                        <button className="btn btn-sm dark"
                        onClick={handleSubmit}>
                              <span className="bi bi-upload mr-2"></span>
                              Upload Question
                        </button>
                  </div>
                </form>  
            )}

            </div>
      )
}
