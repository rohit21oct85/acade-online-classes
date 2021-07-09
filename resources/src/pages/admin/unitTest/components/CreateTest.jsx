import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getFilteredData } from '../../../../utils/helper';
import useCreateUnitTest from '../hooks/useCreateUnitTest';
import useSingleUnitTest from '../hooks/useSingleUnitTest';
import useClassList from '../../class/hooks/useClassList';
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import useUnitList from '../../units/hooks/useUnitList';
import useQuestionList from '../../questionBank/hooks/useQuestionList';

import * as helper from '../../../../utils/helper'
import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSubjectChapterList from '../../mappingSubjectChapter/hooks/useSubjectChapterList';

export default function CreateTest() {
      const params = useParams();
      const history = useHistory();
      const { addToast } = useToasts();
      const {data:sClassess} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const {data:units, isLoading: unitLoading} = useUnitList();
      const {data:chapters, isLoading: chapterLoading} = useSubjectChapterList();
      const [questions, setQuestions] = useState([])
      const {data:questionDB, isLoading: qLoading} = useQuestionList();
      
      useEffect(setDBQuestions,[params?.unit_id, params?.chapter_id]);
      function setDBQuestions(){
            if(params?.class_id && params?.subject_id && params?.unit_id && params?.chapter_id){
                  setQuestions(questionDB?.filter(ques => (ques?.chapter_id === params?.chapter_id)))
            }else if(params?.class_id && params?.subject_id && params?.unit_id){
                  setQuestions(questionDB)
            }
      }
      const {data:unitTest} = useSingleUnitTest();
      
      const [formData, setFormData] = useState({});
      const [startDate, setStartDate] = useState(new Date());
      const isWeekday = (date) => {
            const day = date.getDay(date);
            return day !== 0;
          };
      const createMutation = useCreateUnitTest(formData);

      const [selectedQuestions, setSelectedQuestions] = useState([]);
      const [clicked, setClicked] = useState(false);
      const [subject, setSubject] = useState([]);


      useEffect(setSelected,[clicked]);
      async function setSelected(){
            let parseData = await JSON.parse(localStorage.getItem('selectedQuestions'))
            if(parseData?.length > 0){
                  if(selectedQuestions?.length === 0){
                        setSelectedQuestions(JSON.parse(localStorage.getItem('selectedQuestions')));
                  }else{
                        localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
                        setSelectedQuestions(selectedQuestions);
                  }
            }else{
                  localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
                  setSelectedQuestions(selectedQuestions);
            }
      
      }

      async function handleSubmit(e){
            e.preventDefault();
            let class_id = params?.class_id
            let subject_id = params?.subject_id
            let unit_id = params?.unit_id
            let chapter_id = params?.chapter_id
            let test_type = params?.test_type;
            

            if(!test_type){
                  addToast('please select test type', { appearance: 'error', autoDismiss: true });
            }
            else if(!class_id){
                  addToast('please select class', { appearance: 'error', autoDismiss: true });
            }
            else if(!subject_id){
                  addToast('please select subject', { appearance: 'error', autoDismiss: true });
            }
            else if(!unit_id){
                  addToast('please select unit', { appearance: 'error', autoDismiss: true });
            }
            else if(!chapter_id){
                  addToast('please select chapters', { appearance: 'error', autoDismiss: true });
            }
            else if(!localStorage.getItem('test_duration')){
                  addToast('please enter test duration', { appearance: 'error', autoDismiss: true });
            }
            
            else if(selectedQuestions?.length === 0){
                  addToast('please select questions', { appearance: 'error', autoDismiss: true });
            }

            else{
                  let assign_class_id = localStorage.getItem('assignClass')
                  let test_name = localStorage.getItem('test_name')
                  let test_duration = localStorage.getItem('test_duration')

                  let class_name = getFilteredData(sClassess,'_id' ,class_id, 'class_name');
                  let assign_class_name = getFilteredData(sClassess,'_id' ,assign_class_id, 'class_name');
                  let subject_name = getFilteredData(subjects,'subject_id' , subject_id, 'subject_name');
                  let unit_name = getFilteredData(units,'_id' , unit_id, 'unit_name');

                  let selectedQuestionsId = selectedQuestions?.map((i) => {
                        return {
                              question_id: i.question_id,
                              unit_id: i.unit_id,
                              unit_name: i.unit_name,
                              chapter_id: i.chapter_id,
                              chapter_name: i.chapter_name,
                        }
                  });
                  formData['test_type'] = test_type
                  formData['test_subjects'] = subject
                  formData['class_id'] = class_id
                  formData['class_name'] = class_name
                  formData['subject_id'] = subject_id
                  formData['subject_name'] = subject_name
                  formData['unit_id'] = unit_id
                  formData['unit_name'] = unit_name
                  formData['test_slug'] = utils.MakeSlug(formData.test_name)
                  formData['test_date'] = startDate
                  formData['total_question'] = selectedQuestions?.length
                  formData['test_question'] = selectedQuestionsId
                  formData['assign_class_id'] = assign_class_id
                  formData['assign_class_name'] = assign_class_name
                  formData['test_name'] = test_name
                  formData['test_duration'] = test_duration
                  
                  // console.log(formData); return;
                  
                  await createMutation.mutate(formData);

                  localStorage.removeItem('selectedQuestions')
                  localStorage.removeItem('assignClass')
                  localStorage.removeItem('test_name')
                  localStorage.removeItem('test_duration')
                  setSelectedQuestions([]);
            }

            
      }
      async function handleSelectQuestion(id){
            setClicked(true)
            document.getElementById(id).style.display = 'none';
            const filtered = await questions?.filter(q => q._id === id);
            setSelectedQuestions((selectedQuestions) => [...selectedQuestions, {
                  question_id: filtered[0]._id,
                  unit_id: filtered[0].unit_id,
                  unit_name: filtered[0].unit_name,
                  chapter_id: filtered[0].chapter_id,
                  chapter_name: filtered[0].chapter_name,
            }]);
            if(selectedQuestions?.length > 0){
                  localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
                  setClicked(false)
            }else{
                  localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
                  setClicked(false)
            }
      }
      useEffect(() => {
            const script = document.createElement("script");
            script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
            script.async = true;
            document.body.appendChild(script);
      },[])
      let subject_name;
      if(params?.subject_id){
            subject_name = getFilteredData(subjects,'subject_id' , params?.subject_id, 'subject_name');
      }else{
            subject_name = '';
      }
      return (
            <div>
                  
                  <p className="form-heading">
                  <span className="fa fa-plus-circle mr-2"></span>Add New Test
                  </p>
                  <hr className="mt-1"/>
            
            {params?.page_type === 'create' && (
                          
            <form>
                  
                  <div className="row">
                  <div className="col-md-3">
                        <select className="form-control"
                        value={params?.test_type}
                        onChange={e => {
                              history.push(`/admin/manage-unit-test/${params?.page_type}/${e.target.value}`)
                        }}>
                              <option value="">Test Type</option>
                              <option value="combine-test">Combined Test</option>
                              <option value="single-test">Single Test</option>
                        </select>
                  </div>
                  {params?.test_type === 'combine-test' && (
                  <div className="col-md-3 pl-0">
                        <select className="form-control"
                        value={localStorage.getItem('assignClass')}
                        onChange={e => {
                              setFormData({...formData, ['assign_to']: e.target.value})
                              localStorage.setItem('assignClass', e.target.value)
                        }}>
                              <option value="_">Select Class</option>
                              {sClassess?.map(sclass => {
                                    return(
                                          <option value={sclass?._id} key={sclass?._id}>{sclass?.class_name} Th</option>
                                    );
                              })}
                        </select>
                  </div>
                  )}
                  
                  <div className="col-md-3 form-group">
                        <input type="text" name="test_name" 
                        value={localStorage.getItem('test_name')} 
                        onChange={ e => {
                              setFormData({...formData, test_name: e.target.value})
                              localStorage.setItem('test_name', e.target.value)
                        }}
                        className="form-control" placeholder="test name"/>
                        
                  </div>
                  <div className="col-md-2 pl-0 pr-0">
                              <input type="text" className="form-control"
                              maxLength="2"
                              value={localStorage.getItem('test_duration')} 
                              onChange={ e => {
                                    if(!isNaN(e.target.value)){
                                          setFormData({...formData, test_duration: e.target.value})
                                          localStorage.setItem('test_duration', e.target.value)
                                    }else{
                                          addToast('please enter test duration in numbers', { appearance: 'error', autoDismiss: true });
                                    }
                              }}
                              placeholder="Enter Test Duration in Minute"/>
                  </div>
                               
                  </div> 
                  
                  <div className="flex">
                        <div className="col-md-3 pl-0">
                              <select className="form-control"
                              value={params?.class_id}
                              onChange={e => {
                                    if(e.target.value === '_'){
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/`)  
                                    }else{
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${e.target.value}`)  
                                    }
                              }}>
                                    <option value="_">Select Class</option>
                                    {sClassess?.map(sclass => {
                                          return(
                                                <option value={sclass?._id} key={sclass?._id}>{sclass?.class_name} Th</option>
                                          );
                                    })}
                              </select>
                        </div>
                        <div className="col-md-3 pl-0">
                              <select className="form-control"
                              value={params?.subject_id}
                              onChange={e => {

                                    if(e.target.value === '_'){
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}`)                          
                                    }else{
                                          const subject_name = e.target.options[e.target.selectedIndex].dataset.subject_name
                                          let chk = subject.some(sub => sub?.subject_id === e.target.value);
                                          if(!chk){
                                                setSubject((subject) => [...subject, {
                                                      subject_id: e.target.value,
                                                      subject_name: subject_name
                                                }])
                                          }
                                          if(params?.test_type === 'combine-test'){
                                                history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${e.target.value}`)                          
                                          }else{
                                                if(params?.subject_id){
                                                      addToast('if you want to create combine test then please change test type', { appearance: 'error', autoDismiss: true, duration: '20s' });
                                                      history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${params?.subject_id}`)                          
                                                }else{
                                                      history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${e.target.value}`)                          
                                                      
                                                }
                                          }
                                    }
                              }}>
                                    <option value="_">{subjectLoading ? 'Loading...':'Select Subjects'}</option>
                                    {subjects?.map(subject => {
                                          return(
                                                <option value={subject?.subject_id} data-subject_name={subject.subject_name} key={subject?.subject_id}>{subject?.subject_name}</option>
                                          );
                                    })}
                              </select>
                        </div>
                        <div className="form-group col-md-3 pl-0 pr-0">
                        <select className="form-control"
                        value={params?.unit_id}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${params?.subject_id}`)                          
                              }else{
                                    history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
                              }
                        }} 
                        >
                              <option value="_">{unitLoading ? 'loading ...':'Units'}</option>
                              {units?.map( unit => {
                                    return(
                                          <option value={unit?._id} key={unit?._id}>{helper.romanize(unit?.unit_no)}-{unit?.unit_name}</option>
                                    )
                              })}
                        </select>
                  </div>
                  <div className="form-group col-md-3">
                  <select className="form-control"
                  value={params?.chapter_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}`)                          
                        }else{
                              history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.test_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${e.target.value}`)                          
                        }
                  }} 
                  >
                        <option value="_">{chapterLoading ? 'loading ...':'Chapters'}</option>
                        {!qLoading && chapters?.map( chapter => {
                              return(
                                    <option value={chapter?._id} key={chapter?._id}>{chapter?.chapter_no}-{chapter?.chapter_name}</option>
                              )
                        })}
                  </select>
                  </div>

                  </div>
                  

                  
                  <div className="col-md-12 pl-0">
                  <div className="text-success mb-0">
                        <span className="badge-danger pl-2 pr-2">All Questions: {questions?.length??0}</span>
                        <span className="badge-success ml-3 pl-2 pr-2">Selected Questions: {selectedQuestions?.length}</span>
                        <span className="badge-success ml-3 pl-2 pr-2">Subject: {subject_name}</span>

                  </div>
                  <p>Select Questions: </p>
                  <div className="table table-bordered">
                        <div className="flex"> 
                              <div className="col-md-6 pl-0">Unit/Chapter Name</div>
                              <div className="col-md-6 pl-0">Question</div>
                        </div>
                  </div>
                  <div  className="pr-2" style={{ height: '300px', overflowY: 'scroll'}}>
                        {qLoading && (<><span className="fa fa-spinner"></span>Loading...</>)}      
                        {!qLoading && questions?.map((q,i) => {
                              
                              let sel = helper.checkExists(selectedQuestions,'_id',q?._id);
                              if(!sel)
                              return(
                              <div 
                              className={`card question col-md-12 pl-2 pr-2 mb-1`}
                              key={q?._id}
                              id={`${q?._id}`}
                              onClick={handleSelectQuestion.bind(this, q?._id)}
                              >
                                    <div className="flex">
                                          <div className="col-md-6 pl-0">{q?.unit_no}.{q?.unit_name}/{q?.chapter_no}.{q?.chapter_name} </div>
                                          <div className="question col-md-6 pl-0" dangerouslySetInnerHTML={{ __html: q?.question  }} />
                                    </div>
                              </div>
                              )
                        })}
                  </div>
                  
                  </div>


                  <div className="form-group mt-3">
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
                        <button 
                        type="button"
                        className="btn btn-sm bg-danger br-5 text-white ml-2"
                        onClick={e => {
                              e.preventDefault();
                              history.push(`/admin/manage-unit-test`)
                  }}>
                        <span className="fa fa-times"></span>
                  </button>
                  </div>
                  </form>  
            )}    
            
            </div>
      )
}
