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
import useSubjectChapterList from '../../mappingSubjectChapter/hooks/useSubjectChapterList';
import { json } from 'body-parser';

export default function CreateTest() {
      const params = useParams();
      const history = useHistory();

      const {data:sClassess} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const {data:units, isLoading: unitLoading} = useUnitList();
      const {data:chapters, isLoading: chapterLoading} = useSubjectChapterList();
      const {data:questions, isLoading: qLoading} = useQuestionList();
      
      const {data:unitTest} = useSingleUnitTest();
      
      const [formData, setFormData] = useState({});
      
      const createMutation = useCreateUnitTest(formData);

      const [selectedQuestions, setSelectedQuestions] = useState([]);
      const [clicked, setClicked] = useState(false);
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
            let sample_id = params?.sample_id
            let classDatas = ["Data Which is already in List Like Schools, classess, subjects"];
            let class_name = getFilteredData(classDatas, sample_id, 'class_name'); 
            console.log(formData);
            //await createMutation.mutate(formData);
            
      }
      async function handleSelectQuestion(id){
            setClicked(true)
            document.getElementById(id).style.display = 'none';
            const filtered = await questions?.filter(q => q._id === id);
            // console.log(selectedQuestions?.length); return;
            if(selectedQuestions?.length > 0){
                  console.log('after Update code execute')
                  setSelectedQuestions((selectedQuestions) => [...selectedQuestions, filtered[0]]);
                  localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
                  setClicked(false)
            }else{
                  console.log('first code execute')
                  setSelectedQuestions((selectedQuestions) => [...selectedQuestions, filtered[0]]);
                  localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
                  setClicked(false)
            }
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
                              value={params?.class_id}
                              onChange={e => {
                                    if(e.target.value === '_'){
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/`)  
                                    }else{
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/${e.target.value}`)  
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
                        <div className="col-md-3">
                              <select className="form-control"
                              value={params?.subject_id}
                              onChange={e => {
                                    if(e.target.value === '_'){
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}`)                          
                                    }else{
                                          history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}/${e.target.value}`)                          
                                    }
                              }}>
                                    <option value="_">{subjectLoading ? 'Loading...':'Select Subjects'}</option>
                                    {subjects?.map(subject => {
                                          return(
                                                <option value={subject?._id} key={subject?._id}>{subject?.subject_name}</option>
                                          );
                                    })}
                              </select>
                        </div>
                        <div className="form-group col-md-3 pl-0">
                        <select className="form-control"
                        value={params?.unit_id}
                        onChange={e => {
                              if(e.target.value === '_'){
                                    history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}/${params?.subject_id}`)                          
                              }else{
                                    history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
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
                              history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}`)                          
                        }else{
                              history.push(`/admin/manage-unit-test/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${e.target.value}`)                          
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
                  <div className="col-md-6">
                        <div className="text-success mb-1">Questions: {questions?.length}</div>
                        <div  className="pr-2" style={{ height: '360px', overflowY: 'scroll'}}>
                        {questions?.map((q,i) => {
                              let sel = helper.checkExists(selectedQuestions,'_id',q?._id);
                              if(!sel)
                              return(
                              <div 
                              className={`card question col-md-12 pl-2 pr-0 mb-2 mr-2`}
                              key={q?._id}
                              id={`${q?._id}`}
                              onClick={handleSelectQuestion.bind(this, q?._id)}
                              >
                                    <div className="flex">
                                          <div className="col-md-2 pl-0 pr-0">Que. {i+1} </div>
                                          <div className="pb-0 mb-0" dangerouslySetInnerHTML={{ __html: q?.question  }} />
                                    </div>
                              </div>
                              )
                        })}
                        </div>
                  </div>
                  <div className="col-md-6">
                        <p className="text-success mb-1">Selected Questions: </p>
                        <div className="pr-2" style={{ height: '300px', overflowY: 'scroll'}}>
                        {selectedQuestions?.map((selQue, i) => {
                              return (
                              <div className="card question col-md-12 pl-2 pr-0 mb-2 mr-2" key={selQue?._id}>
                                    <div className="flex">
                                          <div className="col-md-2 pl-0 pr-0">Que. {i+1} </div>
                                          <div className="pb-0 mb-0" dangerouslySetInnerHTML={{ __html: selQue?.question  }} />
                                    </div>
                                    
                              </div>
                              )
                        })}
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
